export type Gender = 'female' | 'male' | 'diverse';

/** Vorlieben je Kategorie, z. B. { drinks: ['Cola', 'Iced Latte'] } */
export type Prefs = Record<string, string[]>;

export interface Profile {
  name: string;
  /** ISO-Datum JJJJ-MM-TT */
  birthday: string;
  gender: Gender;
  /** Hex-Farbe, z. B. #E8607D */
  color: string;
  prefs: Prefs;
  dislikes: string;
  sizes: string;
}

export type CycleShare = 'none' | 'phase' | 'tips';

export interface CycleState {
  enabled: boolean;
  /** Erste Periodentage als ISO-Datum, aufsteigend sortiert */
  starts: string[];
  share: CycleShare;
}

/** Was der Partner über den Zyklus sehen darf (kommt über die Einladung) */
export interface SharedCycle {
  lastStart: string;
  length: number;
  share: Exclude<CycleShare, 'none'>;
}

export interface Partner extends Profile {
  cycle?: SharedCycle;
  /** Wann der Stand vom Partner übernommen wurde (ISO-Zeitstempel) */
  receivedAt: string;
}

export interface BookEntry {
  id: string;
  categoryId: string;
  title: string;
  note: string;
  imageIds: string[];
  /** Nur für mich sichtbar (z. B. Überraschungsplanung) */
  isPrivate: boolean;
  createdAt: string;
}

export interface BookCategory {
  id: string;
  name: string;
  emoji: string;
  custom?: boolean;
}

export type GiftStatus = 'idea' | 'bought' | 'given';

export interface Gift {
  id: string;
  title: string;
  note: string;
  link: string;
  price: string;
  occasion: string;
  imageId?: string;
  status: GiftStatus;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  /** ISO-Datum JJJJ-MM-TT */
  date: string;
  yearly: boolean;
}

export type TaskPeriod = 'daily' | 'weekly' | 'monthly';

export interface TaskSlot {
  /** Schlüssel des Zeitraums: Tag (JJJJ-MM-TT), Woche (Montag) oder Monat (JJJJ-MM) */
  key: string;
  taskId: string;
  done: boolean;
  swapped: boolean;
}

export interface TaskState {
  daily?: TaskSlot;
  weekly?: TaskSlot;
  monthly?: TaskSlot;
  hearts: number;
  streak: number;
  /** Letzter Tag, an dem die Tagesaufgabe erledigt wurde */
  lastDailyDone?: string;
  doneCount: number;
}

export interface Settings {
  notifyTasks: boolean;
  notifyReminders: boolean;
  /** Vorlaufzeiten für Geburtstag & Jahrestag in Tagen */
  leadDays: number[];
}

export interface AppState {
  version: 1;
  me: Profile | null;
  partner: Partner | null;
  /** Jahrestag als ISO-Datum */
  anniversary: string;
  entries: BookEntry[];
  customCategories: BookCategory[];
  gifts: Gift[];
  reminders: Reminder[];
  cycle: CycleState;
  tasks: TaskState;
  settings: Settings;
}

export type TabId = 'home' | 'book' | 'tasks' | 'calendar' | 'me';
