import * as THREE from 'three';
import { KIT_COLORS } from './config.js';

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
    g.fillStyle = '#4a3d2c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) {
      g.fillStyle = `rgba(${60 + Math.random() * 50},${45 + Math.random() * 30},${25 + Math.random() * 20},${0.35})`;
      g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 4);
    }
  });
  mud.repeat.set(18, 24);
  const brick = mk(64, 64, (g, w, h) => {
    g.fillStyle = '#5a4a3a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#6b5340';
    for (let y = 0; y < h; y += 8) {
      const off = (y / 8) % 2 ? 8 : 0;
      for (let x = -8; x < w; x += 16) g.fillRect(x + off, y, 14, 6);
    }
  });
  const wood = mk(64, 64, (g, w, h) => {
    g.fillStyle = '#3e2c1c'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(20,12,6,.4)';
    for (let x = 0; x < w; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 2, h); g.stroke(); }
  });
  const sand = mk(32, 32, (g, w, h) => {
    g.fillStyle = '#8a7a52'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#6e6240';
    for (let i = 0; i < 30; i++) g.fillRect(Math.random() * w, Math.random() * h, 4, 3);
  });
  const conc = mk(64, 64, (g, w, h) => {
    g.fillStyle = '#6a6860'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(40,40,36,.35)';
    for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 8, 2);
  });
  return { mud, brick, wood, sand, conc };
}

function box(scene, mats, x, y, z, w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = false;
  m.receiveShadow = true;
  scene.add(m);
  return { mesh: m, min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2), max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2) };
}

export class World {
  constructor(scene, theme, gfx) {
    this.scene = scene;
    this.colliders = [];
    this.pickups = [];
    this.farBits = [];
    this.smoke = [];
    this.tex = makeTextures();
    this.mats = {
      mud: new THREE.MeshLambertMaterial({ map: this.tex.mud, color: 0x9a8a70 }),
      brick: new THREE.MeshLambertMaterial({ map: this.tex.brick, color: 0xbba080 }),
      wood: new THREE.MeshLambertMaterial({ map: this.tex.wood, color: 0x8a6a48 }),
      sand: new THREE.MeshLambertMaterial({ map: this.tex.sand, color: 0xc8b888 }),
      conc: new THREE.MeshLambertMaterial({ map: this.tex.conc, color: 0x9a9890 }),
      dark: new THREE.MeshLambertMaterial({ color: 0x2a2418 }),
      rust: new THREE.MeshLambertMaterial({ color: 0x4a3220 }),
      smoke: new THREE.MeshBasicMaterial({ color: 0x888070, transparent: true, opacity: 0.22, depthWrite: false })
    };
    this.buildGround();
    this.buildTheme(theme);
    this.scatterAtmosphere(gfx.farSoldiers);
  }

  addBox(x, y, z, w, h, d, mat) {
    const b = box(this.scene, this.mats, x, y, z, w, h, d, mat);
    this.colliders.push(b);
    return b;
  }

