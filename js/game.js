import * as THREE from 'three';
import { DIFFICULTY, WEAPONS, GFX, KIT_COLORS } from './config.js';
import { missionById } from './missions.js';
import { World, makeSoldierMesh } from './world.js';
import { EnemyManager } from './ai.js';
import * as Audio from './audio.js';

export class Game {
  constructor(canvas, input, save, ui) {
    this.canvas = canvas;
    this.input = input;
    this.save = save;
    this.ui = ui;
    this.running = false;
    this.paused = false;
    this.clock = new THREE.Clock();
    this.missionTime = 0;
    this.objIndex = 0;
    this.objTimer = 0;
    this.kills = 0;
    this.neededKills = 0;
    this.looked = 0;
    this.radioShown = new Set();
    this.eventFired = new Set();
    this.waveFired = new Set();
    this.grenades = [];
    this.tracers = [];
    this.shake = 0;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6d6758);
    this.scene.fog = new THREE.Fog(0x6d6758, 18, 120);
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 220);
    this.weaponCam = this.camera;
    this.hemi = new THREE.HemisphereLight(0xc9c2a8, 0x3a3224, 1.05);
    this.sun = new THREE.DirectionalLight(0xe8dcb0, 0.85);
    this.sun.position.set(30, 50, 10);
    this.scene.add(this.hemi, this.sun);
    this.player = { pos: new THREE.Vector3(0, 1.7, 0), vel: new THREE.Vector3(), yaw: 0, pitch: 0, hp: 100, maxHp: 100, lastHurt: 0, grounded: true, crouched: false, height: 1.7 };
    this.weapon = { ...WEAPONS.rifle, magLeft: WEAPONS.rifle.mag, reserve: WEAPONS.rifle.reserve, cool: 0, reloading: 0, ads: 0 };
    this.pistol = { ...WEAPONS.pistol, magLeft: WEAPONS.pistol.mag, reserve: WEAPONS.pistol.reserve };
    this.nadeCount = 2;
    this.viewmodel = null;
    this.world = null;
    this.enemies = null;
    this.mission = null;
    this.pickups = [];
    this.loop = this.loop.bind(this);
    window.addEventListener('resize', () => this.resize());
  }
  applyGfx() {
    const g = GFX[this.save.settings.graphics] || GFX.medium;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, g.pixelRatio));
    this.scene.fog.far = g.fogFar;
    this.gfx = g;
  }
  startMission(id, checkpoint = 0) {
    this.applyGfx();
    if (this.world) this.world.dispose();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6d6758);
    this.scene.fog = new THREE.Fog(0x6d6758, 18, this.gfx.fogFar);
    this.scene.add(this.hemi, this.sun);
    this.mission = missionById(id);
    this.world = new World(this.scene, this.mission.theme, this.gfx);
    const diff = DIFFICULTY[this.save.settings.difficulty] || DIFFICULTY.normal;
    this.diff = diff;
    this.player.maxHp = diff.playerHp;
    this.player.hp = diff.playerHp;
    this.player.pos.set(...this.mission.spawn);
    this.player.yaw = this.mission.yaw || 0;
    this.player.pitch = 0;
    this.player.vel.set(0, 0, 0);
    this.weapon = { ...WEAPONS.rifle, magLeft: WEAPONS.rifle.mag, reserve: Math.round(WEAPONS.rifle.reserve * diff.ammoMul), cool: 0, reloading: 0, ads: 0 };
    this.nadeCount = this.save.settings.difficulty === 'easy' ? 3 : 2;
    this.objIndex = checkpoint;
    this.objTimer = 0;
    this.missionTime = 0;
    this.kills = 0;
    this.neededKills = 0;
    this.looked = 0;
    this.radioShown = new Set();
    this.eventFired = new Set();
    this.waveFired = new Set();
    this.grenades = [];
    this.tracers = [];
    this.enemies = new EnemyManager(this.scene, this.mission.enemies || [], diff.enemyHp, diff.enemyAcc);
    this.spawnPickups();
    this.buildViewmodel();
    this.running = true;
    this.paused = false;
    this.clock.getDelta();
    this.ui.setObjective(this.currentObj().text);
    this.ui.showHud(true);
    this.resize();
    if (!this._raf) this._raf = requestAnimationFrame(this.loop);
  }
  spawnPickups() {
    this.pickups = (this.mission.pickups || []).map((p) => {
      const color = p.type === 'med' ? 0x6a8a5a : p.type === 'grenade' ? 0x4a5530 : p.type === 'ammo' ? 0x3a3428 : 0x2a2418;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), new THREE.MeshLambertMaterial({ color }));
      mesh.position.set(p.x, 0.35, p.z);
      this.scene.add(mesh);
      return { ...p, mesh, taken: false };
    });
  }
  buildViewmodel() {
    while (this.camera.children.length) this.camera.remove(this.camera.children[0]);
    this.viewmodel = new THREE.Group();
    const wood = new THREE.MeshLambertMaterial({ color: 0x5a3a22 });
    const iron = new THREE.MeshLambertMaterial({ color: 0x2a2a28 });
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.34), wood);
    stock.position.set(0.22, -0.16, -0.42);
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.55), iron);
    barrel.position.set(0.22, -0.1, -0.78);
    this.viewmodel.add(stock, barrel);
    this.viewmodel.position.set(0, 0, 0);
    this.camera.add(this.viewmodel);
    this.scene.add(this.camera);
  }
  currentObj() {
    return this.mission.objectives[Math.min(this.objIndex, this.mission.objectives.length - 1)];
  }
  loop() {
    this._raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, this.clock.getDelta());
    if (!this.running) return;
    if (this.paused) { this.renderer.render(this.scene, this.camera); return; }
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  }
  update(dt) {
    this.missionTime += dt;
    Audio.tickMusic(dt);
    this.handleInput(dt);
    this.movePlayer(dt);
    this.updateWeapon(dt);
    this.updateObjectives(dt);
    this.updatePickups();
    this.updateGrenades(dt);
    this.updateTracers(dt);
    const shots = this.enemies.update(dt, this.player, this.world);
    shots.forEach((s) => { this.addTracer(s.from, s.toward); if (s.hit) this.hurt(s.dmg); });
    this.world.update(this.missionTime);
    this.updateCamera(dt);
    this.updateRadio();
    this.updateEvents();
    this.regen(dt);
    this.ui.sync(this);
    if (this.player.hp <= 0) this.onDeath();
  }
  handleInput(dt) {
    if (this.input.pulse('pause')) { this.ui.pause(true); this.paused = true; return; }
    const look = this.input.consumeLook((this.save.settings.sensitivity / 100) * (this.weapon.ads > 0.5 ? 0.55 : 1));
    this.player.yaw -= look.x;
    this.player.pitch -= look.y;
    this.player.pitch = THREE.MathUtils.clamp(this.player.pitch, -1.2, 1.2);
    this.looked += Math.abs(look.x) + Math.abs(look.y);
    if (this.input.pulse('reload')) this.startReload();
    if (this.input.pulse('grenade')) this.throwGrenade();
    if (this.input.pulse('jump') && this.player.grounded) { this.player.vel.y = 5.2; this.player.grounded = false; }
    this.player.crouched = this.input.crouch;
    this.weapon.ads = THREE.MathUtils.lerp(this.weapon.ads, this.input.aim ? 1 : 0, 1 - Math.pow(0.001, dt));
    if (this.input.fire) this.tryFire();
    if (this.input.pulse('use')) this.tryUse();
  }
  movePlayer(dt) {
    const mv = this.input.sampleMove();
    const speed = (this.player.crouched ? 2.3 : this.input.sprint ? 6.4 : 4.2);
    const forward = new THREE.Vector3(-Math.sin(this.player.yaw), 0, -Math.cos(this.player.yaw));
    const right = new THREE.Vector3(Math.cos(this.player.yaw), 0, -Math.sin(this.player.yaw));
    const wish = forward.multiplyScalar(mv.y).add(right.multiplyScalar(mv.x));
    this.player.vel.x = wish.x * speed;
    this.player.vel.z = wish.z * speed;
    this.player.vel.y -= 16 * dt;
    this.player.pos.addScaledVector(this.player.vel, dt);
    const stand = this.player.crouched ? 1.15 : 1.7;
    this.player.height = THREE.MathUtils.lerp(this.player.height, stand, 8 * dt);
    if (this.player.pos.y < this.player.height) { this.player.pos.y = this.player.height; this.player.vel.y = 0; this.player.grounded = true; }
    this.world.collide(this.player.pos, 0.38);
    if ((Math.abs(mv.x) + Math.abs(mv.y)) > 0.2 && this.player.grounded) {
      if (!this._stepT) this._stepT = 0;
      this._stepT += dt;
      if (this._stepT > 0.42) { Audio.sfxStep(); this._stepT = 0; }
    }
  }
  updateWeapon(dt) {
    this.weapon.cool = Math.max(0, this.weapon.cool - dt);
    if (this.weapon.reloading > 0) {
      this.weapon.reloading -= dt;
      if (this.weapon.reloading <= 0) {
        const need = this.weapon.mag - this.weapon.magLeft;
        const take = Math.min(need, this.weapon.reserve);
        this.weapon.magLeft += take;
        this.weapon.reserve -= take;
      }
    }
    if (this.viewmodel) {
      const kick = this.weapon.cool > this.weapon.rate * 0.6 ? 0.04 : 0;
      this.viewmodel.position.set(0.02, -0.02 - kick, -0.04 - this.weapon.ads * 0.08);
      this.viewmodel.rotation.set(kick * 2, 0.02, 0);
      this.viewmodel.visible = true;
    }
  }
  tryFire() {
    if (this.weapon.reloading > 0 || this.weapon.cool > 0) return;
    if (this.weapon.magLeft <= 0) { this.startReload(); return; }
    this.weapon.magLeft -= 1;
    this.weapon.cool = this.weapon.rate;
    this.player.pitch += this.weapon.recoil;
    this.shake = 0.08;
    Audio.sfxShot(this.weapon.id);
    this.ui.muzzle();
    if (this.save.settings.vibration && navigator.vibrate) navigator.vibrate(12);
    const origin = this.camera.position.clone();
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    dir.x += (Math.random() - 0.5) * this.weapon.spread * (this.weapon.ads ? 0.4 : 1);
    dir.y += (Math.random() - 0.5) * this.weapon.spread * (this.weapon.ads ? 0.4 : 1);
    dir.normalize();
    const end = origin.clone().addScaledVector(dir, 70);
    this.addTracer(origin, end);
    const hit = this.enemies.rayHit(origin, dir, 80);
    if (hit) {
      const dead = hit.unit.damage(this.weapon.dmg);
      Audio.sfxHit();
      this.ui.hitMark();
      if (dead) this.kills += 1;
    }
    if (!this.weapon.auto) this.input.fire = this.input.isTouch ? this.input.fire : false;
  }
  startReload() {
    if (this.weapon.reloading > 0 || this.weapon.magLeft >= this.weapon.mag || this.weapon.reserve <= 0) return;
    this.weapon.reloading = this.weapon.reload;
    Audio.sfxReload();
  }
  throwGrenade() {
    if (this.nadeCount <= 0) return;
    this.nadeCount -= 1;
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshLambertMaterial({ color: 0x3a4028 }));
    mesh.position.copy(this.player.pos).add(dir.multiplyScalar(1.2));
    this.scene.add(mesh);
    this.grenades.push({ mesh, vel: dir.multiplyScalar(14).add(new THREE.Vector3(0, 3.5, 0)), life: 1.35 });
  }
  updateGrenades(dt) {
    this.grenades = this.grenades.filter((g) => {
      g.vel.y -= 16 * dt;
      g.mesh.position.addScaledVector(g.vel, dt);
      if (g.mesh.position.y < 0.12) { g.mesh.position.y = 0.12; g.vel.y *= -0.2; g.vel.x *= 0.6; g.vel.z *= 0.6; }
      g.life -= dt;
      if (g.life <= 0) {
        Audio.sfxExplode();
        this.shake = 0.25;
        this.enemies.living().forEach((u) => {
          const d = u.pos.distanceTo(g.mesh.position);
          if (d < 7) { if (u.damage(70 * (1 - d / 7))) this.kills += 1; }
        });
        this.scene.remove(g.mesh);
        return false;
      }
      return true;
    });
  }
  addTracer(from, to) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xe8d7a0, transparent: true, opacity: 0.55 }));
    this.scene.add(line);
    this.tracers.push({ line, life: 0.08 });
  }
  updateTracers(dt) {
    this.tracers = this.tracers.filter((t) => {
      t.life -= dt;
      if (t.life <= 0) { this.scene.remove(t.line); t.line.geometry.dispose(); return false; }
      return true;
    });
  }
  updatePickups() {
    this.pickups.forEach((p) => {
      if (p.taken) return;
      p.mesh.rotation.y += 0.02;
      p.mesh.position.y = 0.35 + Math.sin(this.missionTime * 3) * 0.05;
      if (this.player.pos.distanceTo(p.mesh.position) < 1.6) this.takePickup(p);
    });
  }
  takePickup(p) {
    p.taken = true;
    this.scene.remove(p.mesh);
    Audio.sfxPickup();
    if (p.type === 'med') this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
    if (p.type === 'ammo') this.weapon.reserve += Math.round(this.weapon.mag * 3 * this.diff.ammoMul);
    if (p.type === 'grenade') this.nadeCount += 1;
    if (p.type === 'smg' || p.type === 'carbine') {
      const w = WEAPONS[p.type];
      this.weapon = { ...w, magLeft: w.mag, reserve: Math.round(w.reserve * this.diff.ammoMul), cool: 0, reloading: 0, ads: this.weapon.ads };
    }
    this.ui.toast('Picked up ' + p.type.toUpperCase());
  }
  tryUse() {
    const obj = this.currentObj();
    if (obj.type === 'interact') {
      const d = this.player.pos.distanceTo(new THREE.Vector3(obj.pos[0], this.player.pos.y, obj.pos[2]));
      if (d < obj.r) this.advanceObj();
    }
  }
  updateObjectives(dt) {
    const obj = this.currentObj();
    if (!obj) return;
    if (obj.type === 'look') {
      this.objTimer += dt;
      if (this.looked > 0.4 && this.objTimer > obj.duration) this.advanceObj();
    } else if (obj.type === 'reach') {
      const t = new THREE.Vector3(obj.pos[0], this.player.pos.y, obj.pos[2]);
      if (this.player.pos.distanceTo(t) < obj.r) this.advanceObj();
    } else if (obj.type === 'clear') {
      this.neededKills = obj.count;
      if (this.kills >= obj.count) this.advanceObj();
    } else if (obj.type === 'survive') {
      this.objTimer += dt;
      if (this.objTimer >= obj.duration) this.advanceObj();
    } else if (obj.type === 'interact') {
      const t = new THREE.Vector3(obj.pos[0], this.player.pos.y, obj.pos[2]);
      this.ui.prompt(this.player.pos.distanceTo(t) < obj.r + 1.5);
    }
  }
  advanceObj() {
    this.objIndex += 1;
    this.objTimer = 0;
    this.kills = 0;
    this.save.checkpoint = this.objIndex;
    this.save.mission = this.mission.id;
    this.save.hasProgress = true;
    this.ui.persist(this.save);
    if (this.objIndex >= this.mission.objectives.length) { this.completeMission(); return; }
    this.ui.setObjective(this.currentObj().text);
    Audio.sfxUI();
  }
  completeMission() {
    if (this.mission.id >= 7) {
      this.running = false;
      this.save.completed = true;
      this.save.hasProgress = true;
      this.ui.persist(this.save);
      this.ui.showEnding();
      return;
    }
    this.save.mission = this.mission.id + 1;
    this.save.checkpoint = 0;
    this.save.hasProgress = true;
    this.ui.persist(this.save);
    this.ui.nextMission(this.save.mission);
  }
  updateRadio() {
    (this.mission.radio || []).forEach((r, i) => {
      if (this.missionTime >= r.t && !this.radioShown.has(i)) {
        this.radioShown.add(i);
        this.ui.radio(r.msg);
        Audio.sfxRadio();
      }
    });
  }
  updateEvents() {
    (this.mission.events || []).forEach((e, i) => {
      if (this.missionTime >= e.t && !this.eventFired.has(i)) {
        this.eventFired.add(i);
        this.shake = 0.3;
        Audio.sfxExplode();
      }
    });
    (this.mission.waves || []).forEach((w, i) => {
      if (this.missionTime >= w.t && !this.waveFired.has(i)) {
        this.waveFired.add(i);
        this.enemies.spawn(w.n, w.z, this.player.pos.z);
      }
    });
  }
  hurt(raw) {
    const dmg = raw * this.diff.dmgTaken;
    this.player.hp = Math.max(0, this.player.hp - dmg);
    this.player.lastHurt = this.missionTime;
    this.shake = 0.12;
    Audio.sfxHurt();
    this.ui.damageFlash(this.player.hp / this.player.maxHp);
    if (this.save.settings.vibration && navigator.vibrate) navigator.vibrate(30);
  }
  regen(dt) {
    if (this.missionTime - this.player.lastHurt > 4 && this.player.hp > 0) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 8 * dt);
    }
  }
  updateCamera(dt) {
    this.shake = Math.max(0, this.shake - dt);
    const s = this.shake * (Math.random() - 0.5);
    this.camera.position.copy(this.player.pos);
    this.camera.position.x += s * 0.4;
    this.camera.position.y += s * 0.3;
    this.camera.rotation.set(this.player.pitch, this.player.yaw, 0, 'YXZ');
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.weapon.ads > 0.5 ? 52 : 72, 8 * dt);
    this.camera.updateProjectionMatrix();
  }
  onDeath() {
    this.player.hp = this.player.maxHp;
    this.player.pos.set(...this.mission.spawn);
    this.player.vel.set(0, 0, 0);
    this.ui.toast('You drop. The line pulls you back to the last mark.');
    this.objTimer = 0;
  }
  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}
