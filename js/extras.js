import * as THREE from 'three';
import { WEAPONS } from './config.js';
import { unlockForMission, writeSave } from './save.js';

export const GUN_INFO = {
  rifle: { name: 'SERVICE RIFLE', unlock: 'Issued from the start', dmg: '54', rate: 'bolt' },
  pistol: { name: 'SIDEARM', unlock: 'Issued from the start', dmg: '22', rate: 'semi' },
  smg: { name: 'FIELD SMG', unlock: 'Unlocks after Mission 2', dmg: '20', rate: 'auto' },
  carbine: { name: 'CARBINE', unlock: 'Unlocks after Mission 4', dmg: '30', rate: 'auto' }
};

export function installFeel(Game) {
  const prevStart = Game.prototype.startMission;
  Game.prototype.startMission = function (id, checkpoint) {
    const out = prevStart.call(this, id, checkpoint);
    try {
      this.hemi.intensity = 1.25;
      this.sun.intensity = 1.45;
      this.fill.intensity = 0.35;
      this.scene.background = new THREE.Color(0xc8c0a6);
      this.scene.fog = new THREE.Fog(0xc4bba0, 22, 160);
      this.renderer.toneMappingExposure = 1.22;
      if (this.save) {
        unlockForMission(this.save);
        const idw = this.save.loadout && WEAPONS[this.save.loadout] ? this.save.loadout : 'rifle';
        const w = WEAPONS[idw];
        this.weapon = { ...w, magLeft: w.mag, reserve: Math.round(w.reserve * (this.diff?.ammoMul || 1)), cool: 0, reloading: 0, ads: 0 };
        writeSave(this.save);
      }
    } catch (e) {}
    return out;
  };

  const prevFire = Game.prototype.tryFire;
  Game.prototype.tryFire = function () {
    const before = this.weapon.cool;
    prevFire.call(this);
    if (this.weapon.cool > before || this.weapon.cool === this.weapon.rate) {
      this.flashShot();
    }
  };

  Game.prototype.flashShot = function () {
    if (!this.muzzleLight) {
      this.muzzleLight = new THREE.PointLight(0xffe6a8, 0, 18);
      this.camera.add(this.muzzleLight);
      this.muzzleLight.position.set(0.2, -0.05, -0.6);
    }
    this.muzzleLight.intensity = 3.2;
    const el = document.getElementById('muzzle-flash');
    if (el) { el.style.opacity = '1'; el.style.transform = 'scale(1.2)'; }
    clearTimeout(this._mf);
    this._mf = setTimeout(() => {
      if (this.muzzleLight) this.muzzleLight.intensity = 0;
      if (el) { el.style.opacity = '0'; el.style.transform = 'scale(1)'; }
    }, 55);
  };
}

export function renderArmory(root, save) {
  unlockForMission(save);
  const unlocked = new Set(save.unlocked || ['rifle', 'pistol']);
  root.innerHTML = '';
  Object.keys(GUN_INFO).forEach((id) => {
    const info = GUN_INFO[id];
    const open = unlocked.has(id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'btn armory-card' + (save.loadout === id ? ' primary' : '');
    card.disabled = !open;
    card.style.minWidth = '100%';
    card.style.textAlign = 'left';
    card.style.margin = '0 0 8px';
    card.innerHTML = open
      ? `<strong>${info.name}</strong><br/><span style="opacity:.7;letter-spacing:.08em;font-size:11px">${info.rate} · DMG ${info.dmg}${save.loadout === id ? ' · EQUIPPED' : ''}</span>`
      : `<strong>LOCKED</strong><br/><span style="opacity:.7;letter-spacing:.08em;font-size:11px">${info.unlock}</span>`;
    if (open) {
      card.onclick = () => {
        save.loadout = id;
        writeSave(save);
        renderArmory(root, save);
      };
    }
    root.appendChild(card);
  });
}
