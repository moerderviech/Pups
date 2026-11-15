import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { AppState } from '../types';
import { addDays, parseISO, todayISO } from './dates';
import { upcomingEvents } from './events';

/**
 * Lokale Erinnerungen auf dem eigenen Gerät. Sie brauchen keinen Server.
 * iOS erlaubt höchstens 64 geplante Benachrichtigungen pro App.
 */

const MAX_SCHEDULED = 50;
const HOUR = 9;

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

export function setupNotifications(): void {
  if (!supported) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn('Pups: Benachrichtigungen nicht verfügbar', error);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!supported) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch (error) {
    console.warn('Pups: Berechtigung konnte nicht abgefragt werden', error);
    return false;
  }
}

function leadText(days: number): string {
  if (days === 0) return 'Heute';
  if (days === 1) return 'Morgen';
  if (days % 30 === 0) return days === 30 ? 'In einem Monat' : `In ${days / 30} Monaten`;
  if (days % 7 === 0) return days === 7 ? 'In einer Woche' : `In ${days / 7} Wochen`;
  return `In ${days} Tagen`;
}

/** Plant alle Erinnerungen neu. Wird aufgerufen, sobald sich etwas Relevantes ändert. */
export async function rescheduleNotifications(state: AppState): Promise<void> {
  if (!supported || !state.me) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) return;

    const today = todayISO();
    const now = Date.now();
    const planned: { date: Date; title: string; body: string }[] = [];

    if (state.settings.notifyReminders) {
      for (const event of upcomingEvents(state, today)) {
        if (event.kind === 'holiday') continue;
        const leads = event.needsGift ? state.settings.leadDays : event.kind === 'period' ? [2] : [1, 0];
        for (const lead of leads) {
          const date = parseISO(addDays(event.date, -lead));
          date.setHours(HOUR, 0, 0, 0);
          if (date.getTime() <= now) continue;
          const giftHint = event.needsGift && lead >= 3 ? ' Schau mal aufs Geschenke-Board, bevor es knapp wird.' : '';
          planned.push({
            date,
            title: `${event.emoji} ${leadText(lead)}: ${event.title}`,
            body: lead === 0 ? 'Heute ist es so weit!' : `Denk rechtzeitig daran.${giftHint}`,
          });
        }
      }
    }

    planned.sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const item of planned.slice(0, MAX_SCHEDULED)) {
      await Notifications.scheduleNotificationAsync({
        content: { title: item.title, body: item.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: item.date },
      });
    }

    if (state.settings.notifyTasks) {
      const name = state.partner?.name;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🐭 Deine Tagesaufgabe wartet',
          body: name ? `Mach ${name} heute eine kleine Freude.` : 'Schau kurz bei Pups vorbei.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: HOUR, minute: 0 },
      });
    }
  } catch (error) {
    console.warn('Pups: Erinnerungen konnten nicht geplant werden', error);
  }
}
