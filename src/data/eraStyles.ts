export interface StyleEntry {
  name: string;
  description: string;
  culturalContext: string;
  excerpt?: string;
  exampleTitle?: string;
  exampleArtist?: string;
}

export interface EraStyles {
  stage: number;
  writingStyles: StyleEntry[];
  artStyles: StyleEntry[];
}

export const eraStyles: EraStyles[] = [
  // === STAGE 1: ANCIENT WORLD (800 BC - 100 AD) ===
  {
    stage: 1,
    writingStyles: [
      {
        name: 'Epic Poetry',
        description: 'Long narrative poems celebrating heroic deeds, divine interventions, and the founding myths of civilizations. Composed in dactylic hexameter and passed down through oral tradition before being written down.',
        culturalContext: 'In a world without written history, epic poetry served as the collective memory of entire peoples. The Greeks used epics like the Iliad to define what it meant to be heroic, to explore the tension between fate and free will, and to process the trauma of war. These stories were performed at religious festivals, binding communities together through shared narrative.',
        excerpt: '"Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures."\n— Homer, Iliad (opening lines)',
      },
      {
        name: 'Lyric Poetry',
        description: 'Short, intensely personal poems originally sung to the accompaniment of a lyre. Unlike epic poetry, lyric verse focused on individual emotion — love, loss, desire, and mortality.',
        culturalContext: 'As Greek city-states developed and individual identity became more valued alongside communal life, poetry turned inward. Sappho and her contemporaries gave voice to private experience at a time when most literature served public, religious, or political functions. This was revolutionary — the idea that one person\'s feelings were worthy of art.',
        excerpt: '"The moon has set, and the Pleiades;\nit is midnight,\nthe time is going by,\nand I sleep alone."\n— Sappho, Midnight Poem',
      },
      {
        name: 'Pastoral Poetry',
        description: 'Idealized depictions of rural life, shepherds, and the natural world. Originated with Theocritus and was perfected by Virgil in his Eclogues.',
        culturalContext: 'Pastoral poetry emerged as Greek and Roman cities grew larger and more complex. Urban poets looked back to an idealized countryside as a place of innocence and simplicity — a literary escape from political turmoil. Virgil wrote his Eclogues during the Roman civil wars, and the peaceful shepherd\'s life became a pointed contrast to the violence of the age.',
        excerpt: '"Tityrus, you who lie beneath the spreading beech tree\'s cover,\nyou court the woodland Muse on slender reed;\nwe leave our country\'s bounds, our well-loved fields."\n— Virgil, Eclogues I',
      },
    ],
    artStyles: [
      {
        name: 'Greek Black-Figure Pottery',
        description: 'Figures painted in black slip on red clay, then details incised with a sharp tool. This technique dominated Greek ceramics from the 7th to 5th centuries BC and depicted myths, battles, and daily life.',
        culturalContext: 'Greek pottery was not merely decorative — it was a primary medium for visual storytelling in a culture where wall paintings rarely survived. The scenes depicted on vases reinforced social values: heroism in battle, proper religious observance, and the dangers of hubris. Pottery was also a major export, spreading Greek culture across the Mediterranean.',
        exampleTitle: 'Achilles and Ajax playing a board game',
        exampleArtist: 'Exekias',
      },
      {
        name: 'Classical Greek Sculpture',
        description: 'Idealized human forms in marble and bronze, emphasizing proportion, balance, and anatomical accuracy. The classical period (5th-4th century BC) produced works of unprecedented naturalism and beauty.',
        culturalContext: 'The Greeks believed the human body was the highest expression of divine order. After their victory over Persia, Athens entered a golden age of confidence, and sculpture reflected this — perfect bodies embodied the ideal citizen, rational and beautiful. The sculptor Polykleitos even wrote a treatise (the Canon) defining mathematical ratios for the perfect human form.',
        exampleTitle: 'Discobolus',
        exampleArtist: 'Myron',
      },
    ],
  },

  // === STAGE 2: MEDIEVAL WORLD (1250-1400) ===
  {
    stage: 2,
    writingStyles: [
      {
        name: 'Allegory',
        description: 'Extended metaphorical narratives where characters, events, and settings represent abstract moral or spiritual concepts. The entire story functions on two levels — literal and symbolic.',
        culturalContext: 'Medieval Europe was dominated by the Church, and allegory allowed writers to explore complex theological questions through storytelling. Dante\'s Divine Comedy maps the entire Christian cosmos, but it\'s also a deeply political work — he places his enemies in Hell. In a world where literacy was rare and the Bible was in Latin, allegorical stories made spiritual truths accessible.',
        excerpt: '"In the middle of the journey of our life\nI found myself in a dark wood,\nfor the straight way was lost.\nAh, how hard it is to tell what that wood was,\nwild, rough, and stubborn,\nthe very thought of it renews my fear!"\n— Dante, Inferno, Canto I',
      },
      {
        name: 'Chivalric Romance',
        description: 'Narratives of knights, quests, courtly love, and supernatural encounters. Written in verse or prose, they celebrated the ideals of the feudal aristocracy.',
        culturalContext: 'The Crusades brought European knights into contact with Arab culture, sparking a fascination with exotic adventures. Meanwhile, the feudal system needed stories that glorified loyalty, bravery, and service to one\'s lord. Chivalric romances also gave women a surprisingly central role — courtly love placed the lady on a pedestal, even as real medieval women had few rights.',
        excerpt: '"Whan that Aprille with his shoures soote,\nThe droghte of March hath perced to the roote,\nAnd bathed every veyne in swich licóur\nOf which vertú engendred is the flour..."\n— Chaucer, The Canterbury Tales (General Prologue)',
      },
      {
        name: 'Proto-Feminist Writing',
        description: 'Works that challenged prevailing views about women\'s intellectual and moral capacities. Christine de Pizan pioneered this tradition, using learned argument and allegory to defend women.',
        culturalContext: 'Medieval women were largely excluded from education and public life. When the popular Romance of the Rose depicted women as deceitful and morally weak, Christine de Pizan wrote a systematic rebuttal. She had unique access to the French royal library and used her learning to argue that women\'s perceived inferiority was due to lack of education, not nature — an argument centuries ahead of its time.',
        excerpt: '"If it were customary to send little girls to school and to teach them the same subjects as are taught to boys, they would learn just as fully and would understand the subtleties of all arts and sciences."\n— Christine de Pizan, The Book of the City of Ladies',
      },
    ],
    artStyles: [
      {
        name: 'Byzantine Art',
        description: 'Highly stylized, symbolic art characterized by gold backgrounds, frontal figures with large eyes, and flat, two-dimensional forms. Rooted in the Eastern Roman Empire and used primarily for religious icons and mosaics.',
        culturalContext: 'Byzantine artists were not trying to depict the physical world — they were creating windows into the divine. The flat, otherworldly quality was intentional: these images were meant to transcend earthly reality. The Iconoclasm controversy (726-843 AD) nearly destroyed this tradition when emperors banned religious images, believing they were idolatrous. The eventual triumph of the icon-lovers shaped centuries of Eastern Christian art.',
        exampleTitle: 'Christ Pantocrator (Sinai)',
      },
      {
        name: 'Gothic Art',
        description: 'Emerging in 12th-century France, Gothic art brought greater naturalism, emotion, and elegance to religious subjects. Known for soaring cathedral architecture, stained glass, and increasingly lifelike sculpture.',
        culturalContext: 'The Gothic style emerged as European cities grew wealthy from trade. Cathedrals became civic showpieces — towns competed to build the tallest, most light-filled churches. The theological idea was that light itself was divine, so Gothic architects dissolved walls into vast windows of colored glass. Meanwhile, the Black Death (1347-1351) introduced a new preoccupation with mortality into art — the "Dance of Death" motif reminded viewers that plague could strike anyone.',
        exampleTitle: 'North Rose Window, Chartres Cathedral',
      },
      {
        name: 'Proto-Renaissance',
        description: 'The transition from flat Byzantine style to three-dimensional naturalism, pioneered by Giotto di Bondone. Figures gained weight, emotion, and spatial depth for the first time in Western art.',
        culturalContext: 'Giotto painted in the wake of Saint Francis of Assisi, whose movement emphasized the humanity of Christ and the beauty of the natural world. This spiritual shift — from a distant, otherworldly God to one who suffered and felt — demanded art that could convey genuine human emotion. Giotto\'s weeping figures in the Scrovegni Chapel shocked viewers accustomed to serene, emotionless Byzantine faces.',
        exampleTitle: 'Lamentation (The Mourning of Christ)',
        exampleArtist: 'Giotto',
      },
    ],
  },

  // === STAGE 3: RENAISSANCE (1440-1520) ===
  {
    stage: 3,
    writingStyles: [
      {
        name: 'Humanism',
        description: 'A literary and philosophical movement that placed human experience, reason, and classical learning at the center of intellectual life. Humanist writers looked to ancient Greek and Roman texts as models.',
        culturalContext: 'The fall of Constantinople in 1453 sent Greek scholars fleeing west, carrying manuscripts of Plato and Aristotle. Meanwhile, the printing press (1440) made books affordable for the first time. Together, these forces created an intellectual revolution. Scholars began to believe that studying the ancients could improve the present — a radical departure from medieval thinking, which held that humanity was fallen and could only look to God for wisdom.',
        excerpt: '"Man is the measure of all things."\n— Protagoras (revived as a Renaissance motto)\n\n"I have read that Octavian Augustus, the mightiest emperor, never forgave a writer who had satirized him. But I, who am less than Augustus, can well forgive you."\n— Petrarch, Letter to posterity',
      },
      {
        name: 'The Sonnet',
        description: 'A 14-line poem with a strict rhyme scheme, perfected by Petrarch and later adapted by Shakespeare. The form\'s compact structure made it ideal for exploring a single emotion or argument.',
        culturalContext: 'The sonnet became the literary currency of Renaissance courtly culture. Writing sonnets demonstrated education, wit, and emotional refinement — qualities prized in the ideal courtier. Petrarch\'s sonnets to Laura established a template of unrequited love that influenced centuries of European poetry. The form\'s strict constraints paradoxically freed poets to be inventive within its rules.',
        excerpt: '"Shall I compare thee to a summer\'s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer\'s lease hath all too short a date."\n— Shakespeare, Sonnet 18 (written later, but perfecting the Renaissance form)',
      },
    ],
    artStyles: [
      {
        name: 'High Renaissance',
        description: 'The pinnacle of Renaissance art (c. 1490-1527), characterized by perfect harmony, balanced composition, and idealized beauty. Masters like Leonardo, Michelangelo, and Raphael achieved unprecedented unity of form and meaning.',
        culturalContext: 'The High Renaissance coincided with intense rivalry between Italian city-states and the papacy, each using art as a tool of prestige and power. Pope Julius II commissioned Michelangelo\'s Sistine Chapel ceiling and Raphael\'s Vatican rooms not just for piety, but to demonstrate papal supremacy. The result was an arms race of genius — artists pushed each other to ever greater achievements, driven by competitive patronage.',
        exampleTitle: 'The Creation of Adam',
        exampleArtist: 'Michelangelo',
      },
      {
        name: 'Northern Renaissance',
        description: 'While Italian artists pursued ideal beauty, Northern European painters like Dürer and Van Eyck focused on meticulous realism — every wrinkle, fabric fold, and reflection rendered with astonishing precision.',
        culturalContext: 'Northern Europe lacked Italy\'s classical ruins and Mediterranean light, so its artists developed a different path to excellence: obsessive observation of the visible world. This reflected a more mercantile, Protestant sensibility — the material world was God\'s creation and worthy of careful study. Dürer explicitly tried to bridge North and South, travelling to Italy to learn perspective and proportion, then fusing them with Northern detail.',
        exampleTitle: 'Self-Portrait at Twenty-Eight',
        exampleArtist: 'Albrecht Dürer',
      },
      {
        name: 'Sfumato',
        description: 'Leonardo da Vinci\'s signature technique of softly blending tones and colors so there are no harsh outlines — figures emerge from shadow like forms in smoke ("sfumato" means "smoky" in Italian).',
        culturalContext: 'Leonardo was as much a scientist as an artist, and sfumato reflected his understanding that the human eye doesn\'t perceive sharp edges in nature. This technique gave the Mona Lisa her mysterious quality — her smile seems to change because Leonardo deliberately left the corners of her mouth in soft ambiguity. It was a philosophical statement: reality itself is not fixed but fluid and open to interpretation.',
        exampleTitle: 'Mona Lisa',
        exampleArtist: 'Leonardo da Vinci',
      },
    ],
  },

  // === STAGE 4: THE BAROQUE (1540-1670) ===
  {
    stage: 4,
    writingStyles: [
      {
        name: 'Dramatic Tragedy',
        description: 'Plays exploring the fatal flaws of great individuals — ambition, jealousy, indecision — leading to their downfall. Shakespeare and his contemporaries transformed theater from religious pageant into psychological exploration.',
        culturalContext: 'The Reformation shattered Europe\'s religious unity, and the resulting wars of religion created a profound sense that the world was unstable. Shakespeare wrote during a period of plague, political assassination plots, and succession crises. His tragedies resonated because they showed how quickly power, sanity, and life itself could be lost — themes all too real for Elizabethan audiences who might die of plague before the next performance.',
        excerpt: '"To be, or not to be, that is the question:\nWhether \'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles\nAnd by opposing end them."\n— Shakespeare, Hamlet (Act 3, Scene 1)',
      },
      {
        name: 'The Picaresque Novel',
        description: 'Episodic novels following a roguish but loveable hero through a series of comic adventures, satirizing all levels of society. Cervantes\' Don Quixote is the founding masterpiece of this form.',
        culturalContext: 'Spain in the 16th century was simultaneously the world\'s greatest empire and deeply corrupt. The picaresque novel emerged as a way to mock social pretension — its low-born heroes exposed the hypocrisy of nobles, clergy, and merchants alike. Don Quixote went further, questioning whether idealism itself was a form of madness, written by a man who had been a soldier, a tax collector, and a prisoner.',
        excerpt: '"Finally, from so little sleeping and so much reading, his brain dried up and he went completely out of his mind. He filled his imagination with everything that he had read — enchantments, combats, challenges, wounds, sweet nothings, love affairs, torments, and other impossible foolishness."\n— Cervantes, Don Quixote',
      },
      {
        name: 'Epic Religious Poetry',
        description: 'Grand poetic works wrestling with theological questions — the nature of evil, free will, and humanity\'s relationship with God. Milton\'s Paradise Lost is the supreme English example.',
        culturalContext: 'Milton wrote Paradise Lost after the English Civil War, in which he had passionately supported the republican cause — and lost. Blind and politically defeated, he channeled his experience into Satan\'s rebellion against God, creating literature\'s most compelling villain. The poem asks why God allows evil, but it\'s also about the psychology of political defeat: Satan\'s famous declaration "Better to reign in Hell than serve in Heaven" echoes the defiance of every failed revolutionary.',
        excerpt: '"Of Man\'s first disobedience, and the fruit\nOf that forbidden tree whose mortal taste\nBrought death into the World, and all our woe,\nWith loss of Eden, till one greater Man\nRestore us, and regain the blissful seat,\nSing, Heavenly Muse."\n— Milton, Paradise Lost (opening lines)',
      },
    ],
    artStyles: [
      {
        name: 'Baroque',
        description: 'Dramatic, emotionally intense art characterized by strong contrasts of light and shadow, dynamic compositions, and theatrical grandeur. Emerged in Rome around 1600 and spread across Europe.',
        culturalContext: 'The Catholic Counter-Reformation weaponized art. After the Protestant Reformation stripped churches of images, the Catholic Church doubled down — commissioning overwhelming, emotionally manipulative artworks designed to inspire awe and devotion. Baroque art was propaganda of the highest order: Caravaggio\'s brutal realism made biblical scenes feel immediate and visceral, while Bernini\'s sculptures seemed to move and breathe.',
        exampleTitle: 'The Calling of Saint Matthew',
        exampleArtist: 'Caravaggio',
      },
      {
        name: 'Dutch Golden Age',
        description: 'While Catholic Europe went Baroque, the Protestant Dutch Republic developed a radically different art market. Ordinary citizens bought paintings of everyday life — landscapes, still lifes, domestic scenes — rather than religious epics.',
        culturalContext: 'The Dutch Republic was the world\'s first modern economy: prosperous, mercantile, and Protestant. Without Church patronage, artists painted for the open market, producing works that celebrated bourgeois life. Vermeer\'s quiet domestic interiors reflected a society that valued private virtue over public spectacle. Rembrandt, uniquely, combined Dutch intimacy with Baroque drama, painting himself aging honestly in a culture that valued truthfulness.',
        exampleTitle: 'The Milkmaid',
        exampleArtist: 'Johannes Vermeer',
      },
      {
        name: 'Chiaroscuro',
        description: 'The dramatic use of strong contrasts between light and dark to model three-dimensional forms and create intense atmosphere. Caravaggio pushed this technique to extremes, inspiring a generation of followers.',
        culturalContext: 'Chiaroscuro was more than a technique — it was a worldview. In an age of religious warfare and political intrigue, the stark division of light and shadow mirrored the moral binaries people grappled with: salvation and damnation, truth and deception. Caravaggio, himself a violent man who killed in a brawl and fled Rome as a fugitive, painted saints emerging from pitch darkness as if grace could find anyone, even in the deepest shadow.',
        exampleTitle: 'Judith Beheading Holofernes',
        exampleArtist: 'Artemisia Gentileschi',
      },
    ],
  },

  // === STAGE 5: ENLIGHTENMENT & ROMANTICISM (1740-1870) ===
  {
    stage: 5,
    writingStyles: [
      {
        name: 'The Novel of Manners',
        description: 'Novels that use the social interactions of a specific class — usually the landed gentry — as a lens to examine human nature, morality, and the tension between individual desire and social expectation.',
        culturalContext: 'Jane Austen wrote during the Napoleonic Wars, but her novels barely mention them. This was deliberate: she examined the wars fought in drawing rooms, where a woman\'s entire future depended on whom she married. Her ironic, precise prose reflected the Enlightenment\'s faith in reason while exposing how irrational society actually was — especially regarding women, money, and class.',
        excerpt: '"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters."\n— Jane Austen, Pride and Prejudice',
      },
      {
        name: 'Social Realism',
        description: 'Fiction that unflinchingly depicted the lives of ordinary and impoverished people, exposing social injustice through vivid, often serialized storytelling.',
        culturalContext: 'The Industrial Revolution created both unprecedented wealth and appalling poverty. Dickens himself was sent to work in a boot-blacking factory at age 12 when his father was imprisoned for debt. His novels — serialized in magazines so even the poor could afford them — forced comfortable middle-class readers to confront the workhouses, debtor\'s prisons, and child labor that their prosperity depended on.',
        excerpt: '"It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness."\n— Charles Dickens, A Tale of Two Cities',
      },
      {
        name: 'Psychological Realism',
        description: 'Novels that delve deep into characters\' inner lives, exploring consciousness, guilt, moral struggle, and the gap between thought and action with unprecedented depth.',
        culturalContext: 'Russia in the 19th century was a society of extremes — vast wealth alongside serfdom, radical intellectuals debating in salons while peasants starved. Dostoevsky, sentenced to death for political activity (reprieved at the last moment before a firing squad), understood extremity firsthand. His novels explored how ideas — whether nihilism, socialism, or religious faith — could drive people to murder, madness, or redemption.',
        excerpt: '"Pain and suffering are always inevitable for a large intelligence and a deep heart. The really great men must, I think, have great sadness on earth."\n— Fyodor Dostoevsky, Crime and Punishment',
      },
    ],
    artStyles: [
      {
        name: 'Romanticism',
        description: 'An artistic movement that celebrated emotion, individualism, the sublime power of nature, and the imagination over Enlightenment rationalism. Dramatic landscapes, historical scenes, and intense self-expression defined the style.',
        culturalContext: 'Romanticism was a rebellion against the Industrial Revolution and the Enlightenment\'s worship of reason. As factories scarred the landscape and cities grew choking and ugly, artists turned to wild nature — storms, mountains, ruins — as sources of spiritual renewal. Turner\'s luminous seascapes and Goya\'s nightmare visions both reflected a world where revolution (French, industrial, and scientific) had made the old certainties impossible.',
        exampleTitle: 'The Fighting Temeraire',
        exampleArtist: 'J.M.W. Turner',
      },
      {
        name: 'Dark Romanticism',
        description: 'The shadow side of Romanticism — art that explored madness, war, and the irrational. Goya\'s late works are the supreme example, abandoning beauty for raw psychological truth.',
        culturalContext: 'Goya began as a court painter of charming tapestries, but the Napoleonic invasion of Spain (1808) shattered his world. He witnessed massacres, and his "Disasters of War" etchings depicted atrocities with unflinching honesty. Later, deaf and disillusioned, he painted his "Black Paintings" directly onto his dining room walls — Saturn devouring his son — images so disturbing they weren\'t meant for anyone else to see.',
        exampleTitle: 'Saturn Devouring His Son',
        exampleArtist: 'Francisco Goya',
      },
    ],
  },

  // === STAGE 6: IMPRESSIONISM & NEW WORLDS (1835-1910) ===
  {
    stage: 6,
    writingStyles: [
      {
        name: 'Satire & Social Commentary',
        description: 'Fiction that uses humor, irony, and exaggeration to criticize society\'s flaws and hypocrisies. Mark Twain elevated American vernacular speech into high art while skewering racism, greed, and pretension.',
        culturalContext: 'Post-Civil War America was a nation trying to reinvent itself while refusing to confront its original sin of slavery. Twain set Huckleberry Finn in the pre-war South but wrote it for post-war readers, forcing them to see the humanity of Jim — an escaped slave — through the eyes of a boy too young to have learned proper prejudice. The novel was controversial then and remains so, which is precisely the point.',
        excerpt: '"You don\'t know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain\'t no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly. There was things which he stretched, but mainly he told the truth."\n— Mark Twain, Adventures of Huckleberry Finn',
      },
      {
        name: 'Symbolism',
        description: 'A literary movement that rejected realism in favor of suggestion, mood, and symbolic imagery. Writers used language to evoke states of mind rather than describe external reality.',
        culturalContext: 'By the late 19th century, science and industrialism had thoroughly "explained" the material world, leaving many artists feeling that something essential — the spiritual, the mysterious — was being lost. Symbolist writers responded by making language itself mysterious, using words the way Impressionist painters used color: not to describe, but to evoke. Emily Dickinson, working in isolation, independently arrived at a similar aesthetic — her dashes and compressed images make the reader feel meaning rather than simply understand it.',
        excerpt: '"Because I could not stop for Death —\nHe kindly stopped for me —\nThe Carriage held but just Ourselves —\nAnd Immortality."\n— Emily Dickinson',
      },
    ],
    artStyles: [
      {
        name: 'Impressionism',
        description: 'A radical break from academic painting, Impressionists painted outdoors ("en plein air"), capturing the fleeting effects of light and atmosphere with visible brushstrokes and vibrant, unmixed colors.',
        culturalContext: 'Photography, invented in 1839, had made realistic representation obsolete — why spend weeks painting a portrait when a camera could do it in seconds? This freed painters to explore what cameras couldn\'t capture: the subjective experience of a moment. Monet and Renoir painted the same scene repeatedly at different times of day, showing that "reality" was not fixed but constantly changing with the light. The art establishment was horrified.',
        exampleTitle: 'Impression, Sunrise',
        exampleArtist: 'Claude Monet',
      },
      {
        name: 'Post-Impressionism',
        description: 'Artists who pushed beyond Impressionism\'s focus on light, using bold colors, geometric forms, and emotional intensity to express inner vision rather than optical truth.',
        culturalContext: 'Van Gogh, Cézanne, and Gauguin each felt Impressionism was too focused on surface appearances. Van Gogh used swirling, thick paint to externalize his turbulent emotions. Cézanne tried to find the underlying geometric structure of nature, inadvertently laying the groundwork for Cubism. These artists were largely rejected in their lifetimes — Van Gogh sold only one painting — but they redefined what art could be.',
        exampleTitle: 'The Starry Night',
        exampleArtist: 'Vincent van Gogh',
      },
      {
        name: 'Art Nouveau',
        description: 'A decorative style characterized by flowing, organic lines inspired by natural forms — flowers, vines, insects, and the female body. It influenced everything from architecture to poster design.',
        culturalContext: 'Art Nouveau was a utopian attempt to reunite art with everyday life, erasing the boundary between "fine art" and "decorative art." Klimt\'s golden, pattern-filled paintings reflected Vienna at the height of its cultural brilliance — but also its anxiety. The Austro-Hungarian Empire was crumbling, Freud was revealing the unconscious, and Klimt\'s sensuous, psychologically charged art captured a civilization that was both dazzling and doomed.',
        exampleTitle: 'The Kiss',
        exampleArtist: 'Gustav Klimt',
      },
    ],
  },

  // === STAGE 7: THE MODERN AGE (1880-1960) ===
  {
    stage: 7,
    writingStyles: [
      {
        name: 'Stream of Consciousness',
        description: 'A narrative technique that attempts to capture the continuous flow of a character\'s thoughts, perceptions, and feelings, often without conventional punctuation or logical transitions.',
        culturalContext: 'World War I destroyed the 19th century\'s faith in progress, reason, and orderly narrative. Joyce and Woolf responded by abandoning traditional storytelling: if the world no longer made sense in neat plot lines, why should fiction? Stream of consciousness mirrored the chaos of modern life — the way thoughts actually flow, interrupted by memory, sensation, and association. It was literature\'s equivalent of Einstein\'s relativity: time and perspective were no longer fixed.',
        excerpt: '"yes and his heart was going like mad and yes I said yes I will Yes."\n— James Joyce, Ulysses (final lines)\n\n"Life is not a series of gig lamps symmetrically arranged; life is a luminous halo, a semi-transparent envelope surrounding us from the beginning of consciousness to the end."\n— Virginia Woolf, Modern Fiction',
      },
      {
        name: 'Existentialist Fiction',
        description: 'Fiction exploring the absurdity of human existence, the anxiety of freedom, and the search for meaning in a universe that offers none. Characters confront alienation, bureaucracy, and the impossibility of authentic life.',
        culturalContext: 'Kafka wrote in Prague as the Austro-Hungarian Empire was collapsing, a German-speaking Jew in a Czech city — alienated on every level. His nightmarish stories, where ordinary people are arrested without charge or wake up as insects, predicted the 20th century\'s horrors with uncanny accuracy. Kafka never intended to publish most of his work and asked his friend Max Brod to burn it all after his death. Brod refused, giving the world some of its most prophetic literature.',
        excerpt: '"Someone must have been telling lies about Josef K., he knew he had done nothing wrong but, one morning, he was arrested."\n— Franz Kafka, The Trial\n\n"One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin."\n— Franz Kafka, The Metamorphosis',
      },
      {
        name: 'Magical Realism',
        description: 'A style in which magical or fantastical elements appear in otherwise realistic settings, treated as entirely normal by the characters. Pioneered by Latin American writers, especially Borges.',
        culturalContext: 'Latin American writers lived in countries where reality itself seemed surreal — military dictatorships, extreme inequality, indigenous myths layered over colonial Catholicism. Borges created labyrinths, infinite libraries, and stories that fold in on themselves, reflecting a continent where European rationalism had been imposed on ancient cultures that understood time and reality differently. His influence on world literature is incalculable.',
        excerpt: '"The universe (which others call the Library) is composed of an indefinite, perhaps infinite number of hexagonal galleries. In the center of each gallery is a ventilation shaft, bounded by a low railing. From any hexagon one can see the floors above and below — one after another, endlessly."\n— Jorge Luis Borges, The Library of Babel',
      },
    ],
    artStyles: [
      {
        name: 'Cubism',
        description: 'Pioneered by Picasso and Braque, Cubism shattered objects into geometric fragments and showed multiple viewpoints simultaneously. It was the most revolutionary art movement since the Renaissance.',
        culturalContext: 'Cubism emerged just as Einstein was proving that space and time were relative, not absolute. Picasso\'s Les Demoiselles d\'Avignon (1907) — with its fractured bodies inspired by African masks — scandalized Paris. The movement reflected a world where old certainties were dissolving: the atom had been split, Freud had revealed the fractured self, and the empires that had seemed eternal were about to destroy each other in World War I.',
        exampleTitle: 'Les Demoiselles d\'Avignon',
        exampleArtist: 'Pablo Picasso',
      },
      {
        name: 'Surrealism',
        description: 'Art that drew on dreams, the unconscious mind, and irrational imagery. Influenced by Freud\'s psychoanalysis, Surrealists sought to liberate creativity from the control of reason.',
        culturalContext: 'After the senseless slaughter of World War I, many artists concluded that "rational" Western civilization was bankrupt. If reason produced machine guns and poison gas, perhaps the irrational — dreams, madness, desire — held more truth. Frida Kahlo\'s self-portraits, depicting her body broken and remade through pain and mythology, gave Surrealism an intensely personal and political dimension. Her art was inseparable from her experience as a disabled woman in revolutionary Mexico.',
        exampleTitle: 'The Two Fridas',
        exampleArtist: 'Frida Kahlo',
      },
      {
        name: 'Abstract Expressionism',
        description: 'The first major American art movement, characterized by large-scale canvases, spontaneous gesture, and the abandonment of recognizable subject matter. Pollock\'s drip paintings are the iconic example.',
        culturalContext: 'After World War II and the Holocaust, many artists felt that traditional representation was inadequate to express the scale of what had happened. Pollock\'s drip paintings — made by flinging paint at canvases laid on the floor — were acts of pure physical expression, the artist\'s body moving in space. The CIA secretly promoted Abstract Expressionism during the Cold War as proof of American creative freedom, making it both an artistic revolution and a weapon in the culture wars.',
        exampleTitle: 'Number 1A, 1948',
        exampleArtist: 'Jackson Pollock',
      },
    ],
  },
];

export function getEraStyles(stage: number): EraStyles | undefined {
  return eraStyles.find(e => e.stage === stage);
}
