import { VERSION } from './config.js';

export const SEEN_KEY = 'brokenfront-changelog-seen';

export const CHANGELOG = [
  {
    version: '1.6.0',
    title: 'COMBAT PASS',
    date: '24 September 2026',
    description: 'Headshots work. Enemies take damage and shoot back. The rifle hits harder. Walking through twenty rounds no longer works.',
    added: [
      'Separate head and body hitboxes',
      'Headshot damage (about two times body damage) and a gold hit marker'
    ],
    removed: [
      'Mission 1 extra health and damage-reduction padding'
    ],
    fixed: [
      'Shots aimed at the head missing the body-only hit test',
      'Enemies spawned outside the lane who never saw the player',
      'Some rifles never firing because line of sight only tested the chest'
    ],
    improved: [
      'Weapon damage and fire rate',
      'Enemy accuracy and shot damage',
      'Slower health regen after you are hit'
    ]
  },
  {
    version: '1.5.0',
    title: 'TOGGLE AIM AND SEEDED LANE',
    date: '23 September 2026',
    description: 'AIM stays on until you tap it again. The battlefield now lays cover in a seeded zigzag so each mission stretch is packed instead of empty.',
    added: [
      'Toggle AIM on mobile: tap once to aim, tap again to leave ADS',
      'AIM button highlight while aimed',
      'Seeded map generator that places ruins, wrecks, trenches and sandbags down the lane'
    ],
    removed: [
      'Hold-to-aim on the mobile AIM button'
    ],
    fixed: [
      'AIM dropping as soon as the thumb lifted'
    ],
    improved: [
      'Cover density along the fight corridor'
    ]
  },
  {
    version: '1.4.1',
    title: 'WALLS BLOCK FIRE',
    date: '23 September 2026',
    description: 'Enemies no longer shoot through brick walls. Cover uses a real ray test against every solid piece.',
    added: [
      'Ray-box line of sight for walls, wrecks and banks',
      'Thicker ruined houses with extra walls, roof slab and rubble'
    ],
    removed: [],
    fixed: [
      'AI firing through walls',
      'Thin walls being skipped by coarse sight checks'
    ],
    improved: [
      'Sandbag nests in the lane',
      'Ruin silhouettes'
    ]
  },
  {
    version: '1.4.0',
    title: 'NARROW FRONT',
    date: '23 September 2026',
    description: 'The map is no longer a wide empty field. Earth banks close the sides so you cannot walk around cover.',
    added: [
      'Earth banks that close the sides of every mission',
      'Denser wrecks, sandbag nests and ruined houses on the first map'
    ],
    removed: [
      'Wide open flanks around isolated cover'
    ],
    fixed: [
      'Walking around enemy positions instead of fighting through them'
    ],
    improved: [
      'Battlefield density and readable lane'
    ]
  },
  {
    version: '1.3.1',
    title: 'MOBILE THUMBS',
    date: '23 September 2026',
    description: 'Broken Front is built for landscape phones first. The stick, look pad and fire cluster are easier to use with two thumbs.',
    added: [
      'Larger left-hand move pad around the joystick',
      'Look pad that stays above the FIRE / AIM cluster so buttons are not blocked'
    ],
    removed: [],
    fixed: [
      'Phone page-scroll stealing look drags',
      'Having to hit the exact joystick circle to walk'
    ],
    improved: [
      'Touch look speed',
      'On-screen control labels'
    ]
  },
  {
    version: '1.3.0',
    title: 'CONTROLS RESTORED',
    date: '23 September 2026',
    description: 'Fixes the live build where movement, look and fire did nothing after load.',
    added: [
      'Text labels on fire, aim, reload, grenade and sprint',
      'Clearer mission chip and objective card'
    ],
    removed: [],
    fixed: [
      'Controls locked after New Campaign / Continue because input started disabled',
      'Look pad ignoring the first touch',
      'Keyboard and mouse doing nothing until an enable flag was set'
    ],
    improved: [
      'Mobile button layout and contrast',
      'Pause / resume recaptures look immediately'
    ]
  },
  {
    version: '1.2.0',
    title: 'FRONT REPAIR',
    date: '23 September 2026',
    description: 'Fixes the blank Continue world and dead controls after Resume, and rebuilds mission loading.',
    added: [
      'Reliable mission loading screen that only drops into play after the world exists',
      'World objective beacon on reach points',
      'Mission / checkpoint HUD chip',
      'Sprint control on mobile',
      'Visible error screen if a mission fails to load',
      'Seven distinct mission environments from open field to final assault'
    ],
    removed: [
      'Scene-destroying world dispose that could leave a blank canvas'
    ],
    fixed: [
      'Continue Campaign loading an empty world',
      'Resume leaving movement, look and fire disconnected',
      'Duplicate input listeners on later boots',
      'Pointer lock not recaptured after pause on desktop',
      'Invalid saved mission IDs failing to clamp to 1-7'
    ],
    improved: [
      'Buildings with walls, roofs, windows and damaged sections',
      'Terrain colour, roads, rubble, barrels and smoke',
      'Objective wording and on-screen distance marker',
      'Weapon muzzle flash on the viewmodel'
    ]
  },
  {
    version: '1.1.0',
    title: 'BATTLEFIELD EXPANSION',
    date: '23 September 2026',
    description: 'A visual and systems overhaul of the opening front. Cover actually blocks fire, and the first section is taught instead of thrown.',
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
