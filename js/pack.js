import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

export const pack = { ready: false, tex: {}, models: {}, urls: {} };

const FILES = {
  mud: 'ww2_asset_pack/textures/ground/mud_albedo.png',
  dirt: 'ww2_asset_pack/textures/ground/dirt_road_albedo.png',
  grass: 'ww2_asset_pack/textures/ground/grass_albedo.png',
  rubble: 'ww2_asset_pack/textures/ground/rubble_albedo.png',
  wet: 'ww2_asset_pack/textures/ground/wet_mud_albedo.png',
  brick: 'ww2_asset_pack/textures/walls/brick_albedo.png',
  plaster: 'ww2_asset_pack/textures/walls/plaster_albedo.png',
  concrete: 'ww2_asset_pack/textures/walls/concrete_albedo.png',
  wood: 'ww2_asset_pack/textures/wood/wood_albedo.png',
  crate: 'ww2_asset_pack/textures/wood/crate_albedo.png',
  sandbag: 'ww2_asset_pack/textures/wood/sandbag_albedo.png',
  sky: 'ww2_asset_pack/textures/sky/sky_original.png',
  smoke: 'ww2_asset_pack/particles/smoke.png',
  smokeDark: 'ww2_asset_pack/particles/smoke_dark.png',
  dust: 'ww2_asset_pack/particles/dust.png',
  menu: 'ww2_asset_pack/ui/menu_background.png',
  crosshair: 'ww2_asset_pack/ui/crosshair.png'
};

const MODELS = {
  rifle: 'ww2_asset_pack/models/rifle.glb',
  soldier: 'ww2_asset_pack/models/enemy_soldier.glb',
  house: 'ww2_asset_pack/map/ruined_house_walls.glb',
  sandbagWall: 'ww2_asset_pack/map/sandbag_wall.glb',
  boards: 'ww2_asset_pack/map/trench_boards.glb',
  cart: 'ww2_asset_pack/map/wrecked_cart.glb'
};

function texFromBlob(blob, repeatX = 8, repeatY = 8, clamp = false) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const t = new THREE.Texture(img);
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      if (clamp) {
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        t.repeat.set(1, 1);
      } else {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(repeatX, repeatY);
      }
      t.anisotropy = 4;
      resolve(t);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function loadPack(onProg) {
  try {
    const zipMod = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
    const JSZip = zipMod.default || zipMod;
    if (onProg) onProg(0.12);
    const res = await fetch('ww2_asset_pack.zip');
    if (!res.ok) throw new Error('pack http ' + res.status);
    const zip = await JSZip.loadAsync(await res.arrayBuffer());
    if (onProg) onProg(0.4);
    const loader = new GLTFLoader();
    for (const [k, path] of Object.entries(FILES)) {
      const f = zip.file(path);
      if (!f) continue;
      const blob = await f.async('blob');
      if (k === 'menu' || k === 'crosshair') {
        pack.urls[k] = URL.createObjectURL(blob);
        continue;
      }
      const clamp = k === 'sky' || k === 'smoke' || k === 'smokeDark' || k === 'dust';
      const rx = k === 'mud' || k === 'dirt' || k === 'wet' ? 14 : 8;
      pack.tex[k] = await texFromBlob(blob, rx, k === 'mud' ? 18 : rx, clamp);
    }
    if (onProg) onProg(0.72);
    for (const [k, path] of Object.entries(MODELS)) {
      const f = zip.file(path);
      if (!f) continue;
      const buf = await f.async('arraybuffer');
      pack.models[k] = await new Promise((resolve) => {
        loader.parse(buf, '', (gltf) => resolve(gltf.scene), () => resolve(null));
      });
    }
    pack.ready = true;
    if (onProg) onProg(1);
  } catch (err) {
    console.warn('Asset pack failed, using built-in art', err);
    pack.ready = false;
    if (onProg) onProg(1);
  }
  return pack;
}

export function cloneModel(name, scale = 1) {
  const src = pack.models[name];
  if (!src) return null;
  const g = src.clone(true);
  g.scale.setScalar(scale);
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
  return g;
}

export function applyPackUI() {
  if (pack.urls.menu) {
    const menu = document.getElementById('menu-screen');
    if (menu) {
      menu.style.backgroundImage = `linear-gradient(180deg, rgba(8,7,5,.45), rgba(8,7,5,.72)), url(${pack.urls.menu})`;
      menu.style.backgroundSize = 'cover';
      menu.style.backgroundPosition = 'center';
    }
  }
  if (pack.urls.crosshair) {
    const el = document.getElementById('crosshair');
    if (el) {
      el.textContent = '';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.background = `center / contain no-repeat url(${pack.urls.crosshair})`;
    }
  }
}
