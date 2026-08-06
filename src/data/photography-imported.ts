import type { Photo } from './photography';

type ImportedGroup = {
  category: Photo['category'];
  files: string;
  location: string;
  description: string;
  series?: string;
  seriesOrder?: number;
  date?: string;
};

// Imported from the NAS portfolio folder. The files are grouped by the visual
// subject so they flow through the existing category filter without adding a
// second, disconnected photography taxonomy.
const importedGroups: ImportedGroup[] = [
  {
    category: 'Night',
    files: 'P1051911-Enhanced-NR-2.jpg P1051911-Enhanced-NR-3.jpg P1051911-Enhanced-NR.jpg WEXF4629.jpg WEXF5011.jpg WEXF5032.jpg WEXF5040.jpg',
    location: 'Sydney',
    description: 'Night work shaped by stars, moonlight, city glow, and deliberate low-light portraiture.',
    series: 'Night archive',
    seriesOrder: 2,
  },
  {
    category: 'Night',
    files: 'P4020093.jpg P4020096.jpg P4020099.jpg P4020101.jpg',
    location: 'Sydney',
    description: 'Moon studies returning the lunar frames to their intended night-time sequence.',
    series: 'Moon studies',
    seriesOrder: 1,
  },
  {
    category: 'Landscape',
    files: 'P1052056.jpg P1052072.jpg P1052081-2.jpg P1052081.jpg P1052082.jpg P1052204.jpg P1052240.jpg',
    location: 'Sydney Coast',
    description: 'Coastal studies of basalt, surf, and late light from the new works archive.',
  },
  {
    category: 'Travel',
    files: 'P1128961.jpg P1128962-Enhanced-NR.jpg P1129029.jpg P1143576.JPG P3141076.jpg P3210126.jpg P3210309-Enhanced-NR-2.jpg P3210316-Enhanced-NR.jpg P3210953.jpg P3211085.jpg WEXF5080.jpg',
    location: 'Sydney',
    description: 'Place-based photographs of aircraft, harbour landmarks, and the city in motion.',
  },
  {
    category: 'Portrait',
    files: 'WEXF5289.jpg WEXF5300.jpg WEXF5310.jpg WEXF5328.jpg WEXF5333.jpg WEXF5340.jpg WEXF5344.jpg WEXF5358.jpg WEXF5379.jpg WEXF5381.jpg WEXF5393.jpg WEXF5456.jpg WEXF5490.jpg s5m2-35.1.jpg s5m2-35.jpg WEXF7016.jpg WEXF5013.jpg WEXF5015.jpg WEXF5032-baby.jpg WEXF5044.jpg WEXF5045.jpg WEXF5051.jpg WEXF5055.jpg WEXF5112.jpg WEXF5118.jpg WEXF5120.jpg WEXF5129.jpg',
    location: 'Sydney',
    description: 'Portrait studies made outdoors and after dark, with attention to gesture, light, and environment.',
    series: 'Archive portrait studies',
    seriesOrder: 20,
  },
  {
    category: 'Portrait',
    files: 'portrait-jojo-darling-harbour.jpg portrait-jojo-stone-free.jpg portrait-jojo-golden-hour.jpg portrait-jojo-electric-motion.jpg',
    location: 'Sydney',
    description: 'A finished JoJo-inspired chapter combining cosplay, gesture, and graphic treatment.',
    series: 'JoJo — Chapter Two',
    seriesOrder: 1,
    date: '2026-07',
  },
  {
    category: 'Portrait',
    files: 'WEXF7370.jpg WEXF7372.jpg WEXF7373.jpg WEXF7383_(2).jpg WEXF7386.jpg',
    location: 'Sydney',
    description: 'Stone Free cosplay portraits made around Darling Harbour, from wide gestures to close character studies.',
    series: 'JoJo — Stone Free session',
    seriesOrder: 2,
  },
  {
    category: 'Portrait',
    files: 'WEXF7393.jpg WEXF7493.jpg WEXF7545.jpg WEXF7545_(2).jpg',
    location: 'Sydney',
    description: 'Paired and group portraits from the cosplay gathering, held together by gesture and shared presence.',
    series: 'Cosplay pairs and groups',
    seriesOrder: 3,
  },
  {
    category: 'Portrait',
    files: 'WEXF7399.jpg WEXF7485.jpg WEXF7487.jpg WEXF7576.jpg',
    location: 'Sydney',
    description: 'Individual character portraits using the harbour, grass, and open sky as a changing stage.',
    series: 'Character portrait studies',
    seriesOrder: 4,
  },
  {
    category: 'Portrait',
    files: 'WEXF7457.jpg WEXF7573.jpg',
    location: 'Sydney',
    description: 'Masked character studies shaped by warm costume colour and the city skyline.',
    series: 'Masked character studies',
    seriesOrder: 5,
  },
  {
    category: 'Portrait',
    files: 'WEXF7508.jpg WEXF7515.jpg WEXF7520.jpg WEXF7522.jpg WEXF7566.jpg WEXF7591.jpg',
    location: 'Sydney',
    description: 'A pink-haired character set moving from bright harbour portraits into a quieter close-up.',
    series: 'Pink-haired character study',
    seriesOrder: 6,
  },
  {
    category: 'Portrait',
    files: 'P1052388.jpg',
    location: 'Sydney',
    description: 'A woodland portrait framed by tall trunks, soft daylight, and a ribboned costume.',
    series: 'Woodland portrait',
    seriesOrder: 7,
  },
  {
    category: 'Portrait',
    files: 'WEXF5992.jpg WEXF5994.jpg WEXF5996.jpg',
    location: 'Sydney',
    description: 'Quiet park portraits built around a white dress, reflected water, and small changes in posture.',
    series: 'Pond reflection portrait',
    seriesOrder: 8,
  },
  {
    category: 'Wildlife',
    files: 'P7180080.jpg P7180085.jpg P7180197.jpg P7180208.jpg P7180221.jpg P7180227.jpg P7180251.jpg P1052508.jpg P1052519.jpg WEXF7007.jpg WEXF7906.jpg WEXF7923.jpg WEXF7936.jpg WEXF7937.jpg WEXF7998.jpg WEXF8015.jpg WEXF8017.jpg WEXF8018.jpg WEXF8022.jpg WEXF8081-2.jpg WEXF8081.jpg WEXF8083.jpg',
    location: 'Sydney',
    description: 'Wildlife observations made patiently at the water, in the canopy, and across open grass.',
  },
  {
    category: 'Nature',
    files: 'WEXF5960.jpg WEXF5981.jpg WEXF5982.jpg WEXF7010.jpg WEXF7013-Enhanced-NR.jpg WEXF8068.jpg WEXF8073.jpg',
    location: 'Sydney',
    description: 'Botanical and small-scale nature studies, composed around colour, texture, and soft light.',
  },
  {
    category: 'Architecture',
    files: 'P1034550.jpg WEXF5978-2.jpg WEXF5980.jpg WEXF7028.jpg',
    location: 'Sydney',
    description: 'Urban forms, facades, and the geometry of the city.',
  },
  {
    category: 'Street',
    files: 'WEXF5979.jpg WEXF7044.jpg WEXF7074.jpg',
    location: 'Sydney',
    description: 'Documentary frames from public spaces and event days, kept in the existing street category.',
  },
  {
    category: 'Landscape',
    files: 'WEXF5926.jpg WEXF5935.jpg WEXF5939.jpg WEXF5971.jpg',
    location: 'Sydney Coast',
    description: 'Additional landscape and city-edge studies from the archive.',
  },
];

