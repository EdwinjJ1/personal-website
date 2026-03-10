export interface Photo {
  id: number;
  title: string;
  location: string;
  description: string;
  category: string;
  image: string;
  date: string;
  camera: string;
  settings: string;
}

export const photos: Photo[] = [
  {
    id: 1,
    title: 'Ephemeral Stasis',
    location: 'Sydney',
    description: 'A fleeting fraction of a second, arrested in motion. The city holds its breath in the space between heartbeats.',
    category: 'Street',
    image: '/images/photography/P1032761.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '75mm • f/2.2 • 1/8000s • ISO 5000'
  },
  {
    id: 2,
    title: 'Concrete Poetry',
    location: 'Sydney',
    description: 'The unspoken verses of urban life, written in light, shadow, and the texture of the street.',
    category: 'Street',
    image: '/images/photography/P1032762.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '75mm • f/2.2 • 1/8000s • ISO 5000'
  },
  {
    id: 3,
    title: 'Arterial Rhythm',
    location: 'Sydney',
    description: 'The pulse of the metropolis, flowing through the veins of asphalt and steel.',
    category: 'Street',
    image: '/images/photography/P1032763.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '75mm • f/2.2 • 1/6400s • ISO 5000'
  },
  {
    id: 4,
    title: 'Vesper’s Gaze',
    location: 'Sydney',
    description: 'Captured in the soft, dying light of evening. A moment of quiet introspection amidst the chaos.',
    category: 'Portrait',
    image: '/images/photography/P1032794.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '75mm • f/2.0 • 1/250s • ISO 1000'
  },
  {
    id: 5,
    title: 'Analog Soul',
    location: 'Sydney',
    description: 'Through the glass of a vintage lens, the modern world softens into nostalgia.',
    category: 'Street',
    image: '/images/photography/P1033357.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '50mm • Manual Lens • 1/20s • ISO 640'
  },
  {
    id: 6,
    title: 'Nocturne in Neon',
    location: 'Sydney',
    description: 'The city sings a different song after dark. A visual melody composed of artificial light and deep shadows.',
    category: 'Night',
    image: '/images/photography/P1033361.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '50mm • Manual Lens • 1/13s • ISO 640'
  },
  {
    id: 7,
    title: 'Monoliths',
    location: 'Sydney Architecture',
    description: 'Silent giants rising against the sky. A study of permanence and scale.',
    category: 'Architecture',
    image: '/images/photography/P1033380.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '20mm • f/4.0 • 1/1000s • ISO 640'
  },
  {
    id: 8,
    title: 'Euclidean Echoes',
    location: 'Sydney',
    description: 'Where mathematics meets concrete. Exploring the purity of lines, angles, and negative space.',
    category: 'Architecture',
    image: '/images/photography/P1033392.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '20mm • f/4.0 • 1/1000s • ISO 640'
  },
  {
    id: 9,
    title: 'Fragmented Narrative',
    location: 'Sydney',
    description: 'A story told in pieces. Isolating a single detail to suggest the whole.',
    category: 'Street',
    image: '/images/photography/P1033437.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '103mm • f/6.2 • 1/13s • ISO 640'
  },
  {
    id: 10,
    title: 'Distant Strata',
    location: 'Sydney',
    description: 'Layers of the landscape compressed into a single plane, revealing the geology of the view.',
    category: 'Landscape',
    image: '/images/photography/P1033598.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '200mm • f/6.3 • 1/4000s • ISO 640'
  },
  {
    id: 11,
    title: 'Azure Horizon',
    location: 'Sydney Coast',
    description: 'The infinite line where the ocean meets the sky. A meditation on vastness.',
    category: 'Landscape',
    image: '/images/photography/P1033646.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '21mm • f/6.3 • 1/3200s • ISO 640'
  },
  {
    id: 12,
    title: 'Metropolis',
    location: 'Sydney CBD',
    description: 'The human hive in its natural state. A classic perspective on urban existence.',
    category: 'Street',
    image: '/images/photography/P1034905.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '43mm • f/5.1 • 1/2000s • ISO 640'
  },
  {
    id: 13,
    title: 'Urban Strata',
    location: 'Sydney',
    description: 'The city compressed. Foreground and background merge into a tapestry of modern life.',
    category: 'Landscape',
    image: '/images/photography/P1034935.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '200mm • f/6.3 • 1/1600s • ISO 400'
  },
  {
    id: 14,
    title: 'Chiaroscuro Mood',
    location: 'Sydney',
    description: 'Emerging from the shadows. A portrait defined as much by what is hidden as what is seen.',
    category: 'Portrait',
    image: '/images/photography/P1034944.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '64mm • f/5.6 • 1/80s • ISO 2000'
  },
  {
    id: 15,
    title: 'The Silent Observer',
    location: 'Sydney',
    description: 'Watching from a distance, unseen and unheard. The privilege of the telephoto lens.',
    category: 'Nature',
    image: '/images/photography/P1035358.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '400mm • f/6.3 • 1/1600s • ISO 640'
  },
  {
    id: 16,
    title: 'Persona',
    location: 'Sydney',
    description: 'The face we show the world. A study of character and identity.',
    category: 'Portrait',
    image: '/images/photography/P1035420.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '100mm • f/5.9 • 1/400s • ISO 640'
  },
  {
    id: 17,
    title: 'Equilibrium',
    location: 'Sydney',
    description: 'Balance in all things. The 40mm perspective offers a view that feels calm, natural, and true.',
    category: 'Street',
    image: '/images/photography/P1035455.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '40mm • f/2.0 • 1/3200s • ISO 100'
  },
  {
    id: 18,
    title: 'Lucidity',
    location: 'Sydney',
    description: 'A moment of absolute clarity. Sharp, clean, and undeniable reality.',
    category: 'Street',
    image: '/images/photography/P1035457.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '40mm • f/2.0 • 1/125s • ISO 100'
  },
  {
    id: 19,
    title: 'Verity',
    location: 'Sydney',
    description: 'Truth in photography. No posing, no pretense, just the raw honesty of the moment.',
    category: 'Portrait',
    image: '/images/photography/P1035469.JPG',
    date: '2024-12',
    camera: 'Panasonic Lumix S9',
    settings: '40mm • f/2.0 • 1/6400s • ISO 100'
  },
  {
    id: 20,
    title: 'Asphalt Haze',
    location: 'Sydney',
    description: 'A study of urban layers through the compressed gaze of a 135mm lens.',
    category: 'Street',
    image: '/images/photography/DSCF9124.jpg',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/500s • ISO 400'
  },
  {
    id: 21,
    title: 'Ghost in the Glass',
    location: 'Sydney',
    description: 'The spectral rendering of vintage optics meeting modern resolution.',
    category: 'Portrait',
    image: '/images/photography/DSCF9138.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/250s • ISO 800'
  },
  {
    id: 22,
    title: 'Airy Dimension',
    location: 'Sydney',
    description: 'Exploring the profound depth that only medium format can carve from the air.',
    category: 'Portrait',
    image: '/images/photography/DSCF9146.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/1000s • ISO 200'
  },
  {
    id: 23,
    title: 'Isolated Pulse',
    location: 'Sydney',
    description: 'Finding the heartbeat of the city in a single, tight frame.',
    category: 'Street',
    image: '/images/photography/DSCF9148.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/400s • ISO 400'
  },
  {
    id: 24,
    title: 'Amber & Steel',
    location: 'Sydney',
    description: 'The unique color palette of a forgotten era, reborn in high fidelity.',
    category: 'Landscape',
    image: '/images/photography/DSCF9156.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/800s • ISO 100'
  },
  {
    id: 25,
    title: 'Analog Echo',
    location: 'Sydney',
    description: 'A visual resonance between the past\'s imperfections and today\'s precision.',
    category: 'Portrait',
    image: '/images/photography/DSCF9161.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/125s • ISO 1600'
  },
  {
    id: 26,
    title: 'Ethereal Precision',
    location: 'Sydney',
    description: 'Every detail preserved by the massive sensor and the surgical precision of the lens.',
    category: 'Architecture',
    image: '/images/photography/DSCF9162.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/2000s • ISO 400'
  },
  {
    id: 27,
    title: 'Vesper Sonata',
    location: 'Sydney',
    description: 'A melody of light and blur, where the background becomes the story.',
    category: 'Nature',
    image: '/images/photography/DSCF9170.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/500s • ISO 200'
  },
  {
    id: 28,
    title: 'Layered Silence',
    location: 'Sydney',
    description: 'Flattening the distance between the viewer and the distant architecture.',
    category: 'Street',
    image: '/images/photography/DSCF9172.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/640s • ISO 400'
  },
  {
    id: 29,
    title: 'Manual Sincerity',
    location: 'Sydney',
    description: 'The honest connection between the photographer\'s hand and the shifting focus.',
    category: 'Street',
    image: '/images/photography/DSCF9183.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/1000s • ISO 200'
  },
  {
    id: 30,
    title: 'Memory Rendering',
    location: 'Sydney',
    description: 'A rendering so lifelike it feels like a memory rather than a capture.',
    category: 'Portrait',
    image: '/images/photography/DSCF9186.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/250s • ISO 800'
  },
  {
    id: 31,
    title: 'Gilded Clarity',
    location: 'Sydney',
    description: 'The unique glow and sharp focus that only vintage Takumar lenses provide.',
    category: 'Street',
    image: '/images/photography/DSCF9187.JPG',
    date: '2026-03-10',
    camera: 'Fujifilm GFX 50R',
    settings: '135mm • Takumar f/3.5 • 1/400s • ISO 400'
  }
];

export const categories = ['All', 'Landscape', 'Architecture', 'Street', 'Portrait', 'Night', 'Nature'];
