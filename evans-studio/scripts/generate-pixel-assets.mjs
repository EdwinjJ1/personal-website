import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const apiKey = process.env.OPENAI_API_KEY;
const root = process.cwd();
const rawDir = path.join(root, "public/media/pixel/raw");
const spriteDir = path.join(root, "public/media/pixel/sprites");
const tileDir = path.join(root, "public/media/pixel/tiles");
const uiDir = path.join(root, "public/media/pixel/ui");
const manifestPath = path.join(root, "public/media/pixel/assets-manifest.json");

const sharedStyle = [
  "Create original cohesive 2D pixel art for a playable portfolio map called Evan Web.",
  "Style: premium night-time top-down / slight isometric pixel game, 32px tile density, crisp hard pixel edges.",
  "Palette: charcoal night, warm cinema gold, cyan monitor light, restrained red broadcast beacons.",
  "The asset must feel made for the same map as a central hillside sign reading EVAN WEB.",
  "No photorealism, no 3D render, no low-resolution rental room interior, no generic flat cartoon vector illustration, no SVG look, no blur, no watermark, no extra text unless explicitly requested.",
].join(" ");

const assets = [
  asset("01-evan-walk-sheet", "sprites", "transparent", "A 4x4 sprite sheet of Evan, a modern creator character in dark jacket with warm gold accent, four-direction walking animation frames, each frame centered in a 256px cell, transparent background."),
  asset("02-evan-idle-sheet", "sprites", "transparent", "A 4x4 sprite sheet of Evan idle poses, same character as walk sheet, neutral confident stance, four directions, centered in 256px cells, transparent background."),
  asset("03-evan-interact-sheet", "sprites", "transparent", "A 4x4 sprite sheet of Evan interaction poses: pressing terminal, opening cabinet, pointing to sign, holding camera, same outfit, transparent background."),
  asset("04-evan-sit-sheet", "sprites", "transparent", "A 4x4 sprite sheet of Evan sitting at a studio chair and desk terminal, same character, top-down slight isometric, transparent background."),
  asset("05-visitor-npc", "sprites", "transparent", "Single visitor NPC sprite, standing, top-down slight isometric pixel art, dark night-map palette with tiny cyan name-tag glow, transparent background."),
  asset("06-photographer-npc", "sprites", "transparent", "Single photographer NPC sprite with camera strap and small softbox glow, top-down slight isometric pixel art, transparent background."),
  asset("07-engineer-npc", "sprites", "transparent", "Single engineer NPC sprite with compact laptop and cyan monitor glow, top-down slight isometric pixel art, transparent background."),
  asset("08-arcade-npc", "sprites", "transparent", "Single arcade host NPC sprite with red accent jacket and game controller, top-down slight isometric pixel art, transparent background."),
  asset("09-evan-web-sign", "sprites", "transparent", "Large hillside landmark sign spelling exactly E V A N  W E B in big separate white-gold letters, original cinema hillside tribute, with pixel spotlights and dark mountain base, transparent background."),
  asset("10-studio-building", "sprites", "transparent", "Right-top studio building exterior for Evan Studio, glass wall, warm interior, visible ultrawide monitor glow, premium creator studio, top-down slight isometric pixel art, transparent background."),
  asset("11-photo-studio-building", "sprites", "transparent", "Left-top photography studio exterior, glass door, softbox glow, small camera sign, premium night map building, top-down slight isometric pixel art, transparent background."),
  asset("12-arcade-game-zone", "sprites", "transparent", "Lower-left compact interactive game zone building, small arcade entrance, dark metal, restrained red and gold lights, top-down slight isometric pixel art, transparent background."),
  asset("13-tv-tower", "sprites", "transparent", "Lower-right TV broadcast tower landmark with nearby platform, cyan broadcast glow and red beacon lights, top-down slight isometric pixel art, transparent background."),
  asset("14-city-building-a", "sprites", "transparent", "Expandable night city building block A, dark glass, cyan windows, compatible with TV tower district, top-down slight isometric pixel art, transparent background."),
  asset("15-city-building-b", "sprites", "transparent", "Expandable night city building block B, taller dark tower, warm gold window strips, top-down slight isometric pixel art, transparent background."),
  asset("16-city-building-c", "sprites", "transparent", "Expandable night city building block C, low rooftop antenna building, cyan and red details, top-down slight isometric pixel art, transparent background."),
  asset("17-ultrawide-desk", "sprites", "transparent", "Studio interior prop: desk with ultrawide curved monitor, keyboard, chair, cyan monitor light, premium creator setup, top-down slight isometric pixel art, transparent background."),
  asset("18-dry-cabinet", "sprites", "transparent", "Photography prop: glass dry cabinet with camera bodies and lenses, subtle reflections, warm shelf light, top-down slight isometric pixel art, transparent background."),
  asset("19-lens-cabinet", "sprites", "transparent", "Photography prop: compact lens cabinet with labeled shelves, camera accessories, gold/cyan night palette, top-down slight isometric pixel art, transparent background."),
  asset("20-photo-wall", "sprites", "transparent", "Photography prop: gallery wall with framed photo prints and target board, no readable text, warm gallery light, top-down slight isometric pixel art, transparent background."),
  asset("21-newspaper-stack", "sprites", "transparent", "News prop: stacked newspapers and small glowing tablet, no readable text, dark gold and cyan night palette, top-down slight isometric pixel art, transparent background."),
  asset("22-openclaw-broadcast-desk", "sprites", "transparent", "Broadcast prop: OpenClaw news desk with small TV control panels, cyan glow, red beacon detail, no readable text, top-down slight isometric pixel art, transparent background."),
  asset("23-arcade-machine", "sprites", "transparent", "Mini game prop: compact arcade cabinet with red/gold/cyan screen glow, top-down slight isometric pixel art, transparent background."),
  asset("24-map-signpost", "sprites", "transparent", "Map prop: small illuminated signpost pointing to studio, photo lab, game zone, and tower, symbolic arrows only, top-down slight isometric pixel art, transparent background."),
  asset("25-night-road-tiles", "tiles", "opaque", "Seamless 1024x1024 pixel tileset texture for night asphalt paths and plaza floor, 32px tile grid feel, charcoal base with subtle gold edge highlights, no text."),
  asset("26-mountain-boundary-tiles", "tiles", "opaque", "Seamless 1024x1024 pixel tileset texture for dark hillside, rocky boundary, and sign base terrain, night palette with warm spotlight falloff, no text."),
  asset("27-grass-border-tiles", "tiles", "opaque", "Seamless 1024x1024 pixel tileset texture for dark grass borders and map edges, small gold light specks, top-down pixel map style, no text."),
  asset("28-interior-floor-tiles", "tiles", "opaque", "Seamless 1024x1024 pixel tileset texture for premium studio interior floor, dark walnut and metal panels with cyan monitor reflections, no text."),
  asset("29-light-shadow-overlay", "tiles", "transparent", "Transparent 1024x1024 pixel-art light and shadow overlay texture: warm spotlights, cyan glows, soft vignette, no objects, no text."),
  asset("30-pixel-modal-frame", "ui", "transparent", "Pixel UI modal frame for Evan Web panels, black glass center, gold border, cyan corner light, no text, transparent background."),
  asset("31-interaction-prompt-frame", "ui", "transparent", "Pixel UI interaction prompt frame, compact black translucent center, gold border, cyan highlight, no text, transparent background."),
  asset("32-area-nameplate-hud", "ui", "transparent", "Pixel UI area nameplate HUD frame, dark premium game interface, gold and cyan trim, no text, transparent background."),
  asset("33-beijing-landmarks-thumbnail", "sprites", "transparent", "Single compact Beijing city identity thumbnail sprite for the OpenClaw Tower corner: Forbidden City palace roof and gate, Great Wall ridge line, and CCTV Headquarters silhouette together as one cohesive miniature district. Top-down slight isometric pixel game asset, transparent background, no readable text, no vector icon shapes, no flat cartoon, no realism, no 3D render."),
  asset("34-sydney-harbour-thumbnail", "sprites", "transparent", "Single compact Sydney harbour city identity thumbnail sprite for the OpenClaw Tower corner: Sydney Opera House shells, Circular Quay ferry wharf, small ferry, harbour promenade, dark blue water edge with cyan reflections. Top-down slight isometric pixel game asset, transparent background, no readable text, no vector icon shapes, no flat cartoon, no realism, no 3D render."),
  asset("35-sydney-sea-edge", "sprites", "transparent", "Right-edge sea scene sprite for a night pixel map: dark Sydney harbour water, pier edges, ferry wake lines, cyan reflections, small dock lights, designed to sit at the far right border of the map. Top-down slight isometric pixel game asset, transparent background, no readable text, no vector icon shapes, no flat cartoon, no realism, no 3D render."),
  asset("37-beijing-broadcast-district", "sprites", "transparent", "Single cohesive Beijing broadcast district sprite for the OpenClaw Tower corner. Upper section: Great Wall on dark mountain ridges, but the Great Wall path must terminate at and visually connect into a lower fortified city wall, not directly into Tiananmen. Middle/lower section: a rectangular enclosing city wall wraps around Tiananmen Gate inside the wall, with red walls, golden roof tiles, warm lanterns, wet stone plaza, and ceremonial paving. To the right of Tiananmen, with clear breathing distance and a shared plaza/road connection, include the iconic CCTV Headquarters 'big pants' loop building silhouette, dark glass with cyan window glow. Near the CCTV building include a separate slim TV broadcast tower with red beacons and cyan signal lights. The whole asset should read as one continuous mini district, with shared paving, wall geometry, lighting, and perspective. Top-down slight isometric pixel game asset, transparent background, no readable text, no vector icon shapes, no flat cartoon, no realism, no 3D render."),
];

