export const VERSION = '1.0.0';
export const SAVE_KEY = 'brokenfront-save-v1';

export const DIFFICULTY = {
  easy:   { name: 'Easy',   playerHp: 140, dmgTaken: 0.65, enemyAcc: 0.22, enemyHp: 70,  ammoMul: 1.6, pickupMul: 1.4 },
  normal: { name: 'Normal', playerHp: 100, dmgTaken: 1.00, enemyAcc: 0.38, enemyHp: 90,  ammoMul: 1.0, pickupMul: 1.0 },
  hard:   { name: 'Hard',   playerHp: 85,  dmgTaken: 1.25, enemyAcc: 0.52, enemyHp: 110, ammoMul: 0.75, pickupMul: 0.8 }
};

export const WEAPONS = {
  rifle:  { id: 'rifle',  name: 'SERVICE RIFLE', dmg: 38, rate: 0.85, mag: 5,  reserve: 40, reload: 2.1, recoil: 0.035, spread: 0.012, auto: false },
  carbine:{ id: 'carbine',name: 'CARBINE',       dmg: 26, rate: 0.22, mag: 15, reserve: 60, reload: 2.3, recoil: 0.022, spread: 0.018, auto: true },
  smg:    { id: 'smg',    name: 'FIELD SMG',     dmg: 16, rate: 0.09, mag: 30, reserve: 90, reload: 2.0, recoil: 0.018, spread: 0.028, auto: true },
  pistol: { id: 'pistol', name: 'SIDEARM',       dmg: 18, rate: 0.28, mag: 8,  reserve: 32, reload: 1.6, recoil: 0.016, spread: 0.020, auto: false }
};

export const KIT_COLORS = {
  olive: 0x4a5534,
  mud:   0x5a4632,
  ash:   0x6a6a62,
  field: 0x3f5a3a
};

export const GFX = {
  low:    { pixelRatio: 1.0, fogFar: 90,  particles: 8,  shadows: false, farSoldiers: 6 },
  medium: { pixelRatio: 1.25,fogFar: 120, particles: 16, shadows: false, farSoldiers: 10 },
  high:   { pixelRatio: 1.6, fogFar: 160, particles: 28, shadows: true,  farSoldiers: 14 }
};

export const DEFAULT_SETTINGS = {
  master: 80,
  music: 35,
  sfx: 85,
  sensitivity: 100,
  graphics: 'medium',
  difficulty: 'normal',
  vibration: true,
  swapHands: false
};
