export const MISSIONS = [
  {
    id: 1, title: 'BATTLEFIELD', kicker: 'OPERATION GREY RIVER',
    brief: 'The column is hit on open ground. Survive, reach the forward trench, then get off this field.',
    theme: 'chaos', spawn: [0, 1.7, 8], yaw: 0,
    objectives: [
      { id: 'wake', text: 'SURVIVE THE ATTACK', hint: 'Look around. Learn the stick, the look pad, fire and aim.', type: 'look', duration: 3.2 },
      { id: 'move', text: 'REACH THE FORWARD POSITION', hint: 'Follow the gold marker.', type: 'reach', pos: [0, 0, -28], r: 7 },
      { id: 'fire', text: 'CLEAR THE ENEMY POSITION', hint: 'Rifles ahead in the lane.', type: 'clear', count: 2 },
      { id: 'aid', text: 'REACH THE EXTRACTION ROUTE', hint: 'Aid trench ahead.', type: 'reach', pos: [4, 0, -62], r: 6 }
    ],
    radio: [{ t: 2, msg: 'HQ: Hold any ditch you can find.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18], wakeDelay: 1 },
      { x: 4, z: -24, cover: [5, -26], wakeDelay: 1.5 },
      { x: 0, z: -40, cover: [1, -42] }
    ],
    waves: [{ t: 10, n: 2, z: -36 }],
    pickups: [{ type: 'ammo', x: 1.5, z: -17 }, { type: 'med', x: 5, z: -60 }]
  },
  {
    id: 2, title: 'OUTSKIRTS', kicker: 'THROUGH THE SETTLEMENT',
    brief: 'A smashed hamlet sits between the fields and the town.',
    theme: 'settlement', spawn: [0, 1.7, 10], yaw: 0,
    objectives: [
      { id: 'post', text: 'REACH THE OUTSKIRTS', type: 'reach', pos: [0, 0, -18], r: 5 },
      { id: 'hold', text: 'ELIMINATE THE ENEMY DEFENDERS', type: 'survive', duration: 24 },
      { id: 'kit', text: 'PUSH THROUGH THE SETTLEMENT', type: 'interact', pos: [3, 0, -16], r: 3 },
      { id: 'next', text: 'REACH THE CHECKPOINT', type: 'reach', pos: [2, 0, -70], r: 6 }
    ],
    radio: [{ t: 3, msg: 'Post 2: Hold the yard.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -22, cover: [5, -24] },
      { x: -3, z: -36, cover: [-4, -38] }, { x: 4, z: -48, cover: [5, -50] }
    ],
    waves: [{ t: 8, n: 2, z: -30 }, { t: 18, n: 2, z: -50 }],
    pickups: [{ type: 'smg', x: 3, z: -16 }, { type: 'med', x: 4.2, z: -16 }]
  },
  {
    id: 3, title: 'INTO THE TOWN', kicker: 'KRENFELD EDGE',
    brief: 'The first ruined streets.',
    theme: 'townedge', spawn: [0, 1.7, 12], yaw: 0,
    objectives: [
      { id: 'wire', text: 'ENTER THE TOWN', type: 'reach', pos: [-4, 0, -24], r: 6 },
      { id: 'cross', text: 'REACH THE MAIN STREET', type: 'reach', pos: [6, 0, -58], r: 7 },
      { id: 'far', text: 'CLEAR THE ENEMY POSITION', type: 'clear', count: 3 },
      { id: 'next3', text: 'REACH THE NEXT CHECKPOINT', type: 'reach', pos: [0, 0, -92], r: 7 }
    ],
    radio: [{ t: 4, msg: 'Spotter: Movement ahead.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -28, cover: [5, -30] },
      { x: -4, z: -46, cover: [-5, -48] }, { x: 4, z: -62, cover: [5, -64] },
      { x: 0, z: -78, cover: [1, -80] }
    ],
    waves: [{ t: 6, n: 2, z: -28 }, { t: 20, n: 2, z: -50 }],
    pickups: [{ type: 'ammo', x: -3, z: -24 }, { type: 'med', x: 5, z: -58 }]
  },
  {
    id: 4, title: 'URBAN BATTLE', kicker: 'KRENFELD QUARTER',
    brief: 'Dense ruined streets.',
    theme: 'town', spawn: [0, 1.7, 14], yaw: 0,
    objectives: [
      { id: 'square', text: 'ADVANCE THROUGH THE CITY', type: 'reach', pos: [0, 0, -30], r: 6 },
      { id: 'clear', text: 'CLEAR THE STREET', type: 'clear', count: 4 },
      { id: 'alley', text: 'REACH THE BUILDING', type: 'reach', pos: [6, 0, -62], r: 5 },
      { id: 'church', text: 'PUSH TO THE NEXT POSITION', type: 'reach', pos: [0, 0, -88], r: 6 }
    ],
    radio: [{ t: 5, msg: 'Scout: Watch the windows.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -26, cover: [5, -28] },
      { x: -4, z: -40, cover: [-5, -42] }, { x: 4, z: -54, cover: [5, -56] },
      { x: -3, z: -70, cover: [-4, -72] }, { x: 3, z: -82, cover: [4, -84] }
    ],
    waves: [{ t: 12, n: 2, z: -44 }],
    pickups: [{ type: 'carbine', x: -2, z: -31 }, { type: 'med', x: 5, z: -62 }]
  },
  {
    id: 5, title: 'DEFENSIVE LINE', kicker: 'CONCRETE WORKS',
    brief: 'Bunkers and wire.',
    theme: 'bunker', spawn: [0, 1.7, 10], yaw: 0,
    objectives: [
      { id: 'wire', text: 'REACH THE DEFENSIVE LINE', type: 'reach', pos: [0, 0, -22], r: 6 },
      { id: 'flank', text: 'BREAK THROUGH THE POSITION', type: 'reach', pos: [-6, 0, -44], r: 6 },
      { id: 'knock', text: 'CLEAR THE TRENCHES', type: 'clear', count: 3 },
      { id: 'second', text: 'REACH THE FORWARD CHECKPOINT', type: 'reach', pos: [4, 0, -82], r: 6 }
    ],
    radio: [{ t: 4, msg: 'Sergeant: Left ditch is still open.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -28, cover: [5, -30] },
      { x: -4, z: -42, cover: [-5, -44] }, { x: 4, z: -58, cover: [5, -60] },
      { x: 0, z: -74, cover: [1, -76] }
    ],
    waves: [{ t: 16, n: 2, z: -50 }],
    pickups: [{ type: 'ammo', x: -5, z: -44 }, { type: 'med', x: 3, z: -80 }]
  },
  {
    id: 6, title: 'FINAL APPROACH', kicker: 'THE APPROACH',
    brief: 'The main works sit ahead.',
    theme: 'outskirts', spawn: [0, 1.7, 12], yaw: 0,
    objectives: [
      { id: 'ridge', text: 'ADVANCE TO THE CITY CENTRE', type: 'reach', pos: [0, 0, -28], r: 7 },
      { id: 'hold2', text: 'PUSH THROUGH THE ENEMY LINE', type: 'survive', duration: 24 },
      { id: 'yard', text: 'REACH THE FINAL APPROACH', type: 'reach', pos: [6, 0, -64], r: 7 },
      { id: 'gate', text: 'PREPARE FOR THE ASSAULT', type: 'reach', pos: [0, 0, -96], r: 7 }
    ],
    radio: [{ t: 3, msg: 'HQ: Barrage incoming.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -26, cover: [5, -28] },
      { x: -4, z: -42, cover: [-5, -44] }, { x: 4, z: -58, cover: [5, -60] },
      { x: -3, z: -74, cover: [-4, -76] }, { x: 3, z: -88, cover: [4, -90] }
    ],
    waves: [{ t: 10, n: 2, z: -34 }, { t: 28, n: 2, z: -64 }],
    pickups: [{ type: 'smg', x: -2, z: -28 }, { type: 'med', x: 5, z: -64 }]
  },
  {
    id: 7, title: 'FINAL ASSAULT', kicker: 'FINAL ASSAULT',
    brief: 'Take the signal house.',
    theme: 'final', spawn: [0, 1.7, 14], yaw: 0,
    objectives: [
      { id: 'breach', text: 'ADVANCE TO THE FINAL POSITION', type: 'reach', pos: [0, 0, -26], r: 7 },
      { id: 'yardc', text: 'BREAK THROUGH THE DEFENCES', type: 'clear', count: 4 },
      { id: 'house', text: 'CLEAR THE OBJECTIVE AREA', type: 'reach', pos: [0, 0, -78], r: 6 },
      { id: 'hold3', text: 'HOLD UNTIL THE FLARE', type: 'survive', duration: 22 },
      { id: 'done', text: 'REACH SAFETY', type: 'interact', pos: [0, 0, -80], r: 3 }
    ],
    radio: [{ t: 3, msg: 'HQ: Signal house is the point of this week.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -24, cover: [5, -26] },
      { x: -4, z: -38, cover: [-5, -40] }, { x: 4, z: -52, cover: [5, -54] },
      { x: -3, z: -66, cover: [-4, -68] }, { x: 3, z: -78, cover: [4, -80] }
    ],
    waves: [{ t: 10, n: 2, z: -32 }, { t: 40, n: 2, z: -60 }],
    pickups: [{ type: 'carbine', x: 4, z: -26 }, { type: 'med', x: -4, z: -27 }]
  }
];

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) || MISSIONS[0];
}
