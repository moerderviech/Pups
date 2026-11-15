import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Muted, Screen, styles as ui } from '../components/ui';
import { HEARTS } from '../data/tasks';
import { partnerCycleStatus } from '../lib/derived';
import { useStore } from '../lib/store';
import { completeTask, swapTask, taskText } from '../lib/tasks';
import { colors, space } from '../theme';
import type { TaskPeriod } from '../types';

const PERIODS: { id: TaskPeriod; title: string; emoji: string; tone: 'sun' | 'lavender' | 'mint'; swapHint: string }[] = [
  { id: 'daily', title: 'Heute', emoji: '☀️', tone: 'sun', swapHint: 'heute' },
  { id: 'weekly', title: 'Diese Woche', emoji: '📅', tone: 'lavender', swapHint: 'diese Woche' },
  { id: 'monthly', title: 'Diesen Monat', emoji: '🌟', tone: 'mint', swapHint: 'diesen Monat' },
];

export function Tasks() {
  const { state, update } = useStore();
  const { tasks, partner } = state;
  const phase = partnerCycleStatus(state)?.phase ?? null;

  return (
    <Screen title="Aufgaben" subtitle={partner ? `Kleine Freuden für ${partner.name}` : 'Kleine Freuden für deinen Lieblingsmenschen'}>
      <View style={[ui.row, { marginBottom: space.md }]}>
        <Card style={{ flex: 1, marginRight: space.sm, alignItems: 'center' }}>
          <Text style={styles.number}>{tasks.hearts} 💗</Text>
          <Text style={ui.muted}>Herzen</Text>
        </Card>
        <Card style={{ flex: 1, marginRight: space.sm, alignItems: 'center' }}>
          <Text style={styles.number}>{tasks.streak} 🔥</Text>
          <Text style={ui.muted}>Tage in Folge</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.number}>{tasks.doneCount} ✅</Text>
          <Text style={ui.muted}>Erledigt</Text>
        </Card>
      </View>

      {PERIODS.map((period) => {
        const slot = tasks[period.id];
        if (!slot) return null;
        return (
          <Card key={period.id} tone={period.tone}>
            <View style={ui.rowBetween}>
              <Text style={ui.bold}>
                {period.emoji} {period.title}
              </Text>
              <Text style={ui.muted}>+{HEARTS[period.id]} 💗</Text>
            </View>
            <Text style={[ui.text, { marginVertical: space.md, fontSize: 18, lineHeight: 26 }]}>{taskText(period.id, slot, partner)}</Text>
            {slot.done ? (
              <Text style={{ color: colors.mintDark, fontWeight: '700', fontSize: 16 }}>✅ Erledigt. Schön gemacht!</Text>
            ) : (
              <View style={ui.row}>
                <Button label="Erledigt" onPress={() => update((s) => ({ ...s, tasks: completeTask(s.tasks, period.id) }))} style={{ flex: 1 }} />
                {!slot.swapped && (
                  <Button
                    label="Tauschen"
                    variant="secondary"
                    onPress={() => update((s) => ({ ...s, tasks: swapTask(s.tasks, period.id, s.partner, phase) }))}
                    style={{ marginLeft: space.sm }}
                  />
                )}
              </View>
            )}
            {!slot.done && slot.swapped && <Muted style={{ marginTop: space.sm }}>Du hast {period.swapHint} schon einmal getauscht.</Muted>}
          </Card>
        );
      })}

      <Muted style={{ marginTop: space.sm }}>
        Ein Pausentag ist kein Problem: Deine Serie endet erst, wenn du zwei Tage hintereinander keine Tagesaufgabe erledigst.
      </Muted>
    </Screen>
  );
}

const styles = {
  number: { fontSize: 20, fontWeight: '800' as const, color: colors.ink, marginBottom: 2 },
};
