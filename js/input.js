export class Input {
  constructor() {
    this.moveX = 0;
    this.moveY = 0;
    this.lookX = 0;
    this.lookY = 0;
    this.fire = false;
    this.aim = false;
    this.reload = false;
    this.grenade = false;
    this.jump = false;
    this.crouch = false;
    this.use = false;
    this.pause = false;
    this.sprint = false;
    this.keys = {};
    this.lookAccumX = 0;
    this.lookAccumY = 0;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.joy = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 };
    this.look = { active: false, id: null, lx: 0, ly: 0 };
    this.sens = 1;
  }

  attach(root) {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    window.addEventListener('blur', () => { this.keys = {}; this.fire = false; });

    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('mousedown', (e) => {
      if (this.isTouch) return;
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
      if (e.button === 0) this.fire = true;
      if (e.button === 2) this.aim = true;
    });
    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.fire = false;
      if (e.button === 2) this.aim = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== canvas) return;
      this.lookAccumX += e.movementX;
      this.lookAccumY += e.movementY;
    });

    this.bindTouch();
  }

  bindTouch() {
    const joy = document.getElementById('joy-base');
    const look = document.getElementById('look-zone');
    const map = [
      ['btn-fire', 'fire'], ['btn-aim', 'aim'], ['btn-reload', 'reload'],
      ['btn-grenade', 'grenade'], ['btn-jump', 'jump'], ['btn-crouch', 'crouch'],
      ['btn-use', 'use'], ['btn-pause', 'pause']
    ];
    map.forEach(([id, key]) => {
      const el = document.getElementById(id);
      const down = (e) => { e.preventDefault(); this[key] = true; };
      const up = (e) => { e.preventDefault(); if (key !== 'pause' && key !== 'reload' && key !== 'grenade' && key !== 'jump' && key !== 'use') this[key] = false; };
      el.addEventListener('touchstart', down, { passive: false });
      el.addEventListener('touchend', up, { passive: false });
      el.addEventListener('touchcancel', up, { passive: false });
    });

    const startJoy = (e) => {
      const t = e.changedTouches[0];
      const r = joy.getBoundingClientRect();
      this.joy.active = true; this.joy.id = t.identifier;
      this.joy.cx = r.left + r.width / 2; this.joy.cy = r.top + r.height / 2;
      this.updateJoy(t.clientX, t.clientY);
    };
    joy.addEventListener('touchstart', (e) => { e.preventDefault(); startJoy(e); }, { passive: false });

    look.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this.look.active = true; this.look.id = t.identifier;
      this.look.lx = t.clientX; this.look.ly = t.clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (this.joy.active && t.identifier === this.joy.id) this.updateJoy(t.clientX, t.clientY);
        if (this.look.active && t.identifier === this.look.id) {
          this.lookAccumX += (t.clientX - this.look.lx);
          this.lookAccumY += (t.clientY - this.look.ly);
          this.look.lx = t.clientX; this.look.ly = t.clientY;
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => this.endTouch(e), { passive: false });
    window.addEventListener('touchcancel', (e) => this.endTouch(e), { passive: false });
  }

  updateJoy(x, y) {
    let dx = (x - this.joy.cx) / 56;
    let dy = (y - this.joy.cy) / 56;
    const m = Math.hypot(dx, dy) || 1;
    if (m > 1) { dx /= m; dy /= m; }
    this.joy.dx = dx; this.joy.dy = dy;
    const knob = document.getElementById('joy-knob');
    knob.style.transform = `translate(${dx * 34}px, ${dy * 34}px)`;
  }

  endTouch(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === this.joy.id) {
        this.joy.active = false; this.joy.id = null; this.joy.dx = 0; this.joy.dy = 0;
        document.getElementById('joy-knob').style.transform = '';
      }
      if (t.identifier === this.look.id) { this.look.active = false; this.look.id = null; }
    }
  }

  onKey(e, down) {
    this.keys[e.code] = down;
    if (e.code === 'KeyR' && down) this.reload = true;
    if (e.code === 'KeyG' && down) this.grenade = true;
    if (e.code === 'KeyE' && down) this.use = true;
    if (e.code === 'Space' && down) { this.jump = true; e.preventDefault(); }
    if (e.code === 'KeyC') this.crouch = down;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.sprint = down;
    if (e.code === 'Escape' && down) this.pause = true;
    if (['KeyW','KeyA','KeyS','KeyD','Space','KeyR'].includes(e.code)) e.preventDefault();
  }

  consumeLook(sens) {
    const sx = this.lookAccumX * 0.0022 * sens;
    const sy = this.lookAccumY * 0.0022 * sens;
    this.lookAccumX = 0; this.lookAccumY = 0;
    return { x: sx, y: sy };
  }

  sampleMove() {
    let x = this.joy.dx;
    let y = -this.joy.dy;
    if (this.keys.KeyA) x -= 1;
    if (this.keys.KeyD) x += 1;
    if (this.keys.KeyW) y += 1;
    if (this.keys.KeyS) y -= 1;
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    return { x, y };
  }

  pulse(name) {
    const v = this[name];
    this[name] = false;
    return v;
  }
}
