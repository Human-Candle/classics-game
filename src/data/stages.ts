export interface StageColorPalette {
  grass: number;
  grassAlt: number;
  path: number;
  water: number;
  forest: number;
  forestTop: number;
}

export interface StageMapConfig {
  stage: number;
  name: string;
  eraRange: string;
  width: number;
  height: number;
  colors: StageColorPalette;
  spawnPoint: { x: number; y: number };
  characterIds: string[];
  locationIds: string[];
  locationPositions: Record<string, { x: number; y: number }>;
  grottoPosition: { x: number; y: number };
  shopPositions: { x: number; y: number; type: string; name: string }[];
  waterFeatures: { cx: number; cy: number; w: number; h: number }[];
  forestFeatures: { cx: number; cy: number; w: number; h: number }[];
  paths: [number, number, number, number][];
}

export const stages: StageMapConfig[] = [
  // Stage 1: Ancient World -- small, warm sandy tones
  {
    stage: 1,
    name: 'Ancient World',
    eraRange: '800 BC – 100 AD',
    width: 30,
    height: 25,
    characterIds: ['homer', 'sappho', 'virgil'],
    colors: {
      grass: 0xc4a060,
      grassAlt: 0xb89850,
      path: 0xe0cc8a,
      water: 0x3b7a9e,
      forest: 0x6b8a3a,
      forestTop: 0x4a6a2a,
    },
    spawnPoint: { x: 5, y: 5 },
    locationIds: ['library-of-alexandria'],
    locationPositions: { 'library-of-alexandria': { x: 20, y: 10 } },
    grottoPosition: { x: 12, y: 17 },
    shopPositions: [
      { x: 3, y: 12, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 8, y: 12, type: 'apothecary', name: 'The Apothecary' },
      { x: 13, y: 12, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [{ cx: 15, cy: 18, w: 3, h: 2 }],
    forestFeatures: [
      { cx: 22, cy: 4, w: 4, h: 3 },
      { cx: 3, cy: 18, w: 3, h: 3 },
    ],
    paths: [
      [5, 5, 20, 10],     // spawn to library
      [5, 5, 3, 12],      // spawn to shops
      [3, 12, 13, 12],    // shop row
      [20, 10, 13, 12],   // library to shops area
    ],
  },

  // Stage 2: The Dark Ages -- dark greens, stone grays
  {
    stage: 2,
    name: 'The Medieval World',
    eraRange: '1250 – 1400',
    width: 40,
    height: 30,
    characterIds: ['dante-alighieri', 'giotto-di-bondone', 'geoffrey-chaucer', 'christine-de-pizan'],
    colors: {
      grass: 0x2d5a2d,
      grassAlt: 0x264d26,
      path: 0x8a7a5a,
      water: 0x2a5a7a,
      forest: 0x1a4a1a,
      forestTop: 0x0e350e,
    },
    spawnPoint: { x: 5, y: 5 },
    locationIds: ['monte-cassino'],
    locationPositions: { 'monte-cassino': { x: 28, y: 12 } },
    grottoPosition: { x: 18, y: 22 },
    shopPositions: [
      { x: 3, y: 14, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 9, y: 14, type: 'apothecary', name: 'The Apothecary' },
      { x: 15, y: 14, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 20, cy: 22, w: 3, h: 2 },
      { cx: 33, cy: 8, w: 2, h: 2 },
    ],
    forestFeatures: [
      { cx: 10, cy: 3, w: 5, h: 4 },
      { cx: 30, cy: 20, w: 4, h: 4 },
      { cx: 4, cy: 22, w: 3, h: 3 },
    ],
    paths: [
      [5, 5, 28, 12],     // spawn to monastery
      [5, 5, 3, 14],      // spawn to shops
      [3, 14, 15, 14],    // shop row
      [28, 12, 15, 14],   // monastery to shops
    ],
  },

  // Stage 3: Renaissance -- rich terracotta and gold
  {
    stage: 3,
    name: 'Renaissance',
    eraRange: '1440 – 1520',
    width: 50,
    height: 35,
    characterIds: ['sandro-botticelli', 'leonardo-da-vinci', 'albrecht-durer', 'michelangelo', 'raphael'],
    colors: {
      grass: 0x7a6a3d,
      grassAlt: 0x6b5c32,
      path: 0xd4b87a,
      water: 0x4a7a9a,
      forest: 0x4a6a30,
      forestTop: 0x3a5520,
    },
    spawnPoint: { x: 6, y: 6 },
    locationIds: ['medici-collection'],
    locationPositions: { 'medici-collection': { x: 35, y: 15 } },
    grottoPosition: { x: 20, y: 26 },
    shopPositions: [
      { x: 4, y: 16, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 10, y: 16, type: 'apothecary', name: 'The Apothecary' },
      { x: 16, y: 16, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 25, cy: 25, w: 4, h: 2 },
      { cx: 40, cy: 8, w: 2, h: 2 },
    ],
    forestFeatures: [
      { cx: 12, cy: 3, w: 5, h: 4 },
      { cx: 38, cy: 24, w: 5, h: 4 },
      { cx: 5, cy: 24, w: 4, h: 4 },
    ],
    paths: [
      [6, 6, 35, 15],     // spawn to medici
      [6, 6, 4, 16],      // spawn to shops
      [4, 16, 16, 16],    // shop row
      [35, 15, 16, 16],   // medici to shops
    ],
  },

  // Stage 4: Age of Reason -- deep purples, parchment
  {
    stage: 4,
    name: 'The Baroque',
    eraRange: '1540 – 1670',
    width: 55,
    height: 40,
    characterIds: ['miguel-de-cervantes', 'william-shakespeare', 'caravaggio', 'rembrandt-van-rijn', 'john-milton', 'johannes-vermeer'],
    colors: {
      grass: 0x4a3860,
      grassAlt: 0x3d2e52,
      path: 0xc4b08a,
      water: 0x3a5a8a,
      forest: 0x2a4a3a,
      forestTop: 0x1a3a2a,
    },
    spawnPoint: { x: 6, y: 6 },
    locationIds: ['bodleian-library'],
    locationPositions: { 'bodleian-library': { x: 40, y: 18 } },
    grottoPosition: { x: 25, y: 30 },
    shopPositions: [
      { x: 4, y: 18, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 10, y: 18, type: 'apothecary', name: 'The Apothecary' },
      { x: 16, y: 18, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 35, cy: 34, w: 4, h: 3 },
      { cx: 45, cy: 10, w: 3, h: 2 },
    ],
    forestFeatures: [
      { cx: 14, cy: 3, w: 6, h: 4 },
      { cx: 42, cy: 28, w: 5, h: 5 },
      { cx: 5, cy: 28, w: 4, h: 4 },
      { cx: 30, cy: 5, w: 4, h: 3 },
    ],
    paths: [
      [6, 6, 40, 18],     // spawn to bodleian
      [6, 6, 4, 18],      // spawn to shops
      [4, 18, 16, 18],    // shop row
      [40, 18, 28, 18],   // bodleian toward center
      [16, 18, 25, 30],   // shops toward grotto
    ],
  },

  // Stage 5: Romantic Era -- soft blues, warm greens
  {
    stage: 5,
    name: 'Enlightenment & Romanticism',
    eraRange: '1740 – 1870',
    width: 60,
    height: 45,
    characterIds: ['francisco-goya', 'jane-austen', 'jmw-turner', 'charles-dickens', 'fyodor-dostoevsky', 'leo-tolstoy', 'emily-dickinson'],
    colors: {
      grass: 0x4a7c6f,
      grassAlt: 0x3d6b60,
      path: 0xb8a888,
      water: 0x5a8aaa,
      forest: 0x3a6a4a,
      forestTop: 0x2a5a3a,
    },
    spawnPoint: { x: 7, y: 7 },
    locationIds: ['uffizi-gallery'],
    locationPositions: { 'uffizi-gallery': { x: 45, y: 20 } },
    grottoPosition: { x: 28, y: 35 },
    shopPositions: [
      { x: 5, y: 20, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 11, y: 20, type: 'apothecary', name: 'The Apothecary' },
      { x: 17, y: 20, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 38, cy: 38, w: 5, h: 3 },
      { cx: 50, cy: 10, w: 3, h: 2 },
      { cx: 15, cy: 38, w: 3, h: 2 },
    ],
    forestFeatures: [
      { cx: 15, cy: 3, w: 6, h: 5 },
      { cx: 48, cy: 32, w: 5, h: 5 },
      { cx: 6, cy: 32, w: 4, h: 4 },
      { cx: 35, cy: 6, w: 5, h: 4 },
    ],
    paths: [
      [7, 7, 45, 20],     // spawn to uffizi
      [7, 7, 5, 20],      // spawn to shops
      [5, 20, 17, 20],    // shop row
      [45, 20, 30, 20],   // uffizi toward center
      [17, 20, 28, 35],   // shops toward grotto
    ],
  },

  // Stage 6: Modern Age -- cool grays, steel blue
  {
    stage: 6,
    name: 'Impressionism & New Worlds',
    eraRange: '1835 – 1910',
    width: 70,
    height: 50,
    characterIds: ['mark-twain', 'paul-cezanne', 'claude-monet', 'pierre-auguste-renoir', 'vincent-van-gogh', 'gustav-klimt', 'henri-matisse'],
    colors: {
      grass: 0x5a6a5a,
      grassAlt: 0x4d5d4d,
      path: 0xa0a0a0,
      water: 0x4a6a8a,
      forest: 0x3a5a3a,
      forestTop: 0x2a4a2a,
    },
    spawnPoint: { x: 8, y: 8 },
    locationIds: ['the-louvre'],
    locationPositions: { 'the-louvre': { x: 52, y: 25 } },
    grottoPosition: { x: 32, y: 40 },
    shopPositions: [
      { x: 5, y: 22, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 12, y: 22, type: 'apothecary', name: 'The Apothecary' },
      { x: 19, y: 22, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 42, cy: 43, w: 5, h: 3 },
      { cx: 55, cy: 12, w: 3, h: 2 },
      { cx: 18, cy: 42, w: 4, h: 2 },
    ],
    forestFeatures: [
      { cx: 18, cy: 3, w: 7, h: 5 },
      { cx: 55, cy: 36, w: 6, h: 5 },
      { cx: 7, cy: 36, w: 5, h: 5 },
      { cx: 40, cy: 5, w: 5, h: 4 },
      { cx: 60, cy: 42, w: 4, h: 4 },
    ],
    paths: [
      [8, 8, 52, 25],     // spawn to louvre
      [8, 8, 5, 22],      // spawn to shops
      [5, 22, 19, 22],    // shop row
      [52, 25, 35, 22],   // louvre toward center
      [19, 22, 32, 40],   // shops toward grotto
    ],
  },

  // Stage 7: The Present -- bold dark contrasts
  {
    stage: 7,
    name: 'The Modern Age',
    eraRange: '1880 – 1960',
    width: 80,
    height: 60,
    characterIds: ['pablo-picasso', 'virginia-woolf', 'james-joyce', 'franz-kafka', 'ernest-hemingway', 'jorge-luis-borges', 'frida-kahlo', 'jackson-pollock'],
    colors: {
      grass: 0x6b3a4a,
      grassAlt: 0x5c2d3d,
      path: 0x8a8a9a,
      water: 0x3a5a7a,
      forest: 0x2a3a2a,
      forestTop: 0x1a2a1a,
    },
    spawnPoint: { x: 10, y: 10 },
    locationIds: ['peggy-guggenheim'],
    locationPositions: { 'peggy-guggenheim': { x: 60, y: 35 } },
    grottoPosition: { x: 35, y: 48 },
    shopPositions: [
      { x: 5, y: 25, type: 'blacksmith', name: 'The Blacksmith' },
      { x: 12, y: 25, type: 'apothecary', name: 'The Apothecary' },
      { x: 19, y: 25, type: 'blackmarket', name: 'The Black Market' },
    ],
    waterFeatures: [
      { cx: 48, cy: 52, w: 5, h: 3 },
      { cx: 60, cy: 15, w: 4, h: 3 },
      { cx: 20, cy: 50, w: 4, h: 3 },
    ],
    forestFeatures: [
      { cx: 20, cy: 4, w: 7, h: 5 },
      { cx: 62, cy: 45, w: 6, h: 5 },
      { cx: 8, cy: 40, w: 5, h: 5 },
      { cx: 45, cy: 6, w: 6, h: 5 },
      { cx: 70, cy: 20, w: 5, h: 4 },
      { cx: 44, cy: 52, w: 4, h: 4 },
    ],
    paths: [
      [10, 10, 60, 35],    // spawn to guggenheim
      [10, 10, 5, 25],     // spawn to shops
      [5, 25, 19, 25],     // shop row
      [60, 35, 40, 25],    // guggenheim toward center
      [40, 25, 19, 25],    // center to shops
      [19, 25, 35, 48],    // shops toward grotto
    ],
  },
];

export function getStageConfig(level: number): StageMapConfig {
  return stages.find(s => s.stage === level) ?? stages[0];
}
