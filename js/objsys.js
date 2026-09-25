export function installObjectives(Game) {
  Game.prototype.objectiveTarget = function () {
    const obj = this.currentObj();
    if (!obj) return null;
    if (obj.pos) return { x: obj.pos[0], z: obj.pos[2], r: obj.r || 12 };
    if (obj.type === 'clear' && this.enemies) {
      let best = null, bestD = 999;
      for (const u of this.enemies.living()) {
        const d = Math.hypot(u.pos.x - this.player.pos.x, u.pos.z - this.player.pos.z);
        if (d < bestD) { bestD = d; best = u; }
      }
      if (best) return { x: best.pos.x, z: best.pos.z, r: 4 };
    }
    return null;
  };

  Game.prototype.refreshMarker = function () {
    const t = this.objectiveTarget();
    if (this.world && this.world.setMarker) {
      if (t) this.world.setMarker(t.x, t.z);
      else this.world.setMarker(null);
    }
  };

  const prevStart = Game.prototype.startMission;
  Game.prototype.startMission = function (id, checkpoint) {
    const out = prevStart.call(this, id, checkpoint);
    try { this.refreshMarker(); } catch (e) {}
    return out;
  };

  Game.prototype.updateObjectives = function (dt) {
    const obj = this.currentObj();
    if (!obj) return;
    const pz = this.player.pos.z;
    if (obj.type === 'look') {
      this.objTimer += dt;
      if (this.looked > 0.4 && this.objTimer > obj.duration) this.advanceObj();
    } else if (obj.type === 'reach') {
      const tx = obj.pos[0], tz = obj.pos[2], r = obj.r || 12;
      const near = Math.hypot(this.player.pos.x - tx, pz - tz) < r;
      const passed = pz <= tz + 1.5;
      if (near || passed) this.advanceObj();
    } else if (obj.type === 'clear') {
      this.neededKills = obj.count;
      const living = this.enemies ? this.enemies.living() : [];
      const ahead = living.filter((u) => u.pos.z < pz - 1);
      if (this.kills >= (obj.count || 1) || living.length === 0 || (this.kills >= 1 && ahead.length === 0)) {
        this.advanceObj();
      }
    } else if (obj.type === 'survive') {
      this.objTimer += dt;
      if (this.objTimer >= obj.duration) this.advanceObj();
    } else if (obj.type === 'interact') {
      const tx = obj.pos[0], tz = obj.pos[2], r = obj.r || 4;
      const d = Math.hypot(this.player.pos.x - tx, pz - tz);
      this.ui.prompt(d < r + 1.5);
      if (d < r || pz <= tz - 1) this.advanceObj();
    }
  };

  const prevAdv = Game.prototype.advanceObj;
  Game.prototype.advanceObj = function () {
    prevAdv.call(this);
    try { this.refreshMarker(); } catch (e) {}
  };

  Game.prototype.updateObjectiveNav = function () {
    const t = this.objectiveTarget();
    if (!t) { this.ui.nav(null); return; }
    const tx = t.x - this.player.pos.x;
    const tz = t.z - this.player.pos.z;
    const dist = Math.hypot(tx, tz);
    const bearing = Math.atan2(-tx, -tz);
    let diff = bearing - this.player.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.ui.nav({ dist, angle: diff });
  };
}
