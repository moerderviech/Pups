import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Mascot, type MascotMood } from '../components/Mascot';
import { Button, Card, Screen, styles as ui } from '../components/ui';
import { PHASES } from '../data/cycle';
import { countdownLabel, daysUntil, diffDays, formatDate, isValidISO, todayISO } from '../lib/dates';
import { myCycleStatus, partnerCycleStatus } from '../lib/derived';
import { upcomingEvents } from '../lib/events';
import { useStore } from '../lib/store';
import { taskText } from '../lib/tasks';
import { colors, space } from '../theme';
import type { TabId } from '../types';

interface Props {
  goTo: (tab: TabId) => void;
  openConnect: () => void;
  openCycle: () => void;
}

export function Home({ goTo, openConnect, openCycle }: Props) {
  const { state } = useStore();
  const { me, partner, tasks, anniversary } = state;
  if (!me) return null;

  const today = todayISO();
  const partnerCycle = partnerCycleStatus(state, today);
  const ownCycle = myCycleStatus(state, today);
  const nextEvent = upcomingEvents(state, today).find((event) => event.kind !== 'period');
  const daily = tasks.daily;

  const shown = partner ?? me;
  const mood: MascotMood = partnerCycle
    ? partnerCycle.phase === 'menstruation'
      ? 'period'
      : partnerCycle.phase === 'luteal' && partnerCycle.daysToNext <= 5
        ? 'cozy'
        : 'normal'
    : 'normal';

  const together = isValidISO(anniversary) ? diffDays(anniversary, today) : null;

  return (
    <Screen>
      <Text style={[ui.muted, { textAlign: 'center' }]}>{formatDate(today)}</Text>
      <Text style={[ui.screenTitle, { textAlign: 'center' }]}>{partner ? partner.name : `Hallo ${me.name}`}</Text>
      {together !== null && together >= 0 && (
        <Text style={{ textAlign: 'center', color: colors.roseDark, fontWeight: '700' }}>
          Seit {together} {together === 1 ? 'Tag' : 'Tagen'} zusammen 💗
        </Text>
      )}

      <View style={{ alignItems: 'center', marginVertical: space.md }}>
        <Mascot gender={shown.gender} color={shown.color} mood={partner ? mood : 'normal'} size={230} />
      </View>

      {!partner && (
        <Card tone="rose">
          <Text style={ui.bold}>Noch allein hier?</Text>
          <Text style={[ui.muted, { marginVertical: space.sm }]}>
            Verbinde dich mit deinem Partner oder deiner Partnerin. Dann zieht hier das Maskottchen deines Lieblingsmenschen ein.
          </Text>
          <Button label="Partner verbinden" onPress={openConnect} />
        </Card>
      )}

      {partner && partnerCycle && (
        <Pressable onPress={openCycle} accessibilityRole="button">
          <Card tone="lavender">
            <Text style={ui.bold}>
              {PHASES[partnerCycle.phase].emoji} {PHASES[partnerCycle.phase].name}, Tag {partnerCycle.day}
            </Text>
            <Text style={[ui.muted, { marginTop: 4 }]}>{PHASES[partnerCycle.phase].partnerShort}</Text>
            {partner.cycle?.share === 'tips' && <Text style={styles.link}>Tipps ansehen</Text>}
          </Card>
        </Pressable>
      )}

      {ownCycle && (
        <Pressable onPress={openCycle} accessibilityRole="button">
          <Card tone="lavender">
            <Text style={ui.bold}>
              {PHASES[ownCycle.phase].emoji} Dein Zyklus: {PHASES[ownCycle.phase].name}, Tag {ownCycle.day}
            </Text>
            <Text style={[ui.muted, { marginTop: 4 }]}>
              {ownCycle.overdue
                ? 'Deine Periode ist später dran als berechnet.'
                : `Nächste Periode voraussichtlich ${countdownLabel(ownCycle.daysToNext)}.`}
            </Text>
          </Card>
        </Pressable>
      )}

      {daily && (
        <Pressable onPress={() => goTo('tasks')} accessibilityRole="button">
          <Card tone="sun">
            <Text style={ui.bold}>{daily.done ? '✅ Tagesaufgabe erledigt' : '☀️ Tagesaufgabe'}</Text>
            <Text style={[ui.text, { marginTop: 4 }]}>{taskText('daily', daily, partner)}</Text>
            <Text style={[ui.muted, { marginTop: 6 }]}>
              {tasks.hearts} 💗{tasks.streak > 0 ? `  ·  ${tasks.streak} 🔥 in Folge` : ''}
            </Text>
          </Card>
        </Pressable>
      )}

      {nextEvent && (
        <Pressable onPress={() => goTo('calendar')} accessibilityRole="button">
          <Card tone="rose">
            <Text style={ui.bold}>
              {nextEvent.emoji} {nextEvent.title}
            </Text>
            <Text style={[ui.muted, { marginTop: 4 }]}>
              {countdownLabel(daysUntil(nextEvent.date, today))} · {formatDate(nextEvent.date)}
            </Text>
          </Card>
        </Pressable>
      )}

      {partner && <Button label={`Buch über ${partner.name} öffnen`} variant="secondary" onPress={() => goTo('book')} />}
    </Screen>
  );
}

const styles = {
  link: { color: colors.lavenderDark, fontWeight: '700' as const, marginTop: space.sm },
};
