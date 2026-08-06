import type { Photo } from './photography';

type ImportedGroup = {
  category: Photo['category'];
  files: string;
  location: string;
  description: string;
};

// Imported from the NAS portfolio folder. The files are grouped by the visual
// subject so they flow through the existing category filter without adding a
// second, disconnected photography taxonomy.
const importedGroups: ImportedGroup[] = [
  {
    category: 'Night',
    files: 'P1051911-Enhanced-NR-2.jpg P1051911-Enhanced-NR-3.jpg P1051911-Enhanced-NR.jpg P4020093.jpg P4020096.jpg P4020099.jpg WEXF4629.jpg WEXF5011.jpg WEXF5032.jpg WEXF5040.jpg WEXF7508.jpg',
    location: 'Sydney',
    description: 'Night work shaped by stars, moonlight, city glow, and deliberate low-light portraiture.',
  },
  {
    category: 'Landscape',
    files: 'P1052056.jpg P1052072.jpg P1052081-2.jpg P1052081.jpg P1052082.jpg P1052204.jpg P1052240.jpg P1052508.jpg P1052519.jpg',
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
    files: 'P4020101.jpg WEXF5289.jpg WEXF5300.jpg WEXF5310.jpg WEXF5328.jpg WEXF5333.jpg WEXF5340.jpg WEXF5344.jpg WEXF5358.jpg WEXF5379.jpg WEXF5381.jpg WEXF5393.jpg WEXF5456.jpg WEXF5490.jpg s5m2-35.1.jpg s5m2-35.jpg WEXF7016.jpg WEXF5013.jpg WEXF5015.jpg WEXF5032-baby.jpg WEXF5044.jpg WEXF5045.jpg WEXF5051.jpg WEXF5055.jpg WEXF5112.jpg WEXF5118.jpg WEXF5120.jpg WEXF5129.jpg',
    location: 'Sydney',
    description: 'Portrait studies made outdoors and after dark, with attention to gesture, light, and environment.',
  },
  {
    category: 'Wildlife',
    files: 'P7180080.jpg P7180085.jpg P7180197.jpg P7180208.jpg P7180221.jpg P7180227.jpg P7180251.jpg WEXF7007.jpg WEXF7906.jpg WEXF7923.jpg WEXF7936.jpg WEXF7937.jpg WEXF7998.jpg WEXF8015.jpg WEXF8017.jpg WEXF8018.jpg WEXF8022.jpg WEXF8068.jpg WEXF8073.jpg WEXF8081-2.jpg WEXF8081.jpg WEXF8083.jpg',
    location: 'Sydney',
    description: 'Wildlife observations made patiently at the water, in the canopy, and across open grass.',
  },
  {
    category: 'Nature',
    files: 'WEXF5960.jpg WEXF5981.jpg WEXF5982.jpg WEXF5992.jpg WEXF5994.jpg WEXF5996.jpg WEXF7010.jpg WEXF7013-Enhanced-NR.jpg',
    location: 'Sydney',
    description: 'Botanical and small-scale nature studies, composed around colour, texture, and soft light.',
  },
  {
    category: 'Architecture',
    files: 'WEXF5978-2.jpg WEXF5980.jpg WEXF7028.jpg',
    location: 'Sydney',
    description: 'Urban forms, facades, and the geometry of the city.',
  },
  {
    category: 'Street',
    files: 'WEXF5979.jpg WEXF7044.jpg WEXF7055.jpg WEXF7068.jpg WEXF7074.jpg WEXF7370.jpg WEXF7372.jpg WEXF7373.jpg WEXF7383_(2).jpg WEXF7386.jpg WEXF7393.jpg WEXF7399.jpg WEXF7457.jpg WEXF7485.jpg WEXF7487.jpg WEXF7493.jpg WEXF7515.jpg WEXF7520.jpg WEXF7522.jpg WEXF7545.jpg WEXF7545_(2).jpg WEXF7566.jpg WEXF7573.jpg WEXF7576.jpg WEXF7591.jpg',
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

function titleFor(file: string): string {
  return `Archive study · ${file.replace(/\.[^.]+$/, '')}`;
}

export const importedPhotos: Photo[] = importedGroups.flatMap((group, groupIndex) =>
  group.files.split(' ').map((file, fileIndex) => ({
    id: 200 + groupIndex * 50 + fileIndex,
    title: titleFor(file),
    location: group.location,
    description: group.description,
    category: group.category,
    image: `/images/photography/${file}`,
    date: '2026',
    camera: 'Panasonic Lumix S5II / S9',
    settings: 'Imported portfolio selection',
  })),
);