const titleOverrides: Record<string, string> = {
  'P4020101.jpg': 'Lunar Study',
  'P1052388.jpg': 'Woodland Ribbon',
  'P1052508.jpg': 'Emerald Pigeon',
  'P1052519.jpg': 'Blue Bird, Soft Light',
  'P1034550.jpg': 'Danchen House',
  'WEXF5992.jpg': 'White Dress Reflection',
  'WEXF5994.jpg': 'Bending to the Water',
  'WEXF5996.jpg': 'Stillness by the Pond',
  'WEXF8068.jpg': 'Path Under the Trees',
  'WEXF8073.jpg': 'Golden Path',
  'portrait-jojo-darling-harbour.jpg': 'Stand at Darling Harbour',
  'portrait-jojo-stone-free.jpg': 'Stone Free by the Waterfront',
  'portrait-jojo-golden-hour.jpg': 'Golden Hour Stand',
  'portrait-jojo-electric-motion.jpg': 'Electric Motion',
  'WEXF7370.jpg': 'Hands Toward the Sun',
  'WEXF7372.jpg': 'Stone Free on the Rail',
  'WEXF7373.jpg': 'Low-Angle Stand',
  'WEXF7383_(2).jpg': 'The Reach',
  'WEXF7386.jpg': 'Electric Gesture',
  'WEXF7393.jpg': 'Cosplay at the Bridge',
  'WEXF7399.jpg': 'Blue Satin Portrait',
  'WEXF7457.jpg': 'Masked in Amber',
  'WEXF7485.jpg': 'Quiet Character Study',
  'WEXF7487.jpg': 'White and Violet',
  'WEXF7493.jpg': 'Three in the Harbour',
  'WEXF7508.jpg': 'A Step into Character',
  'WEXF7515.jpg': 'Pink Hair in Light',
  'WEXF7520.jpg': 'Pink Hair, City',
  'WEXF7522.jpg': 'Portrait Above the Harbour',
  'WEXF7545.jpg': 'Heart Sign',
  'WEXF7545_(2).jpg': 'Heart Sign — Second Frame',
  'WEXF7566.jpg': 'Pink Hair at Dusk',
  'WEXF7573.jpg': 'Amber Mask, City Light',
  'WEXF7576.jpg': 'Black and White Character',
  'WEXF7591.jpg': 'Close-up After the Show',
};

const categoryTitle: Record<string, string> = {
  Night: 'Night Study',
  Landscape: 'Coastal Light',
  Travel: 'Sydney Passage',
  Portrait: 'Portrait Study',
  Wildlife: 'Wildlife Study',
  Nature: 'Nature Study',
  Architecture: 'Urban Form',
  Street: 'Street Frame',
};

function titleFor(file: string, category: string): string {
  return titleOverrides[file] ?? `${categoryTitle[category] ?? 'Archive Study'} · ${file.replace(/\.[^.]+$/, '')}`;
}

export const importedPhotos: Photo[] = importedGroups.flatMap((group, groupIndex) =>
  group.files.split(' ').map((file, fileIndex) => ({
    id: 200 + groupIndex * 50 + fileIndex,
    title: titleFor(file, group.category),
    location: group.location,
    description: group.description,
    category: group.category,
    image: `/images/photography/${file}`,
    date: group.date ?? '2026',
    camera: 'Unknown — WeChat export',
    settings: 'EXIF unavailable',
    series: group.series,
    seriesOrder: group.seriesOrder,
  })),
);
