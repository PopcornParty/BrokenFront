import * as THREE from 'three';
import { makeSoldierMesh } from './world.js';

export class Enemy {
  constructor(scene, spec, hp, acc) {
    this.mesh = makeSoldierMesh(0x4a4034, true);
    this.mesh.position.set(spec.x, 0, spec.z);
    scene.add(this.mesh);
    this.pos = this.mesh.position;
    this.cover = spec.cover ? new THREE.Vector3(spec.cover[0], 0, spec.cover[1]) : this.pos.clone();
    this.hp = hp;
    this.maxHp = hp;
    this.acc = acc;
    this.state = 'patrol';
    this.alive = true;
    this.cool = 0.8 + Math.random();
    this.t = Math.random() * 10;
    this.yaw = 0;
    this.home = new THREE.Vector3(spec.x, 0, spec.z);
    this.patrolA = spec.x - 3;
    this.patrolB = spec.x + 3;
    this.dir = 1;
    this.alert = 0;
    this.hitFlash = 0;
    this.wakeDelay = spec.wakeDelay || 0;
    this.hasLos = false;
  }

  update(dt, player, world) {
    if (!this.alive) return;
    this.t += dt;
    this.cool = Math.max(0, this.cool - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.wakeDelay > 0) this.wakeDelay -= dt;

    const eye = this.pos.clone(); eye.y = 1.45;
    const target = player.pos.clone();
    const toP = new THREE.Vector3().subVectors(target, eye);
    const dist = toP.length();
    const inRange = dist < 42 && Math.abs(toP.y) < 8;
    this.hasLos = false;
    if (inRange && this.wakeDelay <= 0) {
      this.hasLos = !world.blockedLOS(eye, target);
    }

    if (this.hasLos) this.alert = 4;
    else this.alert = Math.max(0, this.alert - dt);

    if (this.hp < this.maxHp * 0.28 && dist < 14) this.state = 'retreat';
    else if (this.alert > 0 && dist < 16 && this.hasLos) this.state = 'flank';
    else if (this.alert > 0) this.state = 'cover';
    else this.state = 'patrol';

    let dest = this.home;
    if (this.state === 'cover') dest = this.cover;
    if (this.state === 'flank') {
      const side = new THREE.Vector3(-toP.z, 0, toP.x).normalize().multiplyScalar(8);
      dest = player.pos.clone().add(side);
    }
    if (this.state === 'retreat') {
      dest = this.home.clone().add(new THREE.Vector3(this.pos.x - player.pos.x, 0, this.pos.z - player.pos.z).normalize().multiplyScalar(10));
    }
    if (this.state === 'patrol') {
      this.pos.x += this.dir * dt * 1.1;
      if (this.pos.x > this.patrolB) this.dir = -1;
      if (this.pos.x < this.patrolA) this.dir = 1;
    } else {
      const wish = new THREE.Vector3(dest.x - this.pos.x, 0, dest.z - this.pos.z);
      const wl = wish.length();
      if (wl > 1.2) {
        wish.multiplyScalar((this.state === 'retreat' ? 2.4 : 1.8) * dt / wl);
        this.pos.add(wish);
        world.collide(this.pos, 0.45);
      }
    }

    this.pos.y = world.heightAt(this.pos.x, this.pos.z);
    if (this.hasLos) this.yaw = Math.atan2(toP.x, toP.z);
    else this.yaw += (this.dir * 0.4 - this.yaw) * 0.02;
    this.mesh.rotation.y = this.yaw;
    this.mesh.position.y = this.pos.y + Math.sin(this.t * 6) * (this.state === 'patrol' ? 0.03 : 0.01);

    let shot = null;
    if (this.hasLos && this.cool <= 0 && dist < 38) {
      this.cool = 0.85 + Math.random() * 0.9;
      const miss = Math.random() > this.acc + Math.min(0.15, (38 - dist) * 0.003);
      shot = { from: eye.clone(), toward: target.clone(), hit: !miss, dmg: 8 + Math.random() * 6 };
    }
    return shot;
  }

  damage(n) {
    this.hp -= n;
    this.hitFlash = 0.12;
    this.alert = 4;
    this.wakeDelay = 0;
    this.mesh.userData.body.material.emissive = new THREE.Color(0x33220a);
    if (this.hp <= 0) this.kill();
    return !this.alive;
  }

  kill() {
    this.alive = false;
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = (this.pos.y || 0) + 0.2;
    setTimeout(() => { if (this.mesh.parent) this.mesh.parent.remove(this.mesh); }, 2500);
  }
}

export class EnemyManager {
  constructor(scene, list, hp, acc) {
    this.scene = scene;
    this.hp = hp;
    this.acc = acc;
    this.units = list.map((s) => new Enemy(scene, s, hp, acc));
  }

  living() { return this.units.filter((u) => u.alive); }

  update(dt, player, world) {
    const shots = [];
    for (const u of this.units) {
      const s = u.update(dt, player, world);
      if (s) shots.push(s);
      if (u.hitFlash <= 0 && u.alive) u.mesh.userData.body.material.emissive = new THREE.Color(0x000000);
    }
    return shots;
  }

  spawn(n, z) {
    for (let i = 0; i < n; i++) {
      if (this.living().length >= 8) return;
      const spec = { x: -10 + i * 7 + Math.random() * 4, z: z + Math.random() * 6, cover: [-8 + i * 6, z + 4] };
      this.units.push(new Enemy(this.scene, spec, this.hp, this.acc));
    }
  }

  rayHit(origin, dir, range = 80, world = null) {
    let best = null, bestD = range;
    for (const u of this.living()) {
      const to = new THREE.Vector3().subVectors(u.pos, origin);
      to.y += 1.1;
      const t = to.dot(dir);
      if (t < 0 || t > bestD) continue;
      const closest = origin.clone().addScaledVector(dir, t);
      const body = u.pos.clone(); body.y += 1.0;
      if (closest.distanceTo(body) < 0.55) {
        if (world && world.blockedLOS(origin, body)) continue;
        best = u; bestD = t;
      }
    }
    return best ? { unit: best, dist: bestD } : null;
  }
}
