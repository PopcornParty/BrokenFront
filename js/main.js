import { Input } from './input.js';
import { Game } from './game.js';
import { loadSave, writeSave, createFresh } from './save.js';
import { missionById, MISSIONS } from './missions.js';
import { DEFAULT_SETTINGS, VERSION } from './config.js';
import * as Audio from './audio.js';
import { renderChangelog, hasUnseenLog, markLogSeen } from './changelog.js';

const $ = (id) => document.getElementById(id);
const hide = (el) => el.classList.add('hidden');
const show = (el) => el.classList.remove('hidden');

const ui = {
  persist(save) { writeSave(save); },
  setObjective(obj) {
    const box = $('objective-box');
    box.classList.add('complete-flash');
    setTimeout(() => box.classList.remove('complete-flash'), 650);
    $('objective-text').textContent = (obj && obj.text) || obj || '';
    if ($('objective-hint')) $('objective-hint').textContent = (obj && obj.hint) || '';
  },
  nav(info) {
    const el = $('objective-nav');
    if (!el) return;
    if (!info) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    $('obj-dist').textContent = Math.max(1, Math.round(info.dist)) + 'm';
    $('obj-arrow').style.transform = `rotate(${info.angle * 57.3}deg)`;
  },
  showHud(on) { $('hud').classList.toggle('hidden', !on); $('touch-layer').classList.toggle('hidden', !on); },
  toast(msg) { this.radio(msg); },
  radio(msg) {
    $('radio-text').textContent = msg;
    show($('radio-box'));
    clearTimeout(this._rt);
    this._rt = setTimeout(() => hide($('radio-box')), 4200);
  },
  prompt(on) { $('interact-prompt').classList.toggle('hidden', !on); },
  muzzle() {
    const el = $('muzzle-flash');
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 50);
  },
  hitMark() {
    const el = $('hit-marker');
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  },
  damageFlash(ratio) {
    $('damage-vignette').style.boxShadow = `inset 0 0 ${80 + (1 - ratio) * 80}px rgba(90,20,10,${0.15 + (1 - ratio) * 0.45})`;
    setTimeout(() => { $('damage-vignette').style.boxShadow = 'inset 0 0 80px rgba(90,20,10,0)'; }, 180);
  },
  sync(game) {
    const hp = Math.max(0, game.player.hp / game.player.maxHp);
    $('health-fill').style.width = (hp * 100) + '%';
    $('weapon-name').textContent = game.weapon.name;
    $('ammo-text').textContent = game.weapon.reloading > 0 ? 'RELOAD' : `${game.weapon.magLeft} / ${game.weapon.reserve}`;
    $('grenade-text').textContent = 'G ' + game.nadeCount;
  },
  pause() { show($('pause-screen')); },
  nextMission(id) { loadMissionFlow(id, 0, true); },
  showEnding() {
    hide($('hud')); hide($('touch-layer')); hide($('pause-screen'));
    $('end-title').textContent = 'The flare goes up.';
    $('end-body').textContent = `${save.soldier.name} is still standing. The company is thinner. The river is quieter. That is the whole report.`;
    show($('end-screen'));
  }
};

let save = loadSave();
const input = new Input();
let game = null;

function applySettingsToForm() {
  $('set-master').value = save.settings.master;
  $('set-music').value = save.settings.music;
  $('set-sfx').value = save.settings.sfx;
  $('set-sens').value = save.settings.sensitivity;
  $('set-gfx').value = save.settings.graphics;
  $('set-diff').value = save.settings.difficulty;
  $('set-vib').checked = save.settings.vibration;
  $('set-swap').checked = save.settings.swapHands;
  if ($('set-opacity')) $('set-opacity').value = save.settings.buttonOpacity ?? 70;
  if ($('set-cam')) $('set-cam').checked = save.settings.cameraShake !== false;
  $('soldier-name').value = save.soldier.name;
  $('soldier-kit').value = save.soldier.kit;
  $('soldier-diff').value = save.settings.difficulty;
}

function readSettingsFromForm() {
  save.settings.master = +$('set-master').value;
  save.settings.music = +$('set-music').value;
  save.settings.sfx = +$('set-sfx').value;
  save.settings.sensitivity = +$('set-sens').value;
  save.settings.graphics = $('set-gfx').value;
  save.settings.difficulty = $('set-diff').value;
  save.settings.vibration = $('set-vib').checked;
  save.settings.swapHands = $('set-swap').checked;
  if ($('set-opacity')) save.settings.buttonOpacity = +$('set-opacity').value;
  if ($('set-cam')) save.settings.cameraShake = $('set-cam').checked;
  writeSave(save);
  Audio.applySettings(save.settings);
  document.body.classList.toggle('swap-hands', !!save.settings.swapHands);
  document.documentElement.style.setProperty('--btn-a', ((save.settings.buttonOpacity ?? 70) / 100).toFixed(2));
}

function refreshLogBadge() {
  const badge = $('log-new');
  if (badge) badge.classList.toggle('hidden', !hasUnseenLog());
  if ($('menu-version')) $('menu-version').textContent = 'v' + VERSION;
}

function showMenu() {
  hide($('boot-screen')); hide($('customize-screen')); hide($('settings-screen'));
  hide($('credits-screen')); hide($('changelog-screen')); hide($('loading-screen'));
  hide($('cutscene-screen')); hide($('pause-screen')); hide($('end-screen'));
  hide($('hud')); hide($('touch-layer'));
  show($('menu-screen'));
  $('btn-continue').classList.toggle('hidden', !save.hasProgress);
  refreshLogBadge();
}

