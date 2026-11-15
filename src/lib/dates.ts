/** Alle Datumswerte werden als lokales ISO-Datum JJJJ-MM-TT gespeichert. */

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

/** Lokale Mitternacht des ISO-Datums */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map((p) => parseInt(p, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function isValidISO(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = parseISO(iso);
  return toISO(d) === iso;
}

export function makeISO(day: number, month: number, year: number): string | null {
  if (!day || !month || !year || year < 1900 || year > 2200) return null;
  const iso = `${year}-${pad(month)}-${pad(day)}`;
  return isValidISO(iso) ? iso : null;
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

/** Ganze Tage von a bis b (b - a) */
export function diffDays(a: string, b: string): number {
  const ms = parseISO(b).getTime() - parseISO(a).getTime();
  return Math.round(ms / 86400000);
}

export function formatDate(iso: string, withYear = true): string {
  if (!isValidISO(iso)) return '';
  const d = parseISO(iso);
  const base = `${d.getDate()}. ${MONTHS[d.getMonth()]}`;
  return withYear ? `${base} ${d.getFullYear()}` : base;
}

export function formatShort(iso: string): string {
  if (!isValidISO(iso)) return '';
  const d = parseISO(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function ageFrom(birthday: string, today = todayISO()): number | null {
  if (!isValidISO(birthday)) return null;
  const b = parseISO(birthday);
  const t = parseISO(today);
  let age = t.getFullYear() - b.getFullYear();
  const hadBirthday =
    t.getMonth() > b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() >= b.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

/** Nächstes jährliches Vorkommen (heute zählt mit) */
export function nextYearly(iso: string, today = todayISO()): string {
  const src = parseISO(iso);
  const t = parseISO(today);
  const build = (year: number): string => {
    const d = new Date(year, src.getMonth(), src.getDate());
    // 29. Februar in Nicht-Schaltjahren: auf den 28. legen
    if (d.getMonth() !== src.getMonth()) d.setDate(0);
    return toISO(d);
  };
  const thisYear = build(t.getFullYear());
  return thisYear >= today ? thisYear : build(t.getFullYear() + 1);
}

export function daysUntil(iso: string, today = todayISO()): number {
  return diffDays(today, iso);
}

export function countdownLabel(days: number): string {
  if (days === 0) return 'Heute';
  if (days === 1) return 'Morgen';
  if (days < 0) return `vor ${-days} Tagen`;
  return `in ${days} Tagen`;
}

/** Montag der Woche als Schlüssel */
export function weekKey(today = todayISO()): string {
  const d = parseISO(today);
  const weekday = (d.getDay() + 6) % 7; // Montag = 0
  return addDays(today, -weekday);
}

export function monthKey(today = todayISO()): string {
  return today.slice(0, 7);
}
