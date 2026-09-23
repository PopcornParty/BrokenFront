import { VERSION } from './config.js';

export const SEEN_KEY = 'brokenfront-changelog-seen';

export const CHANGELOG = [
  {
    version: '1.1.0',
    title: 'BATTLEFIELD EXPANSION',
    date: '23 September 2026',
    description: 'A visual and systems overhaul of the opening front. The ground is no longer flat, cover actually blocks fire, and the first section is taught instead of thrown.',
    added: [
      'Uneven rural battlefield with craters, trenches, rocks, fences and debris',
      'Distant ruined skyline for later city missions',
      'Objective hint text and live distance marker',
      'Fullscreen using the browser Fullscreen API',
      'Graphics quality steps: Low, Medium, High, Very High',
      'Button opacity and camera-motion settings',
      'This update log'
    ],
    removed: [
      'Old flat placeholder terrain'
    ],
    fixed: [
      'Enemies shooting through rocks and solid cover',
      'Objective text that did not explain the next job',
      'Settings keys missing after older saves loaded'
    ],
    improved: [
      'Lighting, fog, materials and sky',
      'Mobile HUD layout and button feedback',
      'First-mission difficulty and cover usefulness',
      'Ambient battlefield audio',
      'First-person camera motion'
    ]
  },
  {
    version: '1.0.0',
    title: 'GAME CREATION',
    date: '23 September 2026',
    description: 'The first playable version of Broken Front. Introduces the opening campaign, first battlefield, FPS controls and core combat systems.',
    added: [
      'Core FPS gameplay',
      'First WWII battlefield',
      'Opening story sequence',
      'Mobile landscape controls',
      'Desktop controls',
      'Enemy AI',
      'Weapon system',
      'Health system',
      'Checkpoints',
      'Difficulty system',
      'Main menu',
      'Settings',
      'Initial campaign'
    ],
    removed: [],
    fixed: [
      'Initial release'
    ],
    improved: []
  }
];

export function latestVersion() {
  return CHANGELOG[0]?.version || VERSION;
}

export function hasUnseenLog() {
  try {
    return localStorage.getItem(SEEN_KEY) !== latestVersion();
  } catch {
    return true;
  }
}

export function markLogSeen() {
  try {
    localStorage.setItem(SEEN_KEY, latestVersion());
  } catch { /* ignore quota */ }
}

function listBlock(label, items) {
  if (!items || !items.length) {
    return `<div class="log-sec"><h4>${label}</h4><p class="log-empty">Nothing</p></div>`;
  }
  return `<div class="log-sec"><h4>${label}</h4><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`;
}

export function renderChangelog(root) {
  root.innerHTML = CHANGELOG.map((e) => `
    <article class="log-entry">
      <p class="log-ver">VERSION ${e.version}</p>
      <h3>${e.title}</h3>
      <p class="log-date">Date: ${e.date}</p>
      <p class="log-desc">${e.description}</p>
      ${listBlock('ADDED', e.added)}
      ${listBlock('REMOVED', e.removed)}
      ${listBlock('FIXED', e.fixed)}
      ${listBlock('IMPROVED', e.improved)}
    </article>
  `).join('');
}
