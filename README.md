# BROKEN FRONT

**Version 1.0.0**

An original cinematic single-player WWII-inspired first-person shooter for landscape phones and desktop browsers. You are one ordinary soldier on a fictional front. There is no superhero, no mastermind villain, and no copied film scene.

Broken Front is a **fictional** project. It is not affiliated with, endorsed by, or adapted from any film, studio, publisher, or commercial game.

Repository: https://github.com/PopcornParty/BrokenFront

GitHub Pages (enable Pages once in Settings): https://popcornparty.github.io/BrokenFront/

## Description

A company column breaks on the approach to Grey River. Friends disappear into smoke. You wake in the mud and work seven missions across fields, trenches, ruined streets, and concrete works until the signal house is taken.

The campaign is linear, about 30-60 minutes, and runs as a static website with no account and no backend.

## Features

- 7-mission linear campaign with automatic checkpoints
- Easy / Normal / Hard
- Mobile landscape touch controls
- Desktop WASD + mouse for testing
- Rifle, carbine, SMG, grenades, medkits
- Health regeneration plus dressings
- Enemy patrol, cover, fire, flank, retreat
- Distant smoke and background movement
- Procedural audio
- Settings and localStorage save
- GitHub Pages static deploy

## Screenshots

Add captures after the first play session:

- `docs/screenshots/menu.png`
- `docs/screenshots/mission01.png`
- `docs/screenshots/town.png`

## How to play

1. Open the site on a phone in landscape, or on a desktop browser.
2. Start a New Campaign or Continue.
3. Follow the objective bar.

### Mobile controls

Left joystick move. Right zone look. FIRE, AIM, R reload, G grenade, jump, crouch, USE, pause.

### Desktop controls

WASD move. Mouse look (click canvas). Left fire. Right aim. R reload. G grenade. E interact. Space jump. C crouch. Shift sprint. Esc pause.

## Installation / local testing

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

## GitHub Pages

Settings -> Pages. Use GitHub Actions (`.github/workflows/pages.yml`) or deploy `main` from `/` root. See `docs/DEPLOY.md`.

If the first Actions deploy fails, enable Pages in Settings and re-run the workflow.

## Performance

Low-poly geometry, canvas textures, few live enemies, mission-based load. Use Graphics Low on older phones.

## Project structure

index.html, css/, js/, assets/ui/, docs/, .github/workflows/pages.yml

## Credits

Original game code, campaign, UI, procedural art and audio. Rendering via Three.js (MIT) from jsDelivr.

## Asset licences

Procedural maps and textures: original MIT with this repo. Audio: original Web Audio. Three.js: MIT.

## Known issues

Pointer lock needs a click on desktop. iOS may need a tap before audio. Pages must be enabled once.

## Roadmap

Offline cache. Extra ambient events.

## Disclaimer

Original fiction on an invented front (Grey River / Krenfeld). Not an adaptation of any film or game. Combat is non-graphic.

## Version

1.0.0 — playable campaign release