function asset(id, kind, background, prompt) {
  return {
    id,
    kind,
    background,
    filename: `${id}.png`,
    prompt: `${sharedStyle} ${prompt}`,
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : assets.length;
  const onlyIndex = args.indexOf("--only");
  const only = onlyIndex >= 0 ? args[onlyIndex + 1] : "";
  return { force, limit: Number.isFinite(limit) ? limit : assets.length, only };
}

async function ensureDirs() {
  await Promise.all([rawDir, spriteDir, tileDir, uiDir].map((dir) => mkdir(dir, { recursive: true })));
}

function runtimeDirFor(kind) {
  if (kind === "tiles") return tileDir;
  if (kind === "ui") return uiDir;
  return spriteDir;
}

async function generateOne(item, force) {
  const rawPath = path.join(rawDir, item.filename);
  const runtimePath = path.join(runtimeDirFor(item.kind), item.filename);

  if (!force && existsSync(rawPath) && existsSync(runtimePath)) {
    console.log(`skip ${item.id}`);
    return { ...item, raw: publicPath(rawPath), runtime: publicPath(runtimePath), skipped: true };
  }

  const body = {
    model,
    prompt: item.prompt,
    n: 1,
    size: "1024x1024",
    quality: "medium",
    output_format: "png",
    background: item.background,
  };

  const json = await requestImage(body, item.id);
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`No b64_json returned for ${item.id}: ${JSON.stringify(json).slice(0, 500)}`);
  }

  const buffer = Buffer.from(b64, "base64");
  await writeFile(rawPath, buffer);
  await writeFile(runtimePath, buffer);
  console.log(`generated ${item.id}`);
  return { ...item, raw: publicPath(rawPath), runtime: publicPath(runtimePath), skipped: false };
}

