import type { PhaseId } from '../data/cycle';
import { HEARTS, TASKS, type TaskTemplate } from '../data/tasks';
import type { Partner, TaskPeriod, TaskSlot, TaskState } from '../types';
import { diffDays, monthKey, todayISO, weekKey } from './dates';

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickFrom(list: string[] | undefined, seed: string): string | null {
  if (!list || list.length === 0) return null;
  return list[hash(seed) % list.length];
}

export function periodKey(period: TaskPeriod, today = todayISO()): string {
  if (period === 'daily') return today;
  if (period === 'weekly') return weekKey(today);
  return monthKey(today);
}

function isUsable(task: TaskTemplate, partner: Partner | null, phase: PhaseId | null): boolean {
  if (task.needs && !(partner?.prefs[task.needs]?.length)) return false;
  if (task.phases && (!phase || !task.phases.includes(phase))) return false;
  return true;
}

/** Wählt eine Aufgabe für den Zeitraum. Dieselbe Eingabe ergibt dieselbe Aufgabe. */
export function chooseTask(
  period: TaskPeriod,
  key: string,
  partner: Partner | null,
  phase: PhaseId | null,
  excludeId?: string
): string {
  const usable = TASKS[period].filter((t) => isUsable(t, partner, phase) && t.id !== excludeId);
  // Passt eine Aufgabe zur aktuellen Zyklusphase, bekommt sie Vorrang (jeden zweiten Tag)
  const phaseTasks = usable.filter((t) => t.phases);
  const seed = `${period}:${key}:${excludeId ?? ''}`;
  if (phaseTasks.length > 0 && hash(seed + ':phase') % 2 === 0) {
    return phaseTasks[hash(seed) % phaseTasks.length].id;
  }
  const pool = usable.filter((t) => !t.phases);
  const list = pool.length > 0 ? pool : usable;
  return list[hash(seed) % list.length].id;
}

/** Füllt die Platzhalter mit den Vorlieben des Partners */
export function taskText(period: TaskPeriod, slot: TaskSlot, partner: Partner | null): string {
  const template = TASKS[period].find((t) => t.id === slot.taskId) ?? TASKS[period][0];
  const name = partner?.name ?? 'deinem Lieblingsmenschen';
  const seed = `${slot.key}:${slot.taskId}`;
  const fill = (prefId: string, fallback: string) => pickFrom(partner?.prefs[prefId], seed) ?? fallback;
  return template.text
    .replace(/\{name\}/g, name)
    .replace('{drink}', fill('drinks', 'etwas Leckeres'))
    .replace('{sweet}', fill('sweets', 'etwas Süßes'))
    .replace('{food}', fill('food', 'etwas Leckeres'))
    .replace('{flower}', fill('flowers', 'ein schöner Strauß'))
    .replace('{date}', fill('dates', 'etwas Schönes'));
}

/** Sorgt dafür, dass es für heute, diese Woche und diesen Monat eine Aufgabe gibt */
export function ensureSlots(
  tasks: TaskState,
  partner: Partner | null,
  phase: PhaseId | null,
  today = todayISO()
): TaskState {
  let next = tasks;
  (['daily', 'weekly', 'monthly'] as TaskPeriod[]).forEach((period) => {
    const key = periodKey(period, today);
    if (next[period]?.key !== key) {
      next = {
        ...next,
        [period]: { key, taskId: chooseTask(period, key, partner, phase), done: false, swapped: false },
      };
    }
  });
  // Ein Pausentag ist erlaubt, danach beginnt die Serie neu
  if (next.streak > 0 && next.lastDailyDone && diffDays(next.lastDailyDone, today) > 2) {
    next = { ...next, streak: 0 };
  }
  return next;
}

export function completeTask(tasks: TaskState, period: TaskPeriod, today = todayISO()): TaskState {
  const slot = tasks[period];
  if (!slot || slot.done) return tasks;
  const next: TaskState = {
    ...tasks,
    [period]: { ...slot, done: true },
    hearts: tasks.hearts + HEARTS[period],
    doneCount: tasks.doneCount + 1,
  };
  if (period === 'daily') {
    next.streak = tasks.lastDailyDone === today ? tasks.streak : tasks.streak + 1;
    next.lastDailyDone = today;
  }
  return next;
}

export function swapTask(
  tasks: TaskState,
  period: TaskPeriod,
  partner: Partner | null,
  phase: PhaseId | null
): TaskState {
  const slot = tasks[period];
  if (!slot || slot.done || slot.swapped) return tasks;
  return {
    ...tasks,
    [period]: { ...slot, taskId: chooseTask(period, slot.key, partner, phase, slot.taskId), swapped: true },
  };
}
