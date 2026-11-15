import type { AppState } from '../types';
import { averageLength, cycleStatus, type CycleStatus } from './cycle';
import { addDays, todayISO } from './dates';

/** Eigener Zyklusstand, falls der Zyklus-Begleiter aktiv ist */
export function myCycleStatus(state: AppState, today = todayISO()): CycleStatus | null {
  const { cycle } = state;
  if (!cycle.enabled || cycle.starts.length === 0) return null;
  const sorted = [...cycle.starts].sort();
  return cycleStatus(sorted[sorted.length - 1], averageLength(sorted), today);
}

/**
 * Zyklusstand des Partners aus dem zuletzt geteilten Stand.
 * Ist der Stand älter als ein Zyklus, wird mit der Durchschnittslänge weitergerechnet.
 */
export function partnerCycleStatus(state: AppState, today = todayISO()): CycleStatus | null {
  const shared = state.partner?.cycle;
  if (!shared) return null;
  let start = shared.lastStart;
  while (addDays(start, shared.length) <= today) start = addDays(start, shared.length);
  return cycleStatus(start, shared.length, today);
}