async function requestImage(body, id) {
  let attempt = 0;
  while (attempt < 4) {
    attempt += 1;
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (response.ok) {
      return json;
    }

    const retryAfter = Number(response.headers.get("retry-after") || 0);
    if ((response.status === 429 || response.status >= 500) && attempt < 4) {
      const waitMs = Math.max(retryAfter * 1000, 15000 * attempt);
      console.warn(`retry ${id} after ${waitMs}ms: ${response.status}`);
      await sleep(waitMs);
      continue;
    }

    throw new Error(`Image generation failed for ${id}: ${response.status} ${JSON.stringify(json).slice(0, 900)}`);
  }
}

async function writeManifest(results) {
  let previous = [];
  if (existsSync(manifestPath)) {
    previous = JSON.parse(await readFile(manifestPath, "utf8"));
  }
  const byId = new Map(previous.map((item) => [item.id, item]));
  results.forEach((item) => byId.set(item.id, item));
  await writeFile(manifestPath, JSON.stringify([...byId.values()].sort((a, b) => a.id.localeCompare(b.id)), null, 2));
}

function publicPath(filePath) {
  return filePath.replace(path.join(root, "public"), "").split(path.sep).join("/");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to generate GPT Image 2 assets.");
  }

  const { force, limit, only } = parseArgs();
  await ensureDirs();
  const selected = only ? assets.filter((item) => item.id === only || item.filename === only) : assets.slice(0, limit);
  if (selected.length === 0) {
    throw new Error(`No asset matched --only ${only}`);
  }
  const results = [];

  for (const item of selected) {
    results.push(await generateOne(item, force));
    await writeManifest(results);
  }

  console.log(`done ${results.length}/${assets.length} assets with ${model}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
