export type PhaseId = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  emoji: string;
  color: string;
  /** Kurzer Satz für die Karte auf dem Home-Bildschirm des Partners */
  partnerShort: string;
  /** Was im Körper passiert */
  biology: string;
  /** Text für die Frau selbst */
  forHer: string;
  /** Konkrete Tipps für den Partner */
  partnerTips: string[];
}

export const PHASES: Record<PhaseId, PhaseInfo> = {
  menstruation: {
    id: 'menstruation',
    name: 'Menstruation',
    emoji: '🩸',
    color: '#E8607D',
    partnerShort: 'Heute sind Wärme, Ruhe und Snacks gefragt.',
    biology:
      'Östrogen und Progesteron sind auf dem Tiefpunkt, die Gebärmutterschleimhaut wird abgestoßen. ' +
      'Viele haben Krämpfe, Rücken- oder Kopfschmerzen, sind müde und frieren schneller.',
    forHer:
      'Ruhe ist jetzt erlaubt. Wärme, leichte Bewegung wie Spazieren oder Yoga, eisenreiches Essen ' +
      'und viel Trinken können helfen.',
    partnerTips: [
      'Bring eine Wärmflasche oder einen Tee.',
      'Besorg den Lieblingssnack.',
      'Halte Pläne flexibel und biete einen Kuschelabend statt Party an.',
      'Übernimm ein paar Aufgaben im Haushalt.',
      'Nimm nicht jede Laune persönlich.',
    ],
  },
  follicular: {
    id: 'follicular',
    name: 'Follikelphase',
    emoji: '🌱',
    color: '#F2B84B',
    partnerShort: 'Viel Energie: gute Zeit für aktive Dates.',
    biology:
      'Das Östrogen steigt, im Eierstock reift ein Follikel heran. Viele fühlen sich jetzt ' +
      'energiegeladener, kreativer, geselliger und optimistischer.',
    forHer:
      'Eine gute Zeit für neue Projekte, intensiveren Sport und soziale Aktivitäten.',
    partnerTips: [
      'Plane ein aktives Date oder einen Ausflug.',
      'Probiert zusammen etwas Neues aus.',
      'Schmiedet gemeinsame Pläne, die Stimmung dafür ist gut.',
    ],
  },
  ovulation: {
    id: 'ovulation',
    name: 'Eisprung',
    emoji: '✨',
    color: '#4FB58D',
    partnerShort: 'Hochphase: Komplimente und ein schönes Date kommen gut an.',
    biology:
      'Ein LH-Anstieg löst den Eisprung aus, das Östrogen ist am höchsten. Häufig sind Energie, ' +
      'Selbstbewusstsein und Lust jetzt besonders groß. Manche spüren ein leichtes Ziehen im Unterbauch.',
    forHer:
      'Das sind die fruchtbarsten Tage des Zyklus. Die Angabe ist nur eine Schätzung und nicht ' +
      'zur Verhütung geeignet.',
    partnerTips: [
      'Mach Komplimente.',
      'Plane ein schönes Date.',
      'Genießt die gemeinsame Zeit.',
    ],
  },
  luteal: {
    id: 'luteal',
    name: 'Lutealphase',
    emoji: '🌙',
    color: '#8E7CC3',
    partnerShort: 'Etwas mehr Geduld, Gemütlichkeit und Lieblingssnacks.',
    biology:
      'Nach dem Eisprung bildet sich der Gelbkörper und produziert Progesteron, die Körpertemperatur ' +
      'steigt leicht. Gegen Ende fallen die Hormone wieder ab. In den letzten Tagen können ' +
      'PMS-Beschwerden auftreten: Müdigkeit, Reizbarkeit, Stimmungsschwankungen, Heißhunger, ' +
      'Wassereinlagerungen, Brustspannen und schlechterer Schlaf.',
    forHer:
      'Das Bedürfnis nach Rückzug und Gemütlichkeit ist normal. Regelmäßiges Essen, ' +
      'magnesiumreiche Lebensmittel, ausreichend Schlaf und ruhigere Bewegung können guttun.',
    partnerTips: [
      'Hab mehr Geduld und Verständnis.',
      'Nimm Gefühle ernst, statt sie auf die Hormone zu schieben.',
      'Bring die Lieblingssüßigkeit mit.',
      'Schlag einen gemütlichen Abend vor.',
      'Verschiebe Streitthemen, wenn es geht, auf später.',
      'Frag aktiv: „Was brauchst du gerade?“',
    ],
  },
};

export const CYCLE_DISCLAIMER =
  'Die Phasen sind Schätzungen. Jeder Körper ist anders und Zyklen schwanken. ' +
  'Pups ist kein Verhütungsmittel und ersetzt keine ärztliche Beratung.';
