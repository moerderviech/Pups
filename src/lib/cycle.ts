import type { PhaseId } from '../data/cycle';
import { addDays, diffDays, todayISO } from './dates';

export const DEFAULT_CYCLE_LENGTH = 28;
const PERIOD_DAYS = 5;

/** Durchschnittliche Zykluslänge aus den letzten Einträgen (Standard: 28 Tage) */
export function averageLength(starts: string[]): number {
  const sorted = [...starts].sort();
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = diffDays(sorted[i - 1], sorted[i]);
    // Ausreißer (vergessene Einträge) ignorieren
    if (gap >= 18 && gap <= 45) gaps.push(gap);
  }
  const recent = gaps.slice(-6);
  if (recent.length === 0) return DEFAULT_CYCLE_LENGTH;
  return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
}

export interface CycleStatus {
  /** Zyklustag, beginnend bei 1 */
  day: number;
  length: number;
  phase: PhaseId;
  /** Erwarteter Beginn der nächsten Periode */
  nextStart: string;
  daysToNext: number;
  /** Periode ist später dran als berechnet */
  overdue: boolean;
}

export function cycleStatus(lastStart: string, length: number, today = todayISO()): CycleStatus | null {
  const day = diffDays(lastStart, today) + 1;
  if (day < 1) return null;
  const nextStart = addDays(lastStart, length);
  const daysToNext = diffDays(today, nextStart);
  const overdue = day > length;

  // Der Eisprung liegt etwa 14 Tage vor der nächsten Periode
  const ovulationDay = Math.max(PERIOD_DAYS + 3, length - 14);
  let phase: PhaseId;
  if (day <= PERIOD_DAYS) phase = 'menstruation';
  else if (day < ovulationDay - 1) phase = 'follicular';
  else if (day <= ovulationDay + 1) phase = 'ovulation';
  else phase = 'luteal';

  return { day, length, phase, nextStart, daysToNext, overdue };
}