  buildGround() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 280), this.mats.mud);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -40);
    ground.receiveShadow = true;
    this.scene.add(ground);
    const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(400, 80), new THREE.MeshBasicMaterial({ color: 0x6a6458, transparent: true, opacity: 0.18 }));
    fogPlane.rotation.x = -Math.PI / 2;
    fogPlane.position.set(0, 0.02, -160);
    this.scene.add(fogPlane);
  }

  trench(x, z, len, rot = 0) {
    this.addBox(x, 0.45, z, 8, 0.9, len, this.mats.sand);
    this.addBox(x + Math.cos(rot) * 3.6, 0.45, z, 1.2, 0.9, len, this.mats.sand);
    this.addBox(x - Math.cos(rot) * 3.6, 0.45, z, 1.2, 0.9, len, this.mats.sand);
  }

  ruin(x, z, w = 8, d = 8, h = 4.5) {
    this.addBox(x, h / 2, z, w, h, 0.7, this.mats.brick);
    this.addBox(x - w / 2 + 0.3, h / 2, z + d * 0.2, 0.7, h * 0.7, d * 0.6, this.mats.brick);
    this.addBox(x + w / 2 - 0.3, h / 2 * 0.6, z, 0.7, h * 0.6, d * 0.5, this.mats.brick);
    this.addBox(x, 0.2, z, w * 0.8, 0.4, d * 0.7, this.mats.dark);
  }

  bunker(x, z) {
    this.addBox(x, 1.1, z, 8, 2.2, 6, this.mats.conc);
    this.addBox(x, 2.4, z, 8.4, 0.4, 6.4, this.mats.conc);
    this.addBox(x - 5, 0.5, z, 3, 1, 8, this.mats.sand);
  }

  wreck(x, z) {
    this.addBox(x, 0.7, z, 4.4, 1.4, 2.2, this.mats.rust);
    this.addBox(x + 1.8, 1.2, z, 1.2, 1.1, 2.4, this.mats.dark);
  }

  crate(x, z) {
    this.addBox(x, 0.45, z, 1.1, 0.9, 1.1, this.mats.wood);
  }

  buildTheme(theme) {
    if (theme === 'chaos') {
      this.wreck(-4, 2); this.wreck(8, -8);
      this.trench(0, -18, 16);
      this.ruin(-16, -34, 9, 8, 4);
      this.ruin(18, -40, 7, 7, 3.5);
      this.trench(4, -62, 14);
      this.crate(5, -60);
      for (let i = 0; i < 8; i++) this.addBox(-20 + Math.random() * 40, 0.15, -10 - Math.random() * 70, 1.2, 0.3, 0.8, this.mats.dark);
    } else if (theme === 'defense') {
      this.addBox(0, 0.55, -18, 14, 1.1, 1.4, this.mats.sand);
      this.addBox(-7, 0.55, -22, 1.4, 1.1, 8, this.mats.sand);
      this.addBox(7, 0.55, -22, 1.4, 1.1, 8, this.mats.sand);
      this.crate(3, -16); this.crate(-3, -20);
      this.trench(2, -70, 18);
      this.ruin(-18, -48); this.ruin(20, -52);
      this.wreck(12, -40);
    } else if (theme === 'fields') {
      for (let z = -20; z >= -90; z -= 22) this.trench((z / 22) % 2 ? -4 : 5, z, 16);
      this.wreck(-10, -50); this.wreck(14, -78);
      this.addBox(0, 0.3, -58, 2.2, 0.6, 1.2, this.mats.rust);
      for (let i = 0; i < 10; i++) this.addBox(-24 + Math.random() * 48, 0.4, -15 - Math.random() * 90, 0.25, 0.8, 0.25, this.mats.wood);
    } else if (theme === 'town') {
      const streets = [-18, -8, 8, 18];
      streets.forEach((x, i) => {
        this.ruin(x, -24 - i * 8, 7 + (i % 2), 8, 4 + (i % 3));
        this.ruin(x, -56 - (i % 2) * 6, 8, 7, 5);
      });
      this.addBox(0, 0.2, -30, 10, 0.4, 10, this.mats.dark);
      this.ruin(0, -88, 12, 10, 6);
      this.crate(-2, -31);
    } else if (theme === 'bunker') {
      this.addBox(0, 0.4, -22, 18, 0.3, 1, this.mats.dark);
      this.bunker(2, -38);
      this.bunker(-16, -44);
      this.bunker(4, -82);
      this.trench(-16, -44, 12);
      this.wreck(12, -60);
    } else if (theme === 'outskirts') {
      this.trench(0, -28, 16);
      this.wreck(-8, -40); this.wreck(10, -48); this.wreck(-4, -62); this.wreck(14, -70);
      this.ruin(-18, -54); this.ruin(20, -80);
      this.addBox(0, 1.2, -96, 10, 2.4, 2, this.mats.conc);
      this.addBox(-6, 1.4, -96, 2, 2.8, 2, this.mats.conc);
      this.addBox(6, 1.4, -96, 2, 2.8, 2, this.mats.conc);
    } else {
      this.addBox(-16, 1.4, -20, 2, 2.8, 18, this.mats.conc);
      this.addBox(16, 1.4, -20, 2, 2.8, 18, this.mats.conc);
      this.wreck(-6, -30); this.wreck(8, -36);
      this.ruin(-12, -50); this.ruin(14, -58);
      this.addBox(0, 2.2, -80, 10, 4.4, 8, this.mats.brick);
      this.addBox(0, 0.4, -74, 4, 0.8, 3, this.mats.sand);
      this.crate(0, -78);
    }
  }

  scatterAtmosphere(count) {
    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.7, 3, 6), new THREE.MeshLambertMaterial({ color: 0x3a3328 }));
      body.position.y = 0.8;
      g.add(body);
      g.position.set(-40 + Math.random() * 80, 0, -70 - Math.random() * 90);
      this.scene.add(g);
      this.farBits.push({ g, s: 0.4 + Math.random(), p: Math.random() * 10 });
    }
    for (let i = 0; i < 10; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(2.2 + Math.random() * 2, 8, 8), this.mats.smoke);
      s.position.set(-20 + Math.random() * 40, 2 + Math.random() * 3, -20 - Math.random() * 90);
      this.scene.add(s);
      this.smoke.push(s);
    }
  }

  update(t) {
    this.farBits.forEach((f) => { f.g.position.x += Math.sin(t * 0.3 + f.p) * 0.01 * f.s; });
    this.smoke.forEach((s, i) => { s.position.y = 2.2 + Math.sin(t * 0.4 + i) * 0.3; s.rotation.y += 0.002; });
  }

  collide(pos, radius = 0.4) {
    let hit = false;
    for (const c of this.colliders) {
      const nx = Math.max(c.min.x, Math.min(pos.x, c.max.x));
      const nz = Math.max(c.min.z, Math.min(pos.z, c.max.z));
      const dx = pos.x - nx, dz = pos.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius && pos.y < c.max.y + 0.2) {
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
