export const MISSIONS = [
  {
    id: 1, title: 'BATTLEFIELD', kicker: 'OPERATION GREY RIVER',
    brief: 'The column is hit. Push up the lane to the aid trench.',
    theme: 'chaos', spawn: [0, 1.7, 8], yaw: 0,
    objectives: [
      { id: 'wake', text: 'GET YOUR BEARINGS', hint: 'Look around. Stick left, look right, FIRE to shoot.', type: 'look', duration: 2.4 },
      { id: 'move', text: 'PUSH TO THE FIRST TRENCH', hint: 'Follow the gold pole up the lane.', type: 'reach', pos: [0, 0, -22], r: 14 },
      { id: 'fire', text: 'CLEAR THE RIFLES ON THE LINE', hint: 'The gold pole sits on the nearest rifle. Kill or push past them.', type: 'clear', count: 2 },
      { id: 'aid', text: 'REACH THE AID TRENCH', hint: 'Keep going up the lane to the next gold pole.', type: 'reach', pos: [0, 0, -58], r: 16 }
    ],
    radio: [{ t: 2, msg: 'HQ: Push the lane. Do not wander the banks.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18], wakeDelay: 1 },
      { x: 4, z: -24, cover: [5, -26], wakeDelay: 1.5 },
      { x: 0, z: -40, cover: [1, -42] }
    ],
    waves: [{ t: 10, n: 2, z: -36 }],
    pickups: [{ type: 'ammo', x: 1.5, z: -17 }, { type: 'med', x: 2, z: -56 }]
  },
  {
    id: 2, title: 'OUTSKIRTS', kicker: 'THROUGH THE SETTLEMENT',
    brief: 'Push the smashed hamlet. Stay in the lane.',
    theme: 'settlement', spawn: [0, 1.7, 10], yaw: 0,
    objectives: [
      { id: 'post', text: 'REACH THE FIRST HOUSES', hint: 'Gold pole at the yard.', type: 'reach', pos: [0, 0, -20], r: 14 },
      { id: 'hold', text: 'BREAK THE DEFENDERS', hint: 'Kill the rifles or push past their line.', type: 'clear', count: 2 },
      { id: 'kit', text: 'TAKE THE CRATE KIT', hint: 'Walk onto the crate mark. It completes when you reach it.', type: 'reach', pos: [0, 0, -36], r: 12 },
      { id: 'next', text: 'REACH THE FORWARD TRENCH', hint: 'Keep pushing up the lane.', type: 'reach', pos: [0, 0, -68], r: 16 }
    ],
    radio: [{ t: 3, msg: 'Post 2: Hold the yard, then push.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -22, cover: [5, -24] },
      { x: -3, z: -36, cover: [-4, -38] }, { x: 4, z: -48, cover: [5, -50] }
    ],
    waves: [{ t: 8, n: 2, z: -30 }, { t: 18, n: 2, z: -50 }],
    pickups: [{ type: 'smg', x: 2, z: -36 }, { type: 'med', x: -2, z: -36 }]
  },
  {
    id: 3, title: 'INTO THE TOWN', kicker: 'KRENFELD EDGE',
    brief: 'First ruined streets. Stay on the road.',
    theme: 'townedge', spawn: [0, 1.7, 12], yaw: 0,
    objectives: [
      { id: 'wire', text: 'ENTER THE TOWN', hint: 'Gold pole at the first block.', type: 'reach', pos: [0, 0, -24], r: 14 },
      { id: 'cross', text: 'PUSH THE MAIN STREET', hint: 'Keep going up the lane.', type: 'reach', pos: [0, 0, -52], r: 16 },
      { id: 'far', text: 'CLEAR THE STREET', hint: 'Pole marks the nearest rifle.', type: 'clear', count: 3 },
      { id: 'next3', text: 'REACH THE NORTH BLOCK', hint: 'Gold pole at the far end.', type: 'reach', pos: [0, 0, -86], r: 16 }
    ],
    radio: [{ t: 4, msg: 'Spotter: Stay off the banks. Use the street.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -28, cover: [5, -30] },
      { x: -4, z: -46, cover: [-5, -48] }, { x: 4, z: -62, cover: [5, -64] },
      { x: 0, z: -78, cover: [1, -80] }
    ],
    waves: [{ t: 6, n: 2, z: -28 }, { t: 20, n: 2, z: -50 }],
    pickups: [{ type: 'ammo', x: 2, z: -24 }, { type: 'med', x: -2, z: -52 }]
  },
  {
    id: 4, title: 'URBAN BATTLE', kicker: 'KRENFELD QUARTER',
    brief: 'Dense streets. Follow the poles.',
    theme: 'town', spawn: [0, 1.7, 14], yaw: 0,
    objectives: [
      { id: 'square', text: 'REACH THE SQUARE', hint: 'Gold pole in the square.', type: 'reach', pos: [0, 0, -26], r: 14 },
      { id: 'clear', text: 'CLEAR THE SQUARE', hint: 'Pole marks the nearest rifle.', type: 'clear', count: 3 },
      { id: 'alley', text: 'PUSH THE NORTH STREET', hint: 'Keep going up the lane.', type: 'reach', pos: [0, 0, -58], r: 16 },
      { id: 'church', text: 'REACH THE HALL', hint: 'Gold pole at the broken hall.', type: 'reach', pos: [0, 0, -84], r: 16 }
    ],
    radio: [{ t: 5, msg: 'Scout: Windows on both walls. Stay low.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -26, cover: [5, -28] },
      { x: -4, z: -40, cover: [-5, -42] }, { x: 4, z: -54, cover: [5, -56] },
      { x: -3, z: -70, cover: [-4, -72] }, { x: 3, z: -82, cover: [4, -84] }
    ],
    waves: [{ t: 12, n: 2, z: -44 }],
    pickups: [{ type: 'carbine', x: 2, z: -26 }, { type: 'med', x: -2, z: -58 }]
  },
  {
    id: 5, title: 'DEFENSIVE LINE', kicker: 'CONCRETE WORKS',
    brief: 'Wire and bunkers. Flank in the lane, not the banks.',
    theme: 'bunker', spawn: [0, 1.7, 10], yaw: 0,
    objectives: [
      { id: 'wire', text: 'REACH THE WIRE', hint: 'Gold pole at the wire.', type: 'reach', pos: [0, 0, -22], r: 14 },
      { id: 'flank', text: 'PUSH THE BUNKER LINE', hint: 'Keep going. Pole marks the next cut.', type: 'reach', pos: [0, 0, -46], r: 16 },
      { id: 'knock', text: 'SILENCE THE CREW', hint: 'Pole marks the nearest rifle.', type: 'clear', count: 3 },
      { id: 'second', text: 'REACH THE SECOND WORKS', hint: 'Gold pole ahead.', type: 'reach', pos: [0, 0, -80], r: 16 }
    ],
    radio: [{ t: 4, msg: 'Sergeant: Do not climb the banks.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -28, cover: [5, -30] },
      { x: -4, z: -42, cover: [-5, -44] }, { x: 4, z: -58, cover: [5, -60] },
      { x: 0, z: -74, cover: [1, -76] }
    ],
    waves: [{ t: 16, n: 2, z: -50 }],
    pickups: [{ type: 'ammo', x: 2, z: -46 }, { type: 'med', x: -2, z: -78 }]
  },
  {
    id: 6, title: 'FINAL APPROACH', kicker: 'THE APPROACH',
    brief: 'Smoke and a thinning company. Push the lane.',
    theme: 'outskirts', spawn: [0, 1.7, 12], yaw: 0,
    objectives: [
      { id: 'ridge', text: 'REACH THE SMOKE RIDGE', hint: 'Gold pole on the ridge.', type: 'reach', pos: [0, 0, -24], r: 14 },
      { id: 'hold2', text: 'BREAK THE LINE', hint: 'Kill or push past the rifles.', type: 'clear', count: 2 },
      { id: 'yard', text: 'CROSS THE YARD', hint: 'Keep going up the lane.', type: 'reach', pos: [0, 0, -60], r: 16 },
      { id: 'gate', text: 'REACH THE OUTER GATE', hint: 'Gold pole at the gate.', type: 'reach', pos: [0, 0, -90], r: 16 }
    ],
    radio: [{ t: 3, msg: 'HQ: Barrage incoming. Stay in the cut.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -26, cover: [5, -28] },
      { x: -4, z: -42, cover: [-5, -44] }, { x: 4, z: -58, cover: [5, -60] },
      { x: -3, z: -74, cover: [-4, -76] }, { x: 3, z: -88, cover: [4, -90] }
    ],
    waves: [{ t: 10, n: 2, z: -34 }, { t: 28, n: 2, z: -64 }],
    pickups: [{ type: 'smg', x: 2, z: -24 }, { type: 'med', x: -2, z: -60 }]
  },
  {
    id: 7, title: 'FINAL ASSAULT', kicker: 'FINAL ASSAULT',
    brief: 'Take the signal house at the end of the lane.',
    theme: 'final', spawn: [0, 1.7, 14], yaw: 0,
    objectives: [
      { id: 'breach', text: 'BREACH THE YARD', hint: 'Gold pole at the yard.', type: 'reach', pos: [0, 0, -24], r: 14 },
      { id: 'yardc', text: 'CLEAR THE YARD', hint: 'Pole marks the nearest rifle.', type: 'clear', count: 3 },
      { id: 'house', text: 'REACH THE SIGNAL HOUSE', hint: 'Gold pole at the house.', type: 'reach', pos: [0, 0, -74], r: 16 },
      { id: 'done', text: 'HOLD THE HOUSE', hint: 'Stay near the pole until it counts.', type: 'survive', duration: 16 }
    ],
    radio: [{ t: 3, msg: 'HQ: Signal house is the end of the lane.' }],
    enemies: [
      { x: -4, z: -16, cover: [-5, -18] }, { x: 4, z: -24, cover: [5, -26] },
      { x: -4, z: -38, cover: [-5, -40] }, { x: 4, z: -52, cover: [5, -54] },
      { x: -3, z: -66, cover: [-4, -68] }, { x: 3, z: -78, cover: [4, -80] }
    ],
    waves: [{ t: 10, n: 2, z: -32 }, { t: 40, n: 2, z: -60 }],
    pickups: [{ type: 'carbine', x: 2, z: -24 }, { type: 'med', x: -2, z: -72 }]
  }
];

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) || MISSIONS[0];
}
