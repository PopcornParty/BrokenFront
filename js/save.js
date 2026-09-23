import { SAVE_KEY, DEFAULT_SETTINGS } from './config.js';

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createFresh();
    return { ...createFresh(), ...JSON.parse(raw) };
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
    hasProgress: false
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
