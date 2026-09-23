import * as THREE from 'three';
import { KIT_COLORS } from './config.js';

function noise2(x, z) {
  return Math.sin(x * 0.071 + z * 0.053) * 0.55 + Math.sin(x * 0.19 - z * 0.14) * 0.22 + Math.sin(x * 0.41 + z * 0.33) * 0.08;
}

export function makeTextures() {
  const mk = (w, h, paint) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    paint(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const mud = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#6a5438'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 80; i++) {
      g.fillStyle = i % 2 ? '#4a3a24' : '#8a7350';
      g.fillRect(Math.random() * w, Math.random() * h, 8 + Math.random() * 18, 4);
    }
  });
  mud.repeat.set(12, 16);
  const brick = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#3e322b'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 10) {
      const off = ((y / 10) % 2) * 11;
      for (let x = -22; x < w; x += 22) {
        g.fillStyle = `rgb(${110 + ((x + y) % 30)},${70 + ((x) % 20)},50)`;
        g.fillRect(x + off + 1, y + 1, 20, 8);
      }
    }
  });
  const sand = mk(64, 64, (g, w, h) => { g.fillStyle = '#8a7a4e'; g.fillRect(0, 0, w, h); });
  const wood = mk(64, 64, (g, w, h) => {
    g.fillStyle = '#3c2818'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(20,10,4,0.4)';
    for (let x = 0; x < w; x += 7) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 2, h); g.stroke(); }
  });
  const smoke = mk(64, 64, (g, w, h) => {
    const grd = g.createRadialGradient(32, 32, 4, 32, 32, 32);
    grd.addColorStop(0, 'rgba(160,150,130,0.5)');
    grd.addColorStop(1, 'rgba(160,150,130,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  const sky = mk(8, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#6e7278'); grd.addColorStop(0.55, '#b3a888'); grd.addColorStop(1, '#c8ba96');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  sky.wrapS = sky.wrapT = THREE.ClampToEdgeWrapping;
  return { mud, brick, sand, wood, smoke, sky };
}

export class World {
  constructor(scene, theme, gfx) {
    this.scene = scene;
    this.theme = theme;
    this.gfx = gfx || {};
    this.colliders = [];
    this.smoke = [];
    this.flashes = [];
    this.farBits = [];
    this.tex = makeTextures();
    this.mats = {
      mud: new THREE.MeshLambertMaterial({ map: this.tex.mud, color: 0xc2ad88 }),
      brick: new THREE.MeshLambertMaterial({ map: this.tex.brick, color: 0xd0b69c }),
      sand: new THREE.MeshLambertMaterial({ map: this.tex.sand, color: 0xd4c090 }),
      wood: new THREE.MeshLambertMaterial({ map: this.tex.wood, color: 0x8a6a44 }),
      grass: new THREE.MeshLambertMaterial({ color: 0x6a7848 }),
      conc: new THREE.MeshLambertMaterial({ color: 0xa8a498 }),
      dark: new THREE.MeshLambertMaterial({ color: 0x2c261c }),
      rust: new THREE.MeshLambertMaterial({ color: 0x5a3a24 }),
      rock: new THREE.MeshLambertMaterial({ color: 0x8a8478 }),
      smoke: new THREE.MeshBasicMaterial({ map: this.tex.smoke, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide })
    };
    this.boxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.craters = [
      { x: 5, z: -12, r: 3, d: 0.5 }, { x: -6, z: -28, r: 2.4, d: 0.4 },
      { x: 4, z: -48, r: 3.2, d: 0.55 }, { x: -3, z: -72, r: 2.8, d: 0.4 }
    ];
    this.buildSky();
    this.buildTerrain();
    this.buildLane();
    this.buildTheme(theme);
    this.scatterBits();
  }

  heightAt(x, z) {
    let h = noise2(x, z) * 0.7;
    for (const c of this.craters) {
      const t = 1 - Math.hypot(x - c.x, z - c.z) / c.r;
      if (t > 0) h -= Math.pow(t, 1.6) * c.d;
    }
    return h;
  }

  addCollider(x, y, z, w, h, d, opts = {}) {
    this.colliders.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
      los: opts.los !== false,
      low: !!opts.low
    });
  }

  meshBox(x, y, z, w, h, d, mat, opts = {}) {
    const m = new THREE.Mesh(this.boxGeo, mat);
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    this.scene.add(m);
    if (!opts.noCollide) this.addCollider(x, y, z, w, h, d, opts);
    return m;
  }

  buildSky() {
    const sky = new THREE.Mesh(new THREE.SphereGeometry(180, 12, 8), new THREE.MeshBasicMaterial({ map: this.tex.sky, side: THREE.BackSide, fog: false }));
    this.scene.add(sky);
    this.sky = sky;
  }

  buildTerrain() {
    const seg = this.gfx.terrainSeg || 28;
    const geo = new THREE.PlaneGeometry(80, 160, seg, Math.round(seg * 1.4));
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, this.heightAt(pos.getX(i), pos.getY(i) - 40));
    geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, this.mats.mud);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -40);
    this.scene.add(ground);
    this.meshBox(0, 0.04, -40, 5.5, 0.08, 140, this.mats.conc, { noCollide: true, low: true });
  }

  buildLane() {
    for (let z = 14; z > -110; z -= 16) {
      const b = Math.sin(z * 0.08) * 1.1;
      this.meshBox(-12.2 + b, 1.9, z - 8, 6, 4.2, 16.2, this.mats.mud);
      this.meshBox(12.2 + b * 0.3, 1.9, z - 8, 6, 4.2, 16.2, this.mats.mud);
      this.meshBox(-15.5, 3.6, z - 8, 3, 3.4, 15, this.mats.grass, { noShadow: true });
      this.meshBox(15.5, 3.6, z - 8, 3, 3.4, 15, this.mats.grass, { noShadow: true });
    }
    this.meshBox(0, 2.4, 16, 28, 5, 4, this.mats.mud);
    this.meshBox(0, 2.4, -116, 28, 5, 4, this.mats.mud);
  }

  trench(x, z, len) {
    const y = this.heightAt(x, z) + 0.42;
    this.meshBox(x, y, z, 7.2, 0.85, len, this.mats.sand, { low: true });
    this.meshBox(x + 3.4, y + 0.1, z, 1.15, 1.05, len, this.mats.sand, { low: true });
    this.meshBox(x - 3.4, y + 0.1, z, 1.15, 1.05, len, this.mats.sand, { low: true });
  }

  ruin(x, z, w = 7, d = 6.5, h = 3.6) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + h * 0.42, z - d * 0.35, w, h * 0.84, 0.5, this.mats.brick);
    this.meshBox(x - w * 0.42, gy + h * 0.38, z, 0.5, h * 0.76, d * 0.7, this.mats.brick);
    this.meshBox(x + w * 0.2, gy + 0.28, z + 0.8, 1.6, 0.55, 1.2, this.mats.brick, { low: true });
  }

  wreck(x, z) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + 0.7, z, 4.2, 1.3, 2, this.mats.rust);
    this.meshBox(x + 1.5, gy + 1.15, z, 1.1, 1, 2.1, this.mats.dark);
  }

  rock(x, z, s = 1) {
    const gy = this.heightAt(x, z);
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65 * s, 0), this.mats.rock);
    m.position.set(x, gy + 0.32 * s, z);
    m.rotation.set(0.4, 0.7, 0.2);
    this.scene.add(m);
    this.addCollider(x, gy + 0.35 * s, z, 1.2 * s, 0.9 * s, 1.2 * s);
  }

  crate(x, z) {
    this.meshBox(x, this.heightAt(x, z) + 0.45, z, 1, 0.9, 1, this.mats.wood, { low: true });
  }

  buildTheme(theme) {
    this.wreck(-4, 2); this.wreck(5, -9); this.wreck(-5, -36);
    this.trench(0, -18, 13);
    this.meshBox(-1, this.heightAt(-1, -26) + 0.55, -26, 10, 1.1, 1.5, this.mats.sand, { low: true });
    this.ruin(-8, -34, 7, 6, 3.6);
    this.ruin(8, -44, 7, 6, 3.5);
    this.trench(1, -62, 12);
    this.crate(4, -60); this.crate(-3, -18);
    this.rock(-6, -6, 1.3); this.rock(6, -16, 1.15); this.rock(-6, -48, 1.4);
    this.rock(5, -28, 1.1); this.rock(-3, -72, 1.2);
    this.wreck(3, -74);
    if (theme === 'town' || theme === 'final' || theme === 'bunker' || theme === 'outskirts' || theme === 'townedge' || theme === 'approach') {
      this.ruin(-7, -80, 7, 6.5, 4.2);
      this.ruin(7, -86, 7, 6.5, 4);
    }
  }

  scatterBits() {
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), this.mats.smoke.clone());
      s.material.opacity = 0.28;
      s.position.set(-8 + Math.random() * 16, 2.6, -10 - i * 11);
      this.scene.add(s);
      this.smoke.push(s);
    }
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.55, 3, 5), this.mats.dark);
      g.position.set(-8 + (i % 3) * 8, 0.7, -90 - (i % 4) * 6);
      this.scene.add(g);
      this.farBits.push({ g, p: i });
    }
    for (let i = 0; i < 10; i++) {
      const x = -50 + i * 10;
      const h = 5 + (i % 4) * 2;
      this.meshBox(x, h / 2, -122, 3.4, h, 2.4, i % 2 ? this.mats.brick : this.mats.conc, { noCollide: true });
    }
  }

  blockedLOS(from, to) {
    const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.4) return false;
    const steps = Math.min(28, Math.max(8, Math.floor(len / 0.6)));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = from.x + dx * t, py = from.y + dy * t, pz = from.z + dz * t;
      for (const c of this.colliders) {
        if (!c.los) continue;
        if (c.low && py > c.max.y + 0.15) continue;
        if (px >= c.min.x && px <= c.max.x && py >= c.min.y && py <= c.max.y && pz >= c.min.z && pz <= c.max.z) return true;
      }
    }
    return false;
  }

  setBeacon() {}

  update(t, camera) {
    this.smoke.forEach((s, i) => {
      s.position.y = 2.4 + Math.sin(t * 0.35 + i) * 0.3;
      if (camera) s.lookAt(camera.position);
    });
    if (this.sky) this.sky.rotation.y = t * 0.003;
  }

  collide(pos, radius = 0.4) {
    for (const c of this.colliders) {
      const nx = Math.max(c.min.x, Math.min(pos.x, c.max.x));
      const nz = Math.max(c.min.z, Math.min(pos.z, c.max.z));
      const dx = pos.x - nx, dz = pos.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius && pos.y < c.max.y + 0.25) {
        const d = Math.sqrt(d2) || 0.0001;
        pos.x += (dx / d) * (radius - d);
        pos.z += (dz / d) * (radius - d);
      }
    }
    pos.x = THREE.MathUtils.clamp(pos.x, -10.2, 10.2);
    pos.z = THREE.MathUtils.clamp(pos.z, -108, 14);
  }

  dispose() {
    const kids = this.scene.children.slice();
    for (const ch of kids) {
      if (ch.isLight || ch.isCamera) continue;
      this.scene.remove(ch);
    }
    Object.values(this.tex).forEach((t) => t.dispose());
  }
}

export function makeSoldierMesh(color = KIT_COLORS.olive, enemy = false) {
  const g = new THREE.Group();
  const cloth = new THREE.MeshLambertMaterial({ color: enemy ? 0x4a4034 : color });
  const dark = new THREE.MeshLambertMaterial({ color: 0x2a241c });
  const skin = new THREE.MeshLambertMaterial({ color: 0xc2a07a });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.72, 3, 6), cloth);
  body.position.y = 0.95;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), skin);
  head.position.y = 1.55;
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark);
  helm.position.y = 1.62;
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.9), dark);
  gun.position.set(0.22, 1.05, -0.35);
  g.add(body, head, helm, gun);
  g.userData.body = body;
  return g;
}
