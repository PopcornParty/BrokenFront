import * as THREE from 'three';
import { KIT_COLORS } from './config.js';

function noise2(x, z) {
  const a = Math.sin(x * 0.071 + z * 0.053) * 0.55;
  const b = Math.sin(x * 0.19 - z * 0.14) * 0.22;
  const c = Math.sin(x * 0.41 + z * 0.33) * 0.08;
  return a + b + c;
}

export function makeTextures(quality = 1) {
  const s = quality < 0.8 ? 128 : 256;
  const mk = (w, h, paint) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    paint(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  const mud = mk(s, s, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = (Math.sin(x * 0.17) + Math.cos(y * 0.13) + Math.sin((x + y) * 0.09)) * 0.5;
        const dirt = 18 + ((x * 13 + y * 7) % 17);
        const i = (y * w + x) * 4;
        img.data[i] = 78 + n * 16 + dirt;
        img.data[i + 1] = 62 + n * 12 + dirt * 0.6;
        img.data[i + 2] = 38 + n * 8;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    g.globalAlpha = 0.28;
    for (let i = 0; i < 80; i++) {
      g.fillStyle = i % 3 ? '#3a2c1c' : '#6a5a38';
      g.beginPath();
      g.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 18, 3 + Math.random() * 8, Math.random(), 0, 6.28);
      g.fill();
    }
    g.globalAlpha = 1;
  });
  mud.repeat.set(14, 18);

  const grass = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#3a4a28'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 500; i++) {
      g.strokeStyle = `rgba(${40 + Math.random() * 50},${70 + Math.random() * 50},${20 + Math.random() * 20},0.7)`;
      const x = Math.random() * w, y = Math.random() * h;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 4, y - 6 - Math.random() * 8); g.stroke();
    }
  });

  const brick = mk(s, s, (g, w, h) => {
    g.fillStyle = '#4a3a30'; g.fillRect(0, 0, w, h);
    const bh = 10, bw = 22;
    for (let y = 0; y < h; y += bh) {
      const off = ((y / bh) % 2) * (bw / 2);
      for (let x = -bw; x < w; x += bw) {
        const v = 90 + ((x + y) % 40);
        g.fillStyle = `rgb(${v + 20},${v - 10},${v - 30})`;
        g.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
        g.fillStyle = 'rgba(0,0,0,0.18)';
        g.fillRect(x + off + 1, y + bh - 3, bw - 2, 2);
      }
    }
  });
  brick.repeat.set(2, 2);

  const wood = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#3c2818'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 7) {
      g.strokeStyle = `rgba(${20 + Math.random() * 20},10,4,0.45)`;
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 2, h); g.stroke();
    }
    g.fillStyle = 'rgba(90,60,30,0.2)';
    for (let i = 0; i < 20; i++) g.fillRect(Math.random() * w, Math.random() * h, 20, 3);
  });

  const sand = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#8a7a4e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 200; i++) {
      g.fillStyle = `rgba(${90 + Math.random() * 50},${80 + Math.random() * 30},${40},0.35)`;
      g.fillRect(Math.random() * w, Math.random() * h, 5, 3);
    }
    g.strokeStyle = 'rgba(40,30,10,0.25)';
    for (let y = 8; y < h; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + 2); g.stroke(); }
  });

  const conc = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#6e6a62'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 80; i++) {
      g.fillStyle = `rgba(40,40,36,${0.15 + Math.random() * 0.2})`;
      g.fillRect(Math.random() * w, Math.random() * h, 12, 2);
    }
    g.strokeStyle = 'rgba(20,20,18,0.35)';
    g.strokeRect(8, 8, w - 16, h - 16);
  });

  const rock = mk(128, 128, (g, w, h) => {
    g.fillStyle = '#5a5348'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(${70 + Math.random() * 40},${65 + Math.random() * 30},${50},0.4)`;
      g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * 10, 0, 6.28); g.fill();
    }
  });

  const smoke = mk(64, 64, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(160,150,130,0.55)');
    grd.addColorStop(1, 'rgba(160,150,130,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });

  const sky = mk(8, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#8a8a86');
    grd.addColorStop(0.45, '#9a9280');
    grd.addColorStop(0.72, '#b5a888');
    grd.addColorStop(1, '#c4b496');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  sky.wrapS = sky.wrapT = THREE.ClampToEdgeWrapping;

  return { mud, grass, brick, wood, sand, conc, rock, smoke, sky };
}

export class World {
  constructor(scene, theme, gfx) {
    this.scene = scene;
    this.theme = theme;
    this.gfx = gfx || {};
    this.colliders = [];
    this.farBits = [];
    this.smoke = [];
    this.flashes = [];
    this.craters = this.makeCraters(theme);
    this.tex = makeTextures(gfx.detail || 1);
    const bump = (map) => map;
    this.mats = {
      mud: new THREE.MeshStandardMaterial({ map: this.tex.mud, roughness: 0.96, metalness: 0.02, color: 0xb09a78 }),
      grass: new THREE.MeshStandardMaterial({ map: this.tex.grass, roughness: 0.92, metalness: 0.0, color: 0x6a7a48 }),
      brick: new THREE.MeshStandardMaterial({ map: this.tex.brick, roughness: 0.88, metalness: 0.04, color: 0xc8b09a, bumpMap: bump(this.tex.brick), bumpScale: 0.12 }),
      wood: new THREE.MeshStandardMaterial({ map: this.tex.wood, roughness: 0.86, metalness: 0.02, color: 0x8a6a44 }),
      sand: new THREE.MeshStandardMaterial({ map: this.tex.sand, roughness: 0.94, metalness: 0.0, color: 0xd0c090 }),
      conc: new THREE.MeshStandardMaterial({ map: this.tex.conc, roughness: 0.82, metalness: 0.08, color: 0xa8a498 }),
      rock: new THREE.MeshStandardMaterial({ map: this.tex.rock, roughness: 0.9, metalness: 0.06, color: 0x8a8478 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x2c261c, roughness: 0.9, metalness: 0.05 }),
      rust: new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.78, metalness: 0.18 }),
      smoke: new THREE.MeshBasicMaterial({ map: this.tex.smoke, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide })
    };
    this.boxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.buildSky();
    this.buildTerrain();
    this.buildTheme(theme);
    this.scatterFoliage();
    this.scatterAtmosphere(gfx.farSoldiers || 8);
    this.placeDistantCity(theme);
  }

  makeCraters(theme) {
    const list = [
      { x: 6, z: -12, r: 3.2, d: 0.55 },
      { x: -11, z: -26, r: 2.4, d: 0.4 },
      { x: 14, z: -44, r: 3.8, d: 0.65 },
      { x: -5, z: -58, r: 2.8, d: 0.45 },
      { x: 9, z: -78, r: 3.1, d: 0.5 }
    ];
    if (theme === 'town' || theme === 'final' || theme === 'outskirts') {
      list.push({ x: 0, z: -36, r: 4.2, d: 0.5 }, { x: -16, z: -70, r: 3, d: 0.4 });
    }
    return list;
  }

  heightAt(x, z) {
    let h = noise2(x, z) * 0.85 + noise2(x * 0.35, z * 0.35) * 0.35;
    for (const c of this.craters) {
      const dx = x - c.x, dz = z - c.z;
      const t = 1 - Math.sqrt(dx * dx + dz * dz) / c.r;
      if (t > 0) h -= Math.pow(t, 1.6) * c.d;
    }
    return h;
  }

  addCollider(x, y, z, w, h, d, opts = {}) {
    const min = new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2);
    const max = new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2);
    this.colliders.push({ min, max, los: opts.los !== false, low: !!opts.low });
  }

  meshBox(x, y, z, w, h, d, mat, opts = {}) {
    const m = new THREE.Mesh(this.boxGeo, mat);
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    m.castShadow = !!this.gfx.shadows && !opts.noShadow;
    m.receiveShadow = true;
    this.scene.add(m);
    if (!opts.noCollide) this.addCollider(x, y, z, w, h, d, opts);
    return m;
  }

  buildSky() {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(210, 16, 12),
      new THREE.MeshBasicMaterial({ map: this.tex.sky, side: THREE.BackSide, fog: false })
    );
    this.scene.add(sky);
    this.sky = sky;
  }

  buildTerrain() {
    const seg = this.gfx.terrainSeg || 36;
    const geo = new THREE.PlaneGeometry(220, 280, seg, Math.round(seg * 1.2));
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, this.heightAt(x, y - 40));
    }
    geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, this.mats.mud);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -40);
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.terrain = ground;
  }

  trench(x, z, len) {
    const y = this.heightAt(x, z) + 0.42;
    this.meshBox(x, y, z, 7.4, 0.85, len, this.mats.sand, { low: true });
    this.meshBox(x + 3.5, y + 0.08, z, 1.15, 1.05, len, this.mats.sand, { low: true });
    this.meshBox(x - 3.5, y + 0.08, z, 1.15, 1.05, len, this.mats.sand, { low: true });
    this.meshBox(x + 3.1, y + 0.55, z - len * 0.2, 0.35, 0.7, 1.8, this.mats.wood, { low: true });
  }

  ruin(x, z, w = 8, d = 8, h = 4.5) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + h * 0.42, z - d * 0.35, w, h * 0.84, 0.55, this.mats.brick);
    this.meshBox(x - w * 0.42, gy + h * 0.38, z, 0.55, h * 0.76, d * 0.7, this.mats.brick);
    if (h > 4) this.meshBox(x + w * 0.4, gy + h * 0.28, z + d * 0.05, 0.55, h * 0.56, d * 0.45, this.mats.brick);
    this.meshBox(x, gy + 0.22, z, w * 0.7, 0.45, d * 0.65, this.mats.dark, { low: true });
    this.meshBox(x + w * 0.2, gy + 0.35, z + 1.2, 1.4, 0.7, 1.1, this.mats.brick, { low: true, noShadow: true });
    this.meshBox(x - 1.4, gy + 0.18, z - 0.8, 2.2, 0.35, 1.6, this.mats.conc, { low: true, noShadow: true });
  }

  bunker(x, z) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + 1.15, z, 8, 2.3, 6, this.mats.conc);
    this.meshBox(x, gy + 2.45, z, 8.5, 0.35, 6.5, this.mats.conc);
    this.meshBox(x - 5, gy + 0.55, z, 3.2, 1.1, 8, this.mats.sand, { low: true });
  }

  wreck(x, z) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + 0.75, z, 4.6, 1.35, 2.1, this.mats.rust);
    this.meshBox(x + 1.7, gy + 1.25, z, 1.15, 1.05, 2.3, this.mats.dark);
    this.meshBox(x - 1.5, gy + 0.28, z + 0.8, 1.4, 0.35, 0.7, this.mats.rust, { low: true, noShadow: true });
  }

  crate(x, z) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + 0.48, z, 1.05, 0.95, 1.05, this.mats.wood, { low: true });
  }

  rock(x, z, s = 1) {
    const gy = this.heightAt(x, z);
    const geo = new THREE.DodecahedronGeometry(0.7 * s, 0);
    const m = new THREE.Mesh(geo, this.mats.rock);
    m.position.set(x, gy + 0.35 * s, z);
    m.rotation.set(Math.random(), Math.random(), Math.random());
    m.scale.set(1 + Math.random() * 0.4, 0.7 + Math.random() * 0.5, 1 + Math.random() * 0.3);
    m.castShadow = !!this.gfx.shadows;
    this.scene.add(m);
    this.addCollider(x, gy + 0.4 * s, z, 1.3 * s, 0.9 * s, 1.3 * s);
  }

  fence(x, z, len = 8, rot = 0) {
    const gy = this.heightAt(x, z);
    this.meshBox(x, gy + 0.55, z, 0.12, 1.1, len, this.mats.wood, { low: true, noShadow: true });
    this.meshBox(x, gy + 0.95, z, 0.08, 0.08, len, this.mats.wood, { noCollide: true, noShadow: true });
  }

  buildTheme(theme) {
    if (theme === 'chaos') {
      this.wreck(-5, 3); this.wreck(9, -7);
      this.trench(0, -18, 16);
      this.ruin(-16, -34, 9, 8, 4.2);
      this.ruin(18, -40, 7.5, 7, 3.8);
      this.trench(4, -62, 14);
      this.crate(5, -60);
      this.fence(-12, -8, 10);
      this.fence(16, -22, 8);
      this.rock(-8, -6, 1.3); this.rock(7, -16, 1.1); this.rock(-14, -48, 1.6);
      this.rock(12, -28, 0.9); this.rock(-3, -36, 1.2); this.rock(18, -54, 1.4);
      this.rock(-18, -20, 1.1);
    } else if (theme === 'defense') {
      this.meshBox(0, this.heightAt(0, -18) + 0.55, -18, 14, 1.1, 1.4, this.mats.sand, { low: true });
      this.meshBox(-7, this.heightAt(-7, -22) + 0.55, -22, 1.4, 1.1, 8, this.mats.sand, { low: true });
      this.meshBox(7, this.heightAt(7, -22) + 0.55, -22, 1.4, 1.1, 8, this.mats.sand, { low: true });
      this.crate(3, -16); this.crate(-3, -20);
      this.trench(2, -70, 18);
      this.ruin(-18, -48); this.ruin(20, -52);
      this.wreck(12, -40);
      this.rock(-10, -28, 1.2); this.rock(14, -60, 1.3);
    } else if (theme === 'fields') {
      for (let z = -20; z >= -90; z -= 22) this.trench((z / 22) % 2 ? -4 : 5, z, 16);
      this.wreck(-10, -50); this.wreck(14, -78);
      this.fence(-18, -40, 12); this.fence(20, -64, 10);
      this.rock(-16, -30, 1.4); this.rock(8, -46, 1); this.rock(-2, -72, 1.5);
    } else if (theme === 'town') {
      const streets = [-18, -8, 8, 18];
      streets.forEach((x, i) => {
        this.ruin(x, -24 - i * 8, 7 + (i % 2), 8, 4.2 + (i % 3) * 0.6);
        this.ruin(x, -56 - (i % 2) * 6, 8, 7, 5.2);
      });
      this.meshBox(0, 0.18, -30, 10, 0.28, 10, this.mats.conc, { low: true, noShadow: true });
      this.ruin(0, -88, 12, 10, 6.2);
      this.crate(-2, -31);
      this.rock(3, -38, 0.8);
    } else if (theme === 'bunker') {
      this.meshBox(0, 0.35, -22, 18, 0.25, 1, this.mats.dark, { low: true });
      this.bunker(2, -38); this.bunker(-16, -44); this.bunker(4, -82);
      this.trench(-16, -44, 12);
      this.wreck(12, -60);
      this.rock(-6, -28, 1.2);
    } else if (theme === 'outskirts') {
      this.trench(0, -28, 16);
      this.wreck(-8, -40); this.wreck(10, -48); this.wreck(-4, -62); this.wreck(14, -70);
      this.ruin(-18, -54, 9, 8, 5); this.ruin(20, -80, 8, 7, 4.5);
      this.meshBox(0, 1.2, -96, 10, 2.4, 2, this.mats.conc);
      this.meshBox(-6, 1.4, -96, 2, 2.8, 2, this.mats.conc);
      this.meshBox(6, 1.4, -96, 2, 2.8, 2, this.mats.conc);
      this.rock(-12, -36, 1.3);
    } else {
      this.meshBox(-16, 1.4, -20, 2, 2.8, 18, this.mats.conc);
      this.meshBox(16, 1.4, -20, 2, 2.8, 18, this.mats.conc);
      this.wreck(-6, -30); this.wreck(8, -36);
      this.ruin(-12, -50, 9, 8, 5.5); this.ruin(14, -58, 8, 8, 5);
      this.meshBox(0, 2.2, -80, 10, 4.4, 8, this.mats.brick);
      this.meshBox(0, 0.4, -74, 4, 0.8, 3, this.mats.sand, { low: true });
      this.crate(0, -78);
    }
  }

  scatterFoliage() {
    const n = this.gfx.grass || 80;
    const blade = new THREE.PlaneGeometry(0.18, 0.45);
    const inst = new THREE.InstancedMesh(blade, this.mats.grass, n);
    inst.frustumCulled = true;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const x = -28 + Math.random() * 56;
      const z = 8 - Math.random() * 110;
      dummy.position.set(x, this.heightAt(x, z) + 0.2, z);
      dummy.rotation.set(0, Math.random() * 6, (Math.random() - 0.5) * 0.3);
      dummy.scale.setScalar(0.7 + Math.random() * 0.8);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    this.scene.add(inst);
    this.grass = inst;
    const debrisN = Math.min(28, 10 + (this.gfx.particles || 8));
    for (let i = 0; i < debrisN; i++) {
      const x = -22 + Math.random() * 44;
      const z = 4 - Math.random() * 100;
      this.meshBox(x, this.heightAt(x, z) + 0.12, z, 0.5 + Math.random(), 0.16, 0.35 + Math.random() * 0.5, i % 2 ? this.mats.dark : this.mats.wood, { noCollide: true, noShadow: true });
    }
  }

  scatterAtmosphere(count) {
    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.62, 3, 5), new THREE.MeshStandardMaterial({ color: 0x3a3328, roughness: 0.9 }));
      body.position.y = 0.75;
      g.add(body);
      g.position.set(-36 + Math.random() * 72, 0, -78 - Math.random() * 70);
      g.position.y = this.heightAt(g.position.x, g.position.z);
      this.scene.add(g);
      this.farBits.push({ g, s: 0.35 + Math.random(), p: Math.random() * 10 });
    }
    const smokeN = Math.min(12, 4 + (this.gfx.particles || 8) / 2);
    for (let i = 0; i < smokeN; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(5 + Math.random() * 4, 5 + Math.random() * 4), this.mats.smoke.clone());
      s.material.opacity = 0.28 + Math.random() * 0.25;
      s.position.set(-22 + Math.random() * 44, 2.4 + Math.random() * 2.5, -16 - Math.random() * 95);
      this.scene.add(s);
      this.smoke.push(s);
    }
    const flashN = this.gfx.particles > 10 ? 4 : 2;
    for (let i = 0; i < flashN; i++) {
      const l = new THREE.PointLight(0xffc070, 0, 28, 2);
      l.position.set(-30 + Math.random() * 60, 3, -50 - Math.random() * 70);
      this.scene.add(l);
      this.flashes.push({ l, t: Math.random() * 6 });
    }
  }

  placeDistantCity(theme) {
    const urban = theme === 'town' || theme === 'outskirts' || theme === 'final' || theme === 'bunker';
    const count = urban ? 18 : 8;
    for (let i = 0; i < count; i++) {
      const x = -50 + i * 6 + (i % 3) * 2;
      const z = -118 - (i % 4) * 6;
      const h = 4 + (i % 5) * 1.6 + (urban ? 3 : 0);
      const m = new THREE.Mesh(this.boxGeo, i % 2 ? this.mats.brick : this.mats.conc);
      m.position.set(x, h / 2, z);
      m.scale.set(3.2 + (i % 3), h, 2.4);
      this.scene.add(m);
    }
  }

  blockedLOS(from, to) {
    const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.4) return false;
    const steps = Math.min(36, Math.max(8, Math.floor(len / 0.55)));
    const inv = 1 / steps;
    for (let i = 1; i < steps; i++) {
      const t = i * inv;
      const px = from.x + dx * t;
      const py = from.y + dy * t;
      const pz = from.z + dz * t;
      for (const c of this.colliders) {
        if (!c.los) continue;
        if (c.low && py > c.max.y + 0.15) continue;
        if (px >= c.min.x && px <= c.max.x && py >= c.min.y && py <= c.max.y && pz >= c.min.z && pz <= c.max.z) return true;
      }
    }
    return false;
  }

  update(t, camera) {
    this.farBits.forEach((f) => { f.g.position.x += Math.sin(t * 0.25 + f.p) * 0.008 * f.s; });
    this.smoke.forEach((s, i) => {
      s.position.y = 2.3 + Math.sin(t * 0.35 + i) * 0.35;
      s.position.x += Math.sin(t * 0.12 + i) * 0.01;
      if (camera) s.lookAt(camera.position);
    });
    this.flashes.forEach((f, i) => {
      const pulse = (Math.sin(t * 1.7 + i * 2.2) > 0.92) ? 3.2 : 0;
      f.l.intensity = pulse;
    });
    if (this.sky) this.sky.rotation.y = t * 0.003;
  }

  collide(pos, radius = 0.4) {
    let hit = false;
    for (const c of this.colliders) {
      const nx = Math.max(c.min.x, Math.min(pos.x, c.max.x));
      const nz = Math.max(c.min.z, Math.min(pos.z, c.max.z));
      const dx = pos.x - nx, dz = pos.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius && pos.y < c.max.y + 0.25) {
        const d = Math.sqrt(d2) || 0.0001;
        pos.x += (dx / d) * (radius - d);
        pos.z += (dz / d) * (radius - d);
        hit = true;
      }
    }
    pos.x = THREE.MathUtils.clamp(pos.x, -40, 40);
    pos.z = THREE.MathUtils.clamp(pos.z, -120, 20);
    return hit;
  }

  dispose() {
    while (this.scene.children.length) this.scene.remove(this.scene.children[0]);
    Object.values(this.tex).forEach((t) => t.dispose());
  }
}

export function makeSoldierMesh(color = KIT_COLORS.olive, enemy = false) {
  const g = new THREE.Group();
  const cloth = new THREE.MeshStandardMaterial({ color: enemy ? 0x4a4034 : color, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a241c, roughness: 0.8 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc2a07a, roughness: 0.7 });
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
