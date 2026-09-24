import * as THREE from 'three';
import { makeSoldierMesh } from './world.js';

export class Enemy {
  constructor(scene, spec, hp, acc) {
    this.mesh = makeSoldierMesh(0x4a4034, true);
    const x = THREE.MathUtils.clamp(spec.x, -8.5, 8.5);
    const z = spec.z;
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);
    this.pos = this.mesh.position;
    this.cover = spec.cover
      ? new THREE.Vector3(THREE.MathUtils.clamp(spec.cover[0], -8.5, 8.5), 0, spec.cover[1])
      : this.pos.clone();
    this.hp = hp;
    this.maxHp = hp;
    this.acc = acc;
    this.state = 'patrol';
    this.alive = true;
    this.cool = 0.35 + Math.random() * 0.4;
    this.t = Math.random() * 10;
    this.yaw = 0;
    this.home = new THREE.Vector3(x, 0, z);
    this.patrolA = x - 2.4;
    this.patrolB = x + 2.4;
    this.dir = 1;
    this.alert = 0;
    this.hitFlash = 0;
    this.wakeDelay = Math.min(spec.wakeDelay || 0, 3.5);
    this.hasLos = false;
  }

  bodyPoint() {
    return new THREE.Vector3(this.pos.x, this.pos.y + 1.05, this.pos.z);
  }

  headPoint() {
    return new THREE.Vector3(this.pos.x, this.pos.y + 1.58, this.pos.z);
  }

  update(dt, player, world) {
    if (!this.alive) return;
    this.t += dt;
    this.cool = Math.max(0, this.cool - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    if (this.wakeDelay > 0) this.wakeDelay -= dt;

    const eye = this.headPoint();
    const targetChest = player.pos.clone();
    targetChest.y -= 0.2;
    const targetHead = player.pos.clone();
    const toP = new THREE.Vector3().subVectors(targetChest, eye);
    const dist = toP.length();
    const inRange = dist < 42 && Math.abs(toP.y) < 8;
    this.hasLos = false;
    if (inRange && this.wakeDelay <= 0) {
      const chestClear = !world.blockedLOS(eye, targetChest);
      const headClear = !world.blockedLOS(eye, targetHead);
      this.hasLos = chestClear || headClear;
    }

    if (this.hasLos) this.alert = 6;
    else this.alert = Math.max(0, this.alert - dt);

    if (this.hp < this.maxHp * 0.16 && dist < 10) this.state = 'retreat';
    else if (this.alert > 0 && dist < 14 && this.hasLos) this.state = 'flank';
    else if (this.alert > 0) this.state = 'cover';
    else this.state = 'patrol';

    let dest = this.home;
    if (this.state === 'cover') {
      dest = this.cover.clone();
      if (!this.hasLos) dest.x += Math.sin(this.t * 1.3) * 2.4;
    }
    if (this.state === 'flank') {
      const side = new THREE.Vector3(-toP.z, 0, toP.x).normalize().multiplyScalar(6);
      dest = player.pos.clone().add(side);
      dest.x = THREE.MathUtils.clamp(dest.x, -8.5, 8.5);
    }
    if (this.state === 'retreat') {
      dest = this.home.clone().add(new THREE.Vector3(this.pos.x - player.pos.x, 0, this.pos.z - player.pos.z).normalize().multiplyScalar(8));
    }
    if (this.state === 'patrol') {
      this.pos.x += this.dir * dt * 1.1;
      if (this.pos.x > this.patrolB) this.dir = -1;
      if (this.pos.x < this.patrolA) this.dir = 1;
    } else {
      const wish = new THREE.Vector3(dest.x - this.pos.x, 0, dest.z - this.pos.z);
      const wl = wish.length();
      if (wl > 1.0) {
        wish.multiplyScalar((this.state === 'retreat' ? 2.4 : 1.8) * dt / wl);
        this.pos.add(wish);
        world.collide(this.pos, 0.45);
      }
    }

    this.pos.x = THREE.MathUtils.clamp(this.pos.x, -8.6, 8.6);
    this.pos.y = world.heightAt(this.pos.x, this.pos.z);
    if (this.alert > 0) this.yaw = Math.atan2(toP.x, toP.z);
    else this.yaw += (this.dir * 0.4 - this.yaw) * 0.02;
    this.mesh.rotation.y = this.yaw;
    this.mesh.position.y = this.pos.y + Math.sin(this.t * 6) * (this.state === 'patrol' ? 0.03 : 0.01);

    let shot = null;
    if (this.hasLos && this.cool <= 0 && dist < 38) {
      this.cool = 0.55 + Math.random() * 0.35;
      const aimAt = !world.blockedLOS(eye, targetHead) ? targetHead : targetChest;
      if (world.blockedLOS(eye, aimAt)) {
        this.hasLos = false;
      } else {
        const hitChance = this.acc + Math.min(0.22, (30 - dist) * 0.01);
        const miss = Math.random() > hitChance;
        shot = { from: eye.clone(), toward: aimAt.clone(), hit: !miss, dmg: 20 + Math.random() * 8 };
      }
    }
    return shot;
  }

  damage(n) {
    this.hp -= n;
    this.hitFlash = 0.14;
    this.alert = 6;
    this.wakeDelay = 0;
    if (this.mesh.userData.body) this.mesh.userData.body.material.emissive = new THREE.Color(0x5a2010);
    if (this.hp <= 0) this.kill();
    return !this.alive;
  }

  kill() {
    this.alive = false;
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = (this.pos.y || 0) + 0.2;
    setTimeout(() => { if (this.mesh.parent) this.mesh.parent.remove(this.mesh); }, 2200);
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
      if (u.hitFlash <= 0 && u.alive && u.mesh.userData.body) {
        u.mesh.userData.body.material.emissive = new THREE.Color(0x000000);
      }
    }
    return shots;
  }

  spawn(n, z) {
    for (let i = 0; i < n; i++) {
      if (this.living().length >= 8) return;
      const spec = { x: -6 + i * 4 + Math.random() * 2, z: z + Math.random() * 5, cover: [-5 + i * 4, z + 3] };
      this.units.push(new Enemy(this.scene, spec, this.hp, this.acc));
    }
  }

  dispose() {
    this.units.forEach((u) => { if (u.mesh && u.mesh.parent) u.mesh.parent.remove(u.mesh); });
    this.units = [];
  }

  rayHit(origin, dir, range = 80, world = null) {
    let best = null;
    let bestD = range;
    let part = 'body';
    for (const u of this.living()) {
      const tests = [
        { p: u.headPoint(), r: 0.32, part: 'head' },
        { p: u.bodyPoint(), r: 0.58, part: 'body' }
      ];
      for (const t of tests) {
        const to = new THREE.Vector3().subVectors(t.p, origin);
        const dist = to.dot(dir);
        if (dist < 0.15 || dist > bestD) continue;
        const closest = origin.clone().addScaledVector(dir, dist);
        if (closest.distanceTo(t.p) > t.r) continue;
        if (world && world.blockedLOS(origin, t.p)) continue;
        best = u;
        bestD = dist;
        part = t.part;
        break;
      }
    }
    return best ? { unit: best, dist: bestD, part } : null;
  }
}
