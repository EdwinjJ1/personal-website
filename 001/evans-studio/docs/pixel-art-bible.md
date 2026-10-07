# Evan Web Pixel Art Bible

## Visual Direction

Evan Web is a night-time pixel exploration map with a hillside cinema landmark mood. The center of the world is a massive original `E V A N W E B` sign, with warm spotlights, cyan monitor light, red broadcast markers, and dark city silhouettes. The map should feel like a small playable website-world, not a generic room or a flat landing page.

## Camera + Scale

- View: top-down with a slight isometric read, close to a premium Gather Town map.
- Tile size: 32px.
- Main character: roughly 2 tiles high.
- Large landmarks: readable at 50% zoom while still looking like map objects.
- Asset edges: hard pixel edges, no painterly blur, no 3D render lighting.

## Palette

- Night base: near-black charcoal, deep ink, muted asphalt.
- Hero light: warm cinema gold and amber.
- Tech light: cyan-blue monitor glow.
- Accent light: restrained red broadcast indicators.
- Avoid: beige rental-room palettes, muddy brown interiors, generic flat cartoon colors, purple-blue gradient dominance.

## Lighting

- Central sign uses sweeping spotlights and small dust/light particles.
- Studio area uses ultrawide monitor glow.
- Photography area uses softbox highlights and glass reflections from the dry cabinet.
- TV tower area uses cyan broadcast light and red aircraft-style beacons.
- Arcade area uses compact saturated light, but not a rainbow arcade floor.

## Asset Rules

- All generated assets must share the same tile density and top-down/slight-isometric angle.
- Characters, buildings, props, tiles, and UI frames must look like one coherent game.
- Generate isolated sprites on transparent backgrounds when the asset is not a tile.
- Tiles may be opaque and repeatable.
- Do not accept assets with photorealism, 3D render shading, watermarks, stray text, wrong perspective, or old-room/rental-room mood.

## Required Asset Count

At least 32 final GPT Image 2 images must be saved locally. Raw outputs go to `public/media/pixel/raw`. Runtime copies go to `sprites`, `tiles`, and `ui`.
