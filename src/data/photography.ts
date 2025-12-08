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
  }
];

export const categories = ['All', 'Landscape', 'Architecture', 'Street', 'Portrait', 'Night', 'Nature'];
