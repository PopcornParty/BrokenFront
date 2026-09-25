import { SAVE_KEY, DEFAULT_SETTINGS } from './config.js';

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createFresh();
    const parsed = JSON.parse(raw);
    const fresh = createFresh();
    return {
      ...fresh,
      ...parsed,
      soldier: { ...fresh.soldier, ...(parsed.soldier || {}) },
      settings: { ...fresh.settings, ...(parsed.settings || {}) },
      unlocked: Array.from(new Set([...(fresh.unlocked || []), ...((parsed.unlocked) || [])])),
      loadout: parsed.loadout || 'rifle'
    };
  } catch {
    return createFresh();
  }
}

export function createFresh() {
  return {
    version: 1,
    mission: 1,
    checkpoint: 0,
    completed: false,
    soldier: { name: 'Reed', kit: 'olive' },
    settings: { ...DEFAULT_SETTINGS },
    hasProgress: false,
    unlocked: ['rifle', 'pistol'],
    loadout: 'rifle'
  };
}

export function writeSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function patchSave(partial) {
  const next = { ...loadSave(), ...partial };
  writeSave(next);
  return next;
}

export function unlockForMission(save) {
  const m = save.mission || 1;
  const set = new Set(save.unlocked || ['rifle', 'pistol']);
  set.add('rifle'); set.add('pistol');
  if (m >= 2 || save.completed) set.add('smg');
  if (m >= 4 || save.completed) set.add('carbine');
  save.unlocked = Array.from(set);
  if (!save.loadout) save.loadout = 'rifle';
  return save;
}
