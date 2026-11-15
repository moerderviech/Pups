import type { AppState } from '../types';
import { averageLength, cycleStatus } from './cycle';
import { addDays, ageFrom, isValidISO, nextYearly, todayISO } from './dates';

export type EventKind = 'birthday' | 'anniversary' | 'holiday' | 'custom' | 'period';

export interface PupsEvent {
  id: string;
  kind: EventKind;
  emoji: string;
  title: string;
  /** Nächstes Datum des Anlasses */
  date: string;
  /** Erinnerung mit langem Vorlauf (Geschenk besorgen) */
  needsGift: boolean;
}

/** Alle kommenden Anlässe, nach Datum sortiert */
export function upcomingEvents(state: AppState, today = todayISO()): PupsEvent[] {
  const events: PupsEvent[] = [];
  const { partner, anniversary, reminders, cycle } = state;

  if (partner && isValidISO(partner.birthday)) {
    const date = nextYearly(partner.birthday, today);
    const age = ageFrom(partner.birthday, date);
    events.push({
      id: 'birthday',
      kind: 'birthday',
      emoji: '🎂',
      title: `${partner.name} hat Geburtstag${age !== null ? ` (wird ${age})` : ''}`,
      date,
      needsGift: true,
    });
  }

  if (isValidISO(anniversary)) {
    const date = nextYearly(anniversary, today);
    const years = parseInt(date.slice(0, 4), 10) - parseInt(anniversary.slice(0, 4), 10);
    events.push({
      id: 'anniversary',
      kind: 'anniversary',
      emoji: '💞',
      title: years > 0 ? `Euer ${years}. Jahrestag` : 'Euer Jahrestag',
      date,
      needsGift: true,
    });
  }

  const year = today.slice(0, 4);
  events.push(
    { id: 'valentine', kind: 'holiday', emoji: '💘', title: 'Valentinstag', date: nextYearly(`${year}-02-14`, today), needsGift: false },
    { id: 'christmas', kind: 'holiday', emoji: '🎄', title: 'Weihnachten', date: nextYearly(`${year}-12-24`, today), needsGift: false }
  );

  for (const reminder of reminders) {
    if (!isValidISO(reminder.date)) continue;
    const date = reminder.yearly ? nextYearly(reminder.date, today) : reminder.date;
    if (date < today) continue;
    events.push({ id: `custom:${reminder.id}`, kind: 'custom', emoji: '📌', title: reminder.title, date, needsGift: false });
  }

  if (cycle.enabled && cycle.starts.length > 0) {
    const sorted = [...cycle.starts].sort();
    const status = cycleStatus(sorted[sorted.length - 1], averageLength(sorted), today);
    if (status && !status.overdue) {
      events.push({ id: 'period:me', kind: 'period', emoji: '🩸', title: 'Deine Periode (geschätzt)', date: status.nextStart, needsGift: false });
    }
  }

  if (partner?.cycle) {
    // Den nächsten erwarteten Beginn suchen, auch wenn der Stand vom Partner schon älter ist
    let next = addDays(partner.cycle.lastStart, partner.cycle.length);
    while (next < today) next = addDays(next, partner.cycle.length);
    events.push({ id: 'period:partner', kind: 'period', emoji: '🩸', title: `Periode von ${partner.name} (geschätzt)`, date: next, needsGift: false });
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