function loadMissionFlow(id, checkpoint, skipCine) {
  const m = missionById(id);
  hide($('menu-screen')); hide($('customize-screen')); hide($('pause-screen')); hide($('end-screen'));
  show($('loading-screen'));
  $('load-kicker').textContent = m.kicker;
  $('load-title').textContent = `0${m.id}  ${m.title}`;
  $('load-brief').textContent = m.brief;
  $('load-fill').style.width = '15%';
  let w = 15;
  const tick = setInterval(() => {
    w = Math.min(100, w + 12 + Math.random() * 18);
    $('load-fill').style.width = w + '%';
    if (w >= 100) {
      clearInterval(tick);
      hide($('loading-screen'));
      if (id === 1 && !skipCine && checkpoint === 0) playOpening(() => bootGame(id, checkpoint));
      else bootGame(id, checkpoint);
    }
  }, 120);
}

function playOpening(done) {
  show($('cutscene-screen'));
  const lines = [
    'Grey River column. Dawn that does not feel like dawn.',
    'Trucks crawl. Nobody talks much. Everybody listens.',
    'Then the ridge lights up. The road comes apart.',
    'Friends vanish into smoke. Orders dissolve into noise.',
    'You hit the mud. The war does not pause for you.'
  ];
  let i = 0;
  $('cine-text').textContent = lines[0];
  const iv = setInterval(() => {
    i += 1;
    if (i >= lines.length) {
      clearInterval(iv);
      hide($('cutscene-screen'));
      done();
      return;
    }
    $('cine-text').textContent = lines[i];
  }, 5200);
  $('btn-skip-cine').onclick = () => { clearInterval(iv); hide($('cutscene-screen')); done(); };
}

function bootGame(id, checkpoint) {
  if (!game) {
    game = new Game($('game-canvas'), input, save, ui);
    input.attach(document.body);
  }
  game.save = save;
  game.startMission(id, checkpoint);
  show($('hud'));
  show($('touch-layer'));
}

function wire() {
  $('btn-play').onclick = () => { Audio.resumeAudio(); Audio.sfxUI(); show($('customize-screen')); hide($('menu-screen')); };
  $('btn-continue').onclick = () => {
    Audio.resumeAudio(); Audio.sfxUI();
    loadMissionFlow(save.mission || 1, save.checkpoint || 0, true);
  };
  $('btn-settings').onclick = () => { Audio.sfxUI(); applySettingsToForm(); show($('settings-screen')); };
  $('btn-credits').onclick = () => { Audio.sfxUI(); show($('credits-screen')); };
  $('btn-credits-back').onclick = () => { hide($('credits-screen')); };
  $('btn-update-log').onclick = () => {
    Audio.sfxUI();
    renderChangelog($('changelog-list'));
    markLogSeen();
    refreshLogBadge();
    hide($('menu-screen'));
    show($('changelog-screen'));
  };
  $('btn-log-back').onclick = () => { hide($('changelog-screen')); showMenu(); };
  $('btn-settings-back').onclick = () => { readSettingsFromForm(); hide($('settings-screen')); };
  $('btn-customize-back').onclick = () => { hide($('customize-screen')); show($('menu-screen')); };
  $('btn-customize-go').onclick = () => {
    save = createFresh();
    save.soldier.name = ($('soldier-name').value || 'Reed').slice(0, 16);
    save.soldier.kit = $('soldier-kit').value;
    save.settings = { ...DEFAULT_SETTINGS, ...save.settings, difficulty: $('soldier-diff').value };
    save.hasProgress = true;
    save.mission = 1;
    save.checkpoint = 0;
    writeSave(save);
    Audio.resumeAudio();
    loadMissionFlow(1, 0, false);
  };
  $('btn-resume').onclick = () => { hide($('pause-screen')); if (game) game.paused = false; };
  $('btn-restart-cp').onclick = () => { hide($('pause-screen')); loadMissionFlow(save.mission || 1, save.checkpoint || 0, true); };
  $('btn-pause-settings').onclick = () => { applySettingsToForm(); show($('settings-screen')); };
  $('btn-pause-menu').onclick = () => { if (game) game.running = false; hide($('pause-screen')); showMenu(); };
  $('btn-end-menu').onclick = () => { showMenu(); };

  ['set-master','set-music','set-sfx','set-opacity'].forEach((id) => {
    if ($(id)) $(id).addEventListener('input', () => { readSettingsFromForm(); });
  });
  const fs = () => {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) req.call(root);
    } else if (document.exitFullscreen) document.exitFullscreen();
  };
  ['btn-fullscreen', 'btn-hud-fs', 'btn-menu-fs'].forEach((id) => {
    if ($(id)) $(id).onclick = () => { Audio.sfxUI(); fs(); };
  });
}

function boot() {
  applySettingsToForm();
  document.body.classList.toggle('swap-hands', !!save.settings.swapHands);
  document.documentElement.style.setProperty('--btn-a', ((save.settings.buttonOpacity ?? 70) / 100).toFixed(2));
  Audio.initAudio(save.settings);
  wire();
  let p = 8;
  const iv = setInterval(() => {
    p = Math.min(100, p + 10);
    $('boot-fill').style.width = p + '%';
    if (p >= 100) {
      clearInterval(iv);
      showMenu();
    }
  }, 80);
  document.body.addEventListener('pointerdown', () => { Audio.initAudio(save.settings); Audio.resumeAudio(); }, { once: true });
}

boot();
void MISSIONS;
