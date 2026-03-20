import type { GameItem } from './types';

export const items: GameItem[] = [
  // === HOMER ===
  { id: 'iliad', name: 'The Iliad', type: 'book', creatorId: 'homer', year: -750, description: 'Epic poem about the Trojan War, focusing on the wrath of Achilles.', rarity: 'rare', baseValue: 150 },
  { id: 'odyssey', name: 'The Odyssey', type: 'book', creatorId: 'homer', year: -725, description: 'Epic poem following Odysseus on his journey home from Troy.', rarity: 'rare', baseValue: 150 },
  // === SAPPHO ===
  { id: 'hymn-to-aphrodite', name: 'Hymn to Aphrodite', type: 'book', creatorId: 'sappho', year: -600, description: 'Sappho\'s only complete surviving poem, a prayer to the goddess of love.', rarity: 'legendary', baseValue: 400 },
  { id: 'sappho-fragments', name: 'Fragments of Sappho', type: 'book', creatorId: 'sappho', year: -590, description: 'Precious fragments of lyric poetry from the Tenth Muse.', rarity: 'rare', baseValue: 120 },
  // === VIRGIL ===
  { id: 'aeneid', name: 'The Aeneid', type: 'book', creatorId: 'virgil', year: -19, description: 'Latin epic poem telling the story of Aeneas, a Trojan who founded Rome.', rarity: 'rare', baseValue: 140 },
  { id: 'eclogues', name: 'Eclogues', type: 'book', creatorId: 'virgil', year: -37, description: 'Ten pastoral poems that established Virgil\'s reputation.', rarity: 'uncommon', baseValue: 60 },
  // === DANTE ===
  { id: 'divine-comedy', name: 'The Divine Comedy', type: 'book', creatorId: 'dante', year: 1320, description: 'A journey through Hell, Purgatory, and Paradise.', rarity: 'legendary', baseValue: 400 },
  { id: 'vita-nuova', name: 'La Vita Nuova', type: 'book', creatorId: 'dante', year: 1294, description: 'Prose and verse celebrating Dante\'s love for Beatrice.', rarity: 'uncommon', baseValue: 70 },
  // === CHAUCER ===
  { id: 'canterbury-tales', name: 'The Canterbury Tales', type: 'book', creatorId: 'chaucer', year: 1400, description: 'A collection of stories told by pilgrims on their way to Canterbury.', rarity: 'rare', baseValue: 130 },
  // === CHRISTINE DE PIZAN ===
  { id: 'book-city-of-ladies', name: 'The Book of the City of Ladies', type: 'book', creatorId: 'christine-de-pizan', year: 1405, description: 'An allegorical city built by history\'s greatest women.', rarity: 'rare', baseValue: 130 },
  { id: 'treasure-city-of-ladies', name: 'The Treasure of the City of Ladies', type: 'book', creatorId: 'christine-de-pizan', year: 1405, description: 'A practical guide for women of all social classes.', rarity: 'uncommon', baseValue: 70 },
  // === SHAKESPEARE ===
  { id: 'hamlet', name: 'Hamlet', type: 'book', creatorId: 'shakespeare', year: 1601, description: 'The tragedy of the Prince of Denmark and his quest for revenge.', rarity: 'rare', baseValue: 120 },
  { id: 'romeo-and-juliet', name: 'Romeo and Juliet', type: 'book', creatorId: 'shakespeare', year: 1597, description: 'The most famous love story ever told.', rarity: 'uncommon', baseValue: 80 },
  { id: 'macbeth', name: 'Macbeth', type: 'book', creatorId: 'shakespeare', year: 1606, description: 'A Scottish general\'s descent into tyranny and madness.', rarity: 'uncommon', baseValue: 80 },
  // === CERVANTES ===
  { id: 'don-quixote', name: 'Don Quixote', type: 'book', creatorId: 'cervantes', year: 1605, description: 'Often called the first modern novel, following a delusional knight.', rarity: 'legendary', baseValue: 350 },
  // === MILTON ===
  { id: 'paradise-lost', name: 'Paradise Lost', type: 'book', creatorId: 'milton', year: 1667, description: 'Epic poem about the Fall of Man and Satan\'s rebellion.', rarity: 'rare', baseValue: 140 },
  // === AUSTEN ===
  { id: 'pride-and-prejudice', name: 'Pride and Prejudice', type: 'book', creatorId: 'austen', year: 1813, description: 'The witty tale of Elizabeth Bennet and Mr. Darcy.', rarity: 'uncommon', baseValue: 70 },
  { id: 'sense-and-sensibility', name: 'Sense and Sensibility', type: 'book', creatorId: 'austen', year: 1811, description: 'Two sisters navigate love and heartbreak in Regency England.', rarity: 'common', baseValue: 40 },
  // === DICKENS ===
  { id: 'great-expectations', name: 'Great Expectations', type: 'book', creatorId: 'dickens', year: 1861, description: 'Pip\'s journey from humble origins to gentleman\'s life.', rarity: 'uncommon', baseValue: 60 },
  { id: 'tale-of-two-cities', name: 'A Tale of Two Cities', type: 'book', creatorId: 'dickens', year: 1859, description: 'Set during the French Revolution in London and Paris.', rarity: 'uncommon', baseValue: 65 },
  // === DOSTOEVSKY ===
  { id: 'crime-and-punishment', name: 'Crime and Punishment', type: 'book', creatorId: 'dostoevsky', year: 1866, description: 'A student commits murder and grapples with guilt and redemption.', rarity: 'rare', baseValue: 110 },
  { id: 'brothers-karamazov', name: 'The Brothers Karamazov', type: 'book', creatorId: 'dostoevsky', year: 1880, description: 'Dostoevsky\'s final novel about faith, doubt, and family.', rarity: 'rare', baseValue: 130 },
  // === TOLSTOY ===
  { id: 'war-and-peace', name: 'War and Peace', type: 'book', creatorId: 'tolstoy', year: 1869, description: 'Epic chronicle of Russian society during the Napoleonic Wars.', rarity: 'legendary', baseValue: 380 },
  { id: 'anna-karenina', name: 'Anna Karenina', type: 'book', creatorId: 'tolstoy', year: 1877, description: 'A tragic love story set amid Russian high society.', rarity: 'rare', baseValue: 120 },
  // === TWAIN ===
  { id: 'huckleberry-finn', name: 'Adventures of Huckleberry Finn', type: 'book', creatorId: 'twain', year: 1884, description: 'A boy and an escaped slave raft down the Mississippi.', rarity: 'uncommon', baseValue: 70 },
  { id: 'tom-sawyer', name: 'The Adventures of Tom Sawyer', type: 'book', creatorId: 'twain', year: 1876, description: 'A mischievous boy\'s adventures in small-town Missouri.', rarity: 'common', baseValue: 40 },
  // === DICKINSON ===
  { id: 'dickinson-poems', name: 'Poems by Emily Dickinson', type: 'book', creatorId: 'dickinson', year: 1890, description: 'Posthumously published collection of nearly 1,800 poems.', rarity: 'rare', baseValue: 100 },
  // === WOOLF ===
  { id: 'mrs-dalloway', name: 'Mrs Dalloway', type: 'book', creatorId: 'woolf', year: 1925, description: 'A day in the life of Clarissa Dalloway in post-war London.', rarity: 'uncommon', baseValue: 75 },
  { id: 'to-the-lighthouse', name: 'To the Lighthouse', type: 'book', creatorId: 'woolf', year: 1927, description: 'Stream-of-consciousness novel about the Ramsay family.', rarity: 'rare', baseValue: 110 },
  // === KAFKA ===
  { id: 'the-trial', name: 'The Trial', type: 'book', creatorId: 'kafka', year: 1925, description: 'A man is arrested and prosecuted by an inaccessible authority.', rarity: 'rare', baseValue: 120 },
  { id: 'metamorphosis', name: 'The Metamorphosis', type: 'book', creatorId: 'kafka', year: 1915, description: 'Gregor Samsa wakes up transformed into a giant insect.', rarity: 'uncommon', baseValue: 80 },
  // === JOYCE ===
  { id: 'ulysses', name: 'Ulysses', type: 'book', creatorId: 'joyce', year: 1922, description: 'A single day in Dublin, paralleling Homer\'s Odyssey.', rarity: 'legendary', baseValue: 450 },
  { id: 'dubliners', name: 'Dubliners', type: 'book', creatorId: 'joyce', year: 1914, description: 'Fifteen short stories depicting Irish middle-class life.', rarity: 'common', baseValue: 45 },
  // === HEMINGWAY ===
  { id: 'old-man-and-sea', name: 'The Old Man and the Sea', type: 'book', creatorId: 'hemingway', year: 1952, description: 'An aging fisherman\'s epic struggle with a giant marlin.', rarity: 'uncommon', baseValue: 70 },
  { id: 'farewell-to-arms', name: 'A Farewell to Arms', type: 'book', creatorId: 'hemingway', year: 1929, description: 'A love story set against the Italian front of World War I.', rarity: 'uncommon', baseValue: 65 },
  // === BORGES ===
  { id: 'ficciones', name: 'Ficciones', type: 'book', creatorId: 'borges', year: 1944, description: 'A collection of fantastical short stories bending reality.', rarity: 'rare', baseValue: 130 },
  { id: 'the-aleph', name: 'The Aleph', type: 'book', creatorId: 'borges', year: 1949, description: 'Short stories exploring infinity, mirrors, and labyrinths.', rarity: 'rare', baseValue: 120 },

  // ===== ARTWORKS =====
  // === GIOTTO ===
  { id: 'scrovegni-chapel', name: 'Scrovegni Chapel Frescoes', type: 'artwork', creatorId: 'giotto', year: 1305, description: 'Revolutionary fresco cycle depicting the life of Christ and the Virgin Mary.', rarity: 'rare', baseValue: 160 },
  // === BOTTICELLI ===
  { id: 'birth-of-venus', name: 'The Birth of Venus', type: 'artwork', creatorId: 'botticelli', year: 1485, description: 'Venus emerging from the sea on a giant scallop shell.', rarity: 'legendary', baseValue: 400 },
  { id: 'primavera', name: 'Primavera', type: 'artwork', creatorId: 'botticelli', year: 1482, description: 'Allegorical painting of spring with mythological figures.', rarity: 'rare', baseValue: 150 },
  // === DA VINCI ===
  { id: 'mona-lisa', name: 'Mona Lisa', type: 'artwork', creatorId: 'da-vinci', year: 1503, description: 'The most famous portrait in the world, known for her enigmatic smile.', rarity: 'legendary', baseValue: 500 },
  { id: 'last-supper', name: 'The Last Supper', type: 'artwork', creatorId: 'da-vinci', year: 1498, description: 'Depicting the moment Jesus announces one of his disciples will betray him.', rarity: 'legendary', baseValue: 480 },
  // === DÜRER ===
  { id: 'melencolia-i', name: 'Melencolia I', type: 'artwork', creatorId: 'albrecht-durer', year: 1514, description: 'A mysterious engraving of a brooding angel surrounded by scientific instruments.', rarity: 'rare', baseValue: 160 },
  { id: 'durer-rhinoceros', name: 'Rhinoceros', type: 'artwork', creatorId: 'albrecht-durer', year: 1515, description: 'A famous woodcut of a rhinoceros Dürer never actually saw.', rarity: 'uncommon', baseValue: 80 },
  { id: 'praying-hands', name: 'Praying Hands', type: 'artwork', creatorId: 'albrecht-durer', year: 1508, description: 'An ink and pencil study that became one of the most reproduced images in history.', rarity: 'rare', baseValue: 140 },
  // === MICHELANGELO ===
  { id: 'sistine-ceiling', name: 'Sistine Chapel Ceiling', type: 'artwork', creatorId: 'michelangelo', year: 1512, description: 'The iconic ceiling featuring the Creation of Adam.', rarity: 'legendary', baseValue: 500 },
  { id: 'david-sculpture', name: 'David', type: 'artwork', creatorId: 'michelangelo', year: 1504, description: 'The 17-foot marble sculpture of the Biblical hero.', rarity: 'legendary', baseValue: 480 },
  // === RAPHAEL ===
  { id: 'school-of-athens', name: 'The School of Athens', type: 'artwork', creatorId: 'raphael', year: 1511, description: 'A fresco depicting the greatest philosophers of antiquity.', rarity: 'rare', baseValue: 180 },
  // === CARAVAGGIO ===
  { id: 'calling-of-st-matthew', name: 'The Calling of Saint Matthew', type: 'artwork', creatorId: 'caravaggio', year: 1600, description: 'Dramatic chiaroscuro depicting Christ calling Matthew from the tax office.', rarity: 'rare', baseValue: 160 },
  { id: 'judith-beheading', name: 'Judith Beheading Holofernes', type: 'artwork', creatorId: 'caravaggio', year: 1599, description: 'Intense depiction of the biblical story of Judith.', rarity: 'uncommon', baseValue: 90 },
  // === REMBRANDT ===
  { id: 'night-watch', name: 'The Night Watch', type: 'artwork', creatorId: 'rembrandt', year: 1642, description: 'A massive group portrait of a civic militia company.', rarity: 'rare', baseValue: 170 },
  { id: 'rembrandt-self-portrait', name: 'Self-Portrait (1669)', type: 'artwork', creatorId: 'rembrandt', year: 1669, description: 'One of Rembrandt\'s final self-portraits, painted with remarkable honesty.', rarity: 'uncommon', baseValue: 80 },
  // === VERMEER ===
  { id: 'girl-with-pearl-earring', name: 'Girl with a Pearl Earring', type: 'artwork', creatorId: 'vermeer', year: 1665, description: 'Often called the "Mona Lisa of the North."', rarity: 'legendary', baseValue: 400 },
  { id: 'milkmaid', name: 'The Milkmaid', type: 'artwork', creatorId: 'vermeer', year: 1658, description: 'A kitchen maid pouring milk with extraordinary light effects.', rarity: 'rare', baseValue: 150 },
  // === GOYA ===
  { id: 'third-of-may', name: 'The Third of May 1808', type: 'artwork', creatorId: 'goya', year: 1814, description: 'Depicting the execution of Spanish civilians by French soldiers.', rarity: 'rare', baseValue: 140 },
  { id: 'saturn-devouring', name: 'Saturn Devouring His Son', type: 'artwork', creatorId: 'goya', year: 1823, description: 'One of Goya\'s terrifying "Black Paintings."', rarity: 'rare', baseValue: 150 },
  // === TURNER ===
  { id: 'fighting-temeraire', name: 'The Fighting Temeraire', type: 'artwork', creatorId: 'turner', year: 1839, description: 'A warship being towed to be broken up, bathed in golden light.', rarity: 'rare', baseValue: 130 },
  // === MONET ===
  { id: 'water-lilies', name: 'Water Lilies', type: 'artwork', creatorId: 'monet', year: 1906, description: 'Part of a series of approximately 250 oil paintings.', rarity: 'rare', baseValue: 140 },
  { id: 'impression-sunrise', name: 'Impression, Sunrise', type: 'artwork', creatorId: 'monet', year: 1872, description: 'The painting that gave Impressionism its name.', rarity: 'legendary', baseValue: 420 },
  // === RENOIR ===
  { id: 'bal-du-moulin', name: 'Bal du moulin de la Galette', type: 'artwork', creatorId: 'pierre-auguste-renoir', year: 1876, description: 'A joyful scene of Parisians dancing in dappled sunlight at Montmartre.', rarity: 'legendary', baseValue: 450 },
  { id: 'luncheon-boating-party', name: 'Luncheon of the Boating Party', type: 'artwork', creatorId: 'pierre-auguste-renoir', year: 1881, description: 'Friends dining on a sunny terrace overlooking the Seine.', rarity: 'rare', baseValue: 160 },
  // === VAN GOGH ===
  { id: 'starry-night', name: 'The Starry Night', type: 'artwork', creatorId: 'van-gogh', year: 1889, description: 'Painted from the window of his asylum room at Saint-Rémy.', rarity: 'legendary', baseValue: 500 },
  { id: 'sunflowers', name: 'Sunflowers', type: 'artwork', creatorId: 'van-gogh', year: 1888, description: 'A series of still life paintings of sunflowers in a vase.', rarity: 'rare', baseValue: 160 },
  // === CÉZANNE ===
  { id: 'mont-sainte-victoire', name: 'Mont Sainte-Victoire', type: 'artwork', creatorId: 'cezanne', year: 1904, description: 'One of many paintings of the mountain near Cézanne\'s home.', rarity: 'uncommon', baseValue: 90 },
  { id: 'card-players', name: 'The Card Players', type: 'artwork', creatorId: 'cezanne', year: 1895, description: 'A series of paintings depicting Provençal peasants playing cards.', rarity: 'rare', baseValue: 160 },
  // === KLIMT ===
  { id: 'the-kiss-klimt', name: 'The Kiss', type: 'artwork', creatorId: 'klimt', year: 1908, description: 'A couple embracing, covered in elaborate gold-leaf patterns.', rarity: 'legendary', baseValue: 440 },
  // === PICASSO ===
  { id: 'guernica', name: 'Guernica', type: 'artwork', creatorId: 'picasso', year: 1937, description: 'Powerful anti-war painting responding to the bombing of Guernica.', rarity: 'legendary', baseValue: 500 },
  { id: 'les-demoiselles', name: "Les Demoiselles d'Avignon", type: 'artwork', creatorId: 'picasso', year: 1907, description: 'A proto-Cubist work that shocked the art world.', rarity: 'rare', baseValue: 180 },
  // === MATISSE ===
  { id: 'dance-matisse', name: 'The Dance', type: 'artwork', creatorId: 'matisse', year: 1910, description: 'Five dancing figures in bold, flat colors.', rarity: 'rare', baseValue: 140 },
  { id: 'red-studio', name: 'The Red Studio', type: 'artwork', creatorId: 'matisse', year: 1911, description: 'Matisse\'s studio rendered entirely in red.', rarity: 'uncommon', baseValue: 90 },
  // === KAHLO ===
  { id: 'two-fridas', name: 'The Two Fridas', type: 'artwork', creatorId: 'kahlo', year: 1939, description: 'Double self-portrait showing two sides of her identity.', rarity: 'rare', baseValue: 160 },
  { id: 'broken-column', name: 'The Broken Column', type: 'artwork', creatorId: 'kahlo', year: 1944, description: 'Self-portrait depicting her pain from a spinal injury.', rarity: 'uncommon', baseValue: 80 },
  // === POLLOCK ===
  { id: 'number-1a', name: 'Number 1A, 1948', type: 'artwork', creatorId: 'pollock', year: 1948, description: 'One of the most famous drip paintings in abstract expressionism.', rarity: 'rare', baseValue: 170 },
  { id: 'autumn-rhythm', name: 'Autumn Rhythm (Number 30)', type: 'artwork', creatorId: 'pollock', year: 1950, description: 'A masterpiece of the drip painting technique.', rarity: 'rare', baseValue: 160 },
];

export function getItemById(id: string): GameItem | undefined {
  return items.find(i => i.id === id);
}

export function getItemsByCreator(creatorId: string): GameItem[] {
  return items.filter(i => i.creatorId === creatorId);
}
