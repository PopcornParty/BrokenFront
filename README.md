# BROKEN FRONT

**Version 1.5.0**

An original cinematic single-player WWII-inspired first-person shooter for landscape phones and desktop browsers. You are one ordinary soldier on a fictional front. There is no superhero, no mastermind villain, and no copied film scene — only the job in front of you.

Broken Front is a **fictional** project. It is not affiliated with, endorsed by, or adapted from any film, studio, publisher, or commercial game. It is **not** Call of Duty.

Live site:

`https://popcornparty.github.io/BrokenFront/`

## Description

A company column breaks on the approach to Grey River. Friends disappear into smoke. Orders thin out. You work seven missions across fields, trenches, ruined streets and concrete works until the signal house is taken.

The campaign is linear and built as a static website with no account and no backend.

## Features

- 7-mission linear campaign with checkpoints
- Easy / Normal / Hard
- Mobile landscape touch controls (joystick, look pad, large buttons)
- Toggle AIM on phones (tap on, tap off)
- Desktop WASD + mouse for testing
- Rifle, carbine, SMG, sidearm, grenades
- Health system
- Enemy AI with wall / cover line-of-sight
- Narrow battlefield lane so you cannot walk around the fight
- Settings: volume, sensitivity, graphics, difficulty, vibration
- localStorage save
- In-game Update Log (v1.0.0 through current)
- GitHub Pages static deploy

## How to play

1. Open the site on a phone in **landscape**, or on a desktop browser.
2. Tap **New Campaign** or **Continue**.
3. Follow the objective bar. Reach marks, hold ground, pick up kits, push the line.

### Mobile controls

| Control | Action |
| --- | --- |
| Left stick / left pad | Move |
| Right look pad | Turn / look |
| FIRE | Hold to shoot |
| AIM | Tap to aim, tap again to stop |
| R | Reload |
| G | Grenade |
| ▲ | Jump |
| C | Crouch |
| SPRINT | Hold to run |
| USE | Interact |
| II | Pause |

### Desktop controls

| Key | Action |
| --- | --- |
| W A S D | Move |
| Mouse | Look (click the game to lock the pointer) |
| Left mouse | Fire |
| Right mouse | Aim (hold) |
| R | Reload |
| G | Grenade |
| E | Interact |
| Space | Jump |
| C | Crouch |
| Shift | Sprint |
| Esc | Pause |

### Fullscreen

Use the FULLSCREEN button on the menu, or Settings. On iPhone, add the site to the Home Screen for a cleaner full-screen feel.

## Installation / local testing

No build step. From the repo root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

1. Push `main`.
2. Repo **Settings → Pages**.
3. Deploy with `.github/workflows/pages.yml` or publish `main` from `/`.
4. First publish can take a minute.

## Performance

Aimed at modern mobile browsers.

- Low-poly procedural geometry
- Canvas textures (no huge image packs)
- Capped pixel ratio
- Few live enemies at once
- Mission-based load

If a phone stutters, set Graphics to **Low**.

## Graphics honesty

This game **cannot look like COD Mobile**.

COD Mobile is a huge download with a professional art team, high-res character models, weapon models, city kits, baked lighting and a custom engine.

Broken Front is a free webpage. Everything you see is built from simple shapes and generated textures so it runs on a phone browser with no install.

I can keep packing the map and lighting. I cannot fake a COD Mobile screenshot with boxes.

The list below is what I actually need from you if you want the next real jump in quality.

## Credits

- Game design, campaign, code, UI, procedural art, procedural audio: original to this repository
- 3D rendering: [Three.js](https://threejs.org/) (MIT License), loaded from jsDelivr CDN

## Asset licences

| Asset | Source | Licence |
| --- | --- |
| Geometry / soldiers / maps | Procedural in `js/world.js` | Original |
| Ground / brick / wood textures | Generated on a canvas at runtime | Original |
| Gunfire, reload, steps, radio, music | Web Audio in `js/audio.js` | Original |
| Three.js | https://github.com/mrdoob/three.js | MIT |

Do **not** send ripped COD, Warzone, film, or other game files. Those cannot be used.

## Known issues

- First desktop click is required before mouse look works
- Some iOS browsers need a tap before audio starts
- Graphics are still simple compared with a console / App Store FPS
- Field Kit screen still exists in the file but New Campaign skips it

## Version / changelog

Open **UPDATE LOG** on the main menu. Current game version is **v1.5.0**.

Entries on the live log:

- 1.5.0 Toggle aim and seeded lane
- 1.4.1 Walls block fire
- 1.4.0 Narrow front
- 1.3.1 Mobile thumbs
- 1.3.0 Controls restored
- 1.2.0 Front repair
- 1.1.0 Battlefield expansion
- 1.0.0 Game creation

---

## TODO FOR YOU

Do these in order. Send files that you made or that you have the right to use. Put them in a folder and tell me the path, or attach them in chat.

### Must have (biggest visual jump)

- [ ] Ground texture pack: mud, wet mud, dirt road, grass, rubble (1024px PNG, tileable)
- [ ] Brick / plaster / concrete wall textures (1024px PNG, tileable)
- [ ] Wood / crate / sandbag textures
- [ ] One sky photo or painted sky (wide PNG, no logos)
- [ ] Smoke / dust particle sprites (transparent PNG)

### Soldiers and guns

- [ ] Player first-person arms + rifle (glTF `.glb`)
- [ ] Enemy soldier model, standing and firing poses (glTF `.glb`)
- [ ] Extra weapons if you want them: carbine, SMG, pistol, grenade (glTF `.glb`)
- [ ] Keep them original or properly licensed. No COD / Warzone / Battlefield rips.

### Map pieces

- [ ] Ruined house kit (walls, window, roof, rubble pile) as glTF
- [ ] Sandbag wall
- [ ] Wrecked truck or cart
- [ ] Trench boards
- [ ] Barbed wire or fence
- [ ] Distant city block (very low poly is fine)

### Audio (optional but huge for feel)

- [ ] Rifle shot, carbine shot, SMG burst (short WAV/OGG, original)
- [ ] Reload, footstep mud, explosion
- [ ] Distant artillery loop
- [ ] Short radio sting
- [ ] One low music bed under 1 minute, original

### UI

- [ ] Menu background still (landscape, 1920x1080 or similar)
- [ ] Crosshair PNG
- [ ] Simple rank / mission icons if you want them

### Rules for anything you send

- Original or clearly licensed. Write the licence next to the file.
- No copied COD Mobile, Warzone, film, or other game assets.
- Prefer `.glb` for 3D and `.png` / `.ogg` for the rest.
- Mobile-friendly: keep each model under about 20k triangles if you can.
- Name files clearly: `rifle.glb`, `mud_albedo.png`, `shot_rifle.ogg`.

### After you send files I will

- [ ] Swap boxes for your models
- [ ] Swap canvas paint for your textures
- [ ] Swap beep-gunfire for your audio
- [ ] Keep the same campaign, controls, save and missions
- [ ] Add a new Update Log version

### Not on you

- Code, missions, AI, HUD, save system, GitHub Pages — I handle those.
- I will not download paid asset stores or copyrighted game files for you.
