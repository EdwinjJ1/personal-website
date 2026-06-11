'use client';

/**
 * Hand-drawn pixel-art scene for the music card:
 * curly-haired guy with glasses + headphones coding on a sage sofa,
 * cowboy hat (from the site avatar) on the armrest, lamp, coffee steam.
 * Rendered as an SVG grid — crisp at any size, ~zero weight.
 */

const PALETTE: Record<string, string> = {
  H: '#2b2723', // hair dark
  h: '#4a4036', // hair highlight
  F: '#e6c39c', // skin
  f: '#c9a37e', // skin shadow
  G: '#e0d8cc', // glasses frame
  E: '#1b1816', // eyes
  W: '#d9d0c1', // sweater
  w: '#b3a995', // sweater shadow
  P: '#3a342e', // headphone band/cups
  p: '#7a9088', // headphone pads
  L: '#4a443c', // laptop body
  l: '#cfe0d5', // laptop screen glow
  g: '#9db8aa', // glow halo
  S: '#7a9088', // sofa
  s: '#5c7066', // sofa shadow
  C: '#8fa399', // cushion
  A: '#6b4e38', // hat
  a: '#513921', // hat shadow
  M: '#e0d8cc', // mug
  m: '#8a8680', // steam
  D: '#d9a05b', // lamp shade
  O: '#e7c08a', // lamp glow
  d: '#57504a', // lamp pole
  T: '#33302b', // floor shadow
};

// 44 x 24
const PIXELS = [
  '............................................',
  '...................PPPPP....................',
  '..................P.....P...............OO..',
  '.................hHHhHHhHh.............DDDD.',
  '................hHHHHHHHHHh............DDDD.',
  '................HHHHHHHHHHH.............d...',
  '...............PpHHFFFFFHHpP............d...',
  '...............PpGEGGGEGGGpP............d...',
  '...............PpFFfFFFfFFpP............d...',
  '.................FFFFfFFFF..............d...',
  '..........SSSSS.....fff.....SSSSS.AAA...d...',
  '..........SSSSS.WWWWWWWWWWW.SSSSS.AAA...d...',
  '..........SSSSSWWWWWWWWWWWWWSSSSaAAAAAa.d...',
  '......SSSSSSSSSWWgggggggggWWSSSSSSSSS...d...',
  '...m..SSSSSSSSSfLLLLLLLLLLLfSSSSSSSSS...d...',
  '..m...SSSSSSSSSLLLLLLpLLLLLLSSSSSSSSS...d...',
  '...m..SSSSSSSSSCHHHHHHHHHHHCSSSSSSSSS...d...',
  '......SSSSCCCCCCCCCCCCCCCCCCCCCCCSSSS...d...',
  '..MMM.SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS...d...',
  '..MMM.SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS...d...',
  '.......sssssssssssssssssssssssssss......d...',
  '........ss.......................ss....ddd..',
  '.....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..TTT..',
  '............................................',
];

const STEAM_CELLS = new Set(['m']);
const GLOW_CELLS = new Set(['l', 'g', 'O']);

export default function MusicPixelScene() {
  const rows = PIXELS.length;
  const cols = PIXELS[0].length;

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      <svg
        viewBox={`0 0 ${cols} ${rows}`}
        className="h-full w-auto max-w-full"
        style={{ shapeRendering: 'crispEdges' }}
        role="img"
        aria-label="Pixel-art illustration of Evan coding on a sofa with headphones on"
      >
        <style>{`
          @keyframes px-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
          @keyframes px-steam {
            0% { opacity: 0; transform: translateY(1px); }
            35% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-2px); }
          }
          .px-glow { animation: px-glow 2.4s ease-in-out infinite; }
          .px-steam { animation: px-steam 2.2s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .px-glow, .px-steam { animation: none; }
          }
        `}</style>
        {PIXELS.flatMap((row, y) =>
          Array.from(row).map((ch, x) => {
            const color = PALETTE[ch];
            if (!color) return null;
            const cls = STEAM_CELLS.has(ch)
              ? 'px-steam'
              : GLOW_CELLS.has(ch)
                ? 'px-glow'
                : undefined;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
                className={cls}
                style={
                  cls === 'px-steam'
                    ? { animationDelay: `${(y * 0.4 + x * 0.15) % 2}s` }
                    : undefined
                }
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
