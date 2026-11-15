import type { BookCategory } from '../types';

export interface PrefCategory {
  id: string;
  label: string;
  emoji: string;
  /** In welchem Kapitel des Partner-Buchs die Vorliebe erscheint */
  bookCategoryId: string;
  /** Wird schon beim ersten Einrichten abgefragt */
  onboarding?: boolean;
  options: string[];
}

export const PREF_CATEGORIES: PrefCategory[] = [
  {
    id: 'drinks',
    label: 'Lieblingsgetränke',
    emoji: '🥤',
    bookCategoryId: 'food',
    onboarding: true,
    options: [
      'Cola', 'Cola Zero', 'Red Bull', 'Eistee', 'Iced Latte', 'Cappuccino', 'Matcha Latte',
      'Bubble Tea', 'Apfelschorle', 'Spezi', 'Kakao', 'Tee', 'Wasser mit Sprudel',
      'Aperol Spritz', 'Hugo', 'Bier', 'Wein',
    ],
  },
  {
    id: 'sweets',
    label: 'Lieblingssüßigkeiten',
    emoji: '🍬',
    bookCategoryId: 'food',
    onboarding: true,
    options: [
      'Gummibärchen', 'Saure Schlangen', 'Vollmilchschokolade', 'Zartbitterschokolade',
      'Weiße Schokolade', 'Kinder Bueno', 'Kinderschokolade', 'Schokoriegel', 'Lakritz',
      'Chips', 'Popcorn', 'Eis', 'Kekse', 'Macarons', 'Donuts',
    ],
  },
  {
    id: 'food',
    label: 'Lieblingsessen',
    emoji: '🍝',
    bookCategoryId: 'food',
    options: [
      'Pizza', 'Pasta', 'Sushi', 'Burger', 'Döner', 'Ramen', 'Curry', 'Tacos', 'Salat',
      'Pommes', 'Schnitzel', 'Pfannkuchen', 'Lasagne',
    ],
  },
  {
    id: 'flowers',
    label: 'Lieblingsblumen',
    emoji: '💐',
    bookCategoryId: 'style',
    options: ['Rosen', 'Tulpen', 'Pfingstrosen', 'Sonnenblumen', 'Lilien', 'Gänseblümchen', 'Orchideen', 'Trockenblumen'],
  },
  {
    id: 'hobbies',
    label: 'Hobbys',
    emoji: '🎨',
    bookCategoryId: 'fun',
    options: [
      'Gaming', 'Lesen', 'Kochen', 'Backen', 'Fitness', 'Wandern', 'Fotografie', 'Zeichnen',
      'Musik machen', 'Tanzen', 'Reisen', 'Serien schauen', 'Fußball', 'Yoga', 'Basteln',
    ],
  },
  {
    id: 'music',
    label: 'Musik',
    emoji: '🎧',
    bookCategoryId: 'fun',
    options: ['Pop', 'Rock', 'Hip-Hop', 'Indie', 'Techno', 'K-Pop', 'Metal', 'Klassik', 'Jazz', 'Deutschrap', 'Schlager'],
  },
  {
    id: 'dates',
    label: 'Lieblings-Dates',
    emoji: '💞',
    bookCategoryId: 'love',
    options: [
      'Kino', 'Essen gehen', 'Picknick', 'Spaziergang', 'Filmabend zu Hause', 'Zusammen kochen',
      'Spieleabend', 'Konzert', 'Museum', 'Wellness', 'Städtetrip', 'Bowling', 'Freizeitpark',
    ],
  },
  {
    id: 'comfort',
    label: 'Das tut mir gut, wenn es mir schlecht geht',
    emoji: '🫶',
    bookCategoryId: 'love',
    options: [
      'Kuscheln', 'In Ruhe gelassen werden', 'Zuhören', 'Ablenkung', 'Lieblingsessen',
      'Wärmflasche', 'Ein Spaziergang', 'Lieblingsserie', 'Eine Umarmung', 'Schokolade',
    ],
  },
];

export const COLOR_OPTIONS: { name: string; hex: string }[] = [
  { name: 'Rosa', hex: '#E8607D' },
  { name: 'Rot', hex: '#D7263D' },
  { name: 'Orange', hex: '#F28C28' },
  { name: 'Gelb', hex: '#F2C230' },
  { name: 'Grün', hex: '#4FB58D' },
  { name: 'Türkis', hex: '#2BB3B1' },
  { name: 'Blau', hex: '#3F7FD9' },
  { name: 'Lila', hex: '#8E7CC3' },
  { name: 'Braun', hex: '#9C6B4A' },
  { name: 'Schwarz', hex: '#2B2433' },
  { name: 'Weiß', hex: '#F4F1F6' },
  { name: 'Beige', hex: '#E3D2BC' },
];

export function colorName(hex: string): string {
  return COLOR_OPTIONS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex;
}

export const BOOK_CATEGORIES: BookCategory[] = [
  { id: 'about', name: 'Über', emoji: '🐭' },
  { id: 'food', name: 'Essen & Trinken', emoji: '🍓' },
  { id: 'style', name: 'Stil & Farben', emoji: '🎀' },
  { id: 'fun', name: 'Freizeit', emoji: '🎮' },
  { id: 'dislikes', name: 'Mag ich nicht', emoji: '🙅' },
  { id: 'love', name: 'Liebessprache', emoji: '💗' },
  { id: 'moments', name: 'Unsere Momente', emoji: '📸' },
];

export const GIFT_OCCASIONS = ['Geburtstag', 'Weihnachten', 'Jahrestag', 'Valentinstag', 'Einfach so'];
