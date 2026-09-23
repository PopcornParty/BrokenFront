export const MISSIONS = [
  {
    id: 1,
    title: 'WAKE',
    kicker: 'OPERATION GREY RIVER',
    brief: 'The column is hit. Find your feet and reach the aid trench.',
    theme: 'chaos',
    spawn: [0, 1.7, 8],
    yaw: 0,
    objectives: [
      { id: 'wake', text: 'Get your bearings', hint: 'Look around with the right side of the screen.', type: 'look', duration: 3.2 },
      { id: 'move', text: 'Reach the forward trench', hint: 'Follow the marker. Stay low behind cover.', type: 'reach', pos: [0, 0, -28], r: 7 },
      { id: 'fire', text: 'Clear the two rifles ahead', hint: 'Use the sandbags. They cannot shoot through rock.', type: 'clear', count: 2 },
      { id: 'aid', text: 'Reach the aid trench', hint: 'Supplies sit by the crate. Keep moving west of the wreck.', type: 'reach', pos: [4, 0, -62], r: 6 }
    ],
    radio: [
      { t: 2, msg: 'HQ: All units, scatter! Hold any ditch you can find.' },
      { t: 16, msg: 'Unknown: Get off the road! Aid marker is west of the wreck.' }
    ],
    enemies: [
      { x: -8, z: -26, cover: [-10, -28], wakeDelay: 9 },
      { x: 9, z: -34, cover: [11, -36], wakeDelay: 14 }
    ],
    pickups: [
      { type: 'ammo', x: 1.5, z: -17 },
      { type: 'med', x: 5, z: -60 }
    ],
    events: [{ t: 6, type: 'artillery', x: 12, z: -18 }]
  },
  {
    id: 2,
    title: 'HOLDFAST',
    kicker: 'FIRST LINE',
    brief: 'A sandbag nest is still manned. Hold it, then push to the next post.',
    theme: 'defense',
    spawn: [0, 1.7, 10],
    yaw: 0,
    objectives: [
      { id: 'post', text: 'Reach the sandbag post', type: 'reach', pos: [0, 0, -18], r: 5 },
      { id: 'hold', text: 'Survive the counter-push', type: 'survive', duration: 28 },
      { id: 'kit', text: 'Take the field kit on the crate', type: 'interact', pos: [3, 0, -16], r: 3 },
      { id: 'next', text: 'Advance to the forward trench', type: 'reach', pos: [2, 0, -70], r: 6 }
    ],
    radio: [
      { t: 3, msg: 'Post 2: We have a hole in the line. One rifle is better than none.' },
      { t: 20, msg: 'Post 2: Kit on the crate — SMG and dressings. Take them.' }
    ],
    enemies: [
      { x: -10, z: -36, cover: [-12, -38] },
      { x: 8, z: -34, cover: [10, -36] },
      { x: 0, z: -48, cover: [2, -50] },
      { x: 14, z: -44, cover: [12, -46] }
    ],
    waves: [{ t: 8, n: 2, z: -55 }, { t: 18, n: 2, z: -50 }],
    pickups: [
      { type: 'smg', x: 3, z: -16 },
      { type: 'med', x: 4.2, z: -16 },
      { type: 'grenade', x: 2, z: -15.4 }
    ]
  },
  {
    id: 3,
    title: 'OPEN GROUND',
    kicker: 'THE FIELDS',
    brief: 'Cross the broken fields and the trench web. Stay low.',
    theme: 'fields',
    spawn: [0, 1.7, 12],
    yaw: 0,
    objectives: [
      { id: 'wire', text: 'Reach the first trench cut', type: 'reach', pos: [-4, 0, -24], r: 6 },
      { id: 'cross', text: 'Cross the open field', type: 'reach', pos: [6, 0, -58], r: 7 },
      { id: 'far', text: 'Push through to the far bank', type: 'reach', pos: [0, 0, -92], r: 7 }
    ],
    radio: [
      { t: 4, msg: 'Spotter: Movement on the ridge. Do not stand tall in the mud.' },
      { t: 30, msg: 'Spotter: Far bank is marked by the burnt cart.' }
    ],
    enemies: [
      { x: -12, z: -32, cover: [-14, -34] },
      { x: 10, z: -40, cover: [12, -42] },
      { x: -6, z: -62, cover: [-8, -64] },
      { x: 8, z: -70, cover: [10, -72] },
      { x: 0, z: -84, cover: [2, -86] }
    ],
    pickups: [
      { type: 'ammo', x: -3, z: -24 },
      { type: 'med', x: 5, z: -58 }
    ]
  },
  {
    id: 4,
    title: 'STONE STREETS',
    kicker: 'KRENFELD QUARTER',
    brief: 'The town is a shell. Move street to street. Watch windows.',
    theme: 'town',
    spawn: [0, 1.7, 14],
    yaw: 0,
    objectives: [
      { id: 'square', text: 'Reach the ruined square', type: 'reach', pos: [0, 0, -30], r: 6 },
      { id: 'clear', text: 'Clear the square defenders', type: 'clear', count: 4 },
      { id: 'alley', text: 'Cut through the north alley', type: 'reach', pos: [8, 0, -62], r: 5 },
      { id: 'church', text: 'Reach the broken hall', type: 'reach', pos: [0, 0, -88], r: 6 }
    ],
    radio: [
      { t: 5, msg: 'Scout: Windows on the east wall. They like the second storey.' },
      { t: 40, msg: 'Scout: Hall doors are gone. Use the rubble as cover.' }
    ],
    enemies: [
      { x: -8, z: -28, cover: [-10, -26], window: true },
      { x: 10, z: -32, cover: [12, -30], window: true },
      { x: -4, z: -44, cover: [-6, -46] },
      { x: 6, z: -50, cover: [8, -52] },
      { x: -10, z: -70, cover: [-12, -68] },
      { x: 4, z: -80, cover: [6, -82] }
    ],
    pickups: [
      { type: 'carbine', x: -2, z: -31 },
      { type: 'med', x: 7, z: -62 },
      { type: 'grenade', x: 1, z: -86 }
    ]
  },
  {
    id: 5,
    title: 'IRON LINE',
    kicker: 'CONCRETE WORKS',
    brief: 'Bunkers and wire. Flank when the front door is suicide.',
    theme: 'bunker',
    spawn: [0, 1.7, 10],
    yaw: 0,
    objectives: [
      { id: 'wire', text: 'Reach the outer wire', type: 'reach', pos: [0, 0, -22], r: 6 },
      { id: 'flank', text: 'Flank the first bunker', type: 'reach', pos: [-16, 0, -44], r: 6 },
      { id: 'knock', text: 'Silence the bunker crew', type: 'clear', count: 3 },
      { id: 'second', text: 'Take the second works', type: 'reach', pos: [4, 0, -82], r: 6 }
    ],
    radio: [
      { t: 4, msg: 'Sergeant: Do not charge the slit. Left ditch is still open.' },
      { t: 25, msg: 'Sergeant: If they fall back, do not chase blind.' }
    ],
    enemies: [
      { x: 2, z: -36, cover: [0, -38] },
      { x: -14, z: -42, cover: [-16, -44] },
      { x: 8, z: -48, cover: [10, -50] },
      { x: -6, z: -66, cover: [-8, -68] },
      { x: 10, z: -74, cover: [8, -76] }
    ],
    waves: [{ t: 20, n: 2, z: -60 }],
    pickups: [
      { type: 'ammo', x: -16, z: -44 },
      { type: 'med', x: -15, z: -43 },
      { type: 'grenade', x: 3, z: -80 }
    ]
  },
  {
    id: 6,
    title: 'OUTSKIRTS',
    kicker: 'THE APPROACH',
    brief: 'The main works sit ahead. Smoke, noise, and a thinning company.',
    theme: 'outskirts',
    spawn: [0, 1.7, 12],
    yaw: 0,
    objectives: [
      { id: 'ridge', text: 'Reach the smoke ridge', type: 'reach', pos: [0, 0, -28], r: 7 },
      { id: 'hold2', text: 'Hold while the barrage lifts', type: 'survive', duration: 24 },
      { id: 'yard', text: 'Cross the vehicle yard', type: 'reach', pos: [6, 0, -64], r: 7 },
      { id: 'gate', text: 'Reach the outer gate', type: 'reach', pos: [0, 0, -96], r: 7 }
    ],
    radio: [
      { t: 3, msg: 'HQ: Barrage in two minutes. Do not be on that ridge standing.' },
      { t: 28, msg: 'HQ: Gatehouse still contested. Push when the smoke thickens.' }
    ],
    enemies: [
      { x: -12, z: -30, cover: [-14, -32] },
      { x: 10, z: -34, cover: [12, -36] },
      { x: -8, z: -52, cover: [-10, -54] },
      { x: 14, z: -58, cover: [12, -60] },
      { x: 0, z: -76, cover: [2, -78] },
      { x: 8, z: -88, cover: [6, -90] }
    ],
    waves: [{ t: 10, n: 2, z: -40 }, { t: 32, n: 2, z: -70 }],
    pickups: [
      { type: 'smg', x: -2, z: -28 },
      { type: 'med', x: 5, z: -64 },
      { type: 'ammo', x: 4, z: -63 },
      { type: 'grenade', x: -3, z: -94 }
    ],
    events: [{ t: 8, type: 'artillery', x: 8, z: -20 }, { t: 14, type: 'artillery', x: -10, z: -36 }]
  },
  {
    id: 7,
    title: 'LAST PUSH',
    kicker: 'FINAL ASSAULT',
    brief: 'Take the signal house. End the operation. Walk out on your own feet.',
    theme: 'final',
    spawn: [0, 1.7, 14],
    yaw: 0,
    objectives: [
      { id: 'breach', text: 'Breach the outer yard', type: 'reach', pos: [0, 0, -26], r: 7 },
      { id: 'yardc', text: 'Clear the yard', type: 'clear', count: 4 },
      { id: 'house', text: 'Reach the signal house', type: 'reach', pos: [0, 0, -78], r: 6 },
      { id: 'hold3', text: 'Hold the house until the flare', type: 'survive', duration: 22 },
      { id: 'done', text: 'Signal the all-clear', type: 'interact', pos: [0, 0, -80], r: 3 }
    ],
    radio: [
      { t: 3, msg: 'HQ: Signal house is the whole point of this week. Take it and mark it.' },
      { t: 40, msg: 'HQ: Flare kit is inside. Hold the door until it burns.' }
    ],
    enemies: [
      { x: -10, z: -24, cover: [-12, -26] },
      { x: 10, z: -28, cover: [12, -30] },
      { x: -6, z: -40, cover: [-8, -42] },
      { x: 8, z: -46, cover: [10, -48] },
      { x: -12, z: -64, cover: [-10, -66] },
      { x: 6, z: -72, cover: [8, -74] }
    ],
    waves: [{ t: 12, n: 2, z: -36 }, { t: 50, n: 2, z: -70 }],
    pickups: [
      { type: 'carbine', x: 4, z: -26 },
      { type: 'med', x: -4, z: -27 },
      { type: 'grenade', x: 2, z: -77 },
      { type: 'med', x: -2, z: -77 }
    ],
    events: [
      { t: 6, type: 'artillery', x: -8, z: -18 },
      { t: 18, type: 'artillery', x: 12, z: -40 }
    ]
  }
];

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) || MISSIONS[0];
}
