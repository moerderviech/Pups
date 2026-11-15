import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, AppState as NativeAppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sheet } from './src/components/ui';
import { partnerCycleStatus } from './src/lib/derived';
import { rescheduleNotifications, setupNotifications } from './src/lib/notifications';
import { StoreProvider, useStore } from './src/lib/store';
import { ensureSlots } from './src/lib/tasks';
import { Book } from './src/screens/Book';
import { Calendar } from './src/screens/Calendar';
import { Connect } from './src/screens/Connect';
import { Cycle } from './src/screens/Cycle';
import { Home } from './src/screens/Home';
import { Me } from './src/screens/Me';
import { Onboarding } from './src/screens/Onboarding';
import { Tasks } from './src/screens/Tasks';
import { colors } from './src/theme';
import type { TabId } from './src/types';

setupNotifications();

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'book', label: 'Buch', emoji: '📖' },
  { id: 'tasks', label: 'Aufgaben', emoji: '✅' },
  { id: 'calendar', label: 'Termine', emoji: '📅' },
  { id: 'me', label: 'Ich', emoji: '🐭' },
];

function Main() {
  const { state, ready, update } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabId>('home');
  const [connectOpen, setConnectOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(false);
  const hasProfile = state.me !== null;

  // Aufgaben für heute, diese Woche und diesen Monat bereitstellen
  useEffect(() => {
    if (!ready || !hasProfile) return;
    const refresh = () =>
      update((s) => {
        const tasks = ensureSlots(s.tasks, s.partner, partnerCycleStatus(s)?.phase ?? null);
        return tasks === s.tasks ? s : { ...s, tasks };
      });
    refresh();
    const subscription = NativeAppState.addEventListener('change', (status) => {
      if (status === 'active') refresh();
    });
    return () => subscription.remove();
  }, [ready, hasProfile, update]);

  // Erinnerungen neu planen, sobald sich etwas Relevantes ändert
  const reminderKey = useMemo(
    () =>
      JSON.stringify([
        state.me?.name,
        state.partner?.name,
        state.partner?.birthday,
        state.partner?.cycle,
        state.anniversary,
        state.reminders,
        state.cycle,
        state.settings,
      ]),
    [state.me, state.partner, state.anniversary, state.reminders, state.cycle, state.settings]
  );
  useEffect(() => {
    if (!ready || !hasProfile) return;
    const timer = setTimeout(() => rescheduleNotifications(state), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, hasProfile, reminderKey]);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.rose} size="large" />
      </View>
    );
  }

  if (!hasProfile) return <Onboarding />;

  const openConnect = () => setConnectOpen(true);
  const openCycle = () => setCycleOpen(true);

  return (
    <View style={styles.root}>
      <View style={styles.root}>
        {tab === 'home' && <Home goTo={setTab} openConnect={openConnect} openCycle={openCycle} />}
        {tab === 'book' && <Book openConnect={openConnect} />}
        {tab === 'tasks' && <Tasks />}
        {tab === 'calendar' && <Calendar />}
        {tab === 'me' && <Me openConnect={openConnect} openCycle={openCycle} />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map((item) => {
          const active = item.id === tab;
          return (
            <Pressable
              key={item.id}
              onPress={() => setTab(item.id)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
            >
              <Text style={[styles.tabEmoji, { opacity: active ? 1 : 0.45 }]}>{item.emoji}</Text>
              <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Sheet visible={connectOpen} title="Partner verbinden" onClose={() => setConnectOpen(false)}>
        <Connect onDone={() => setConnectOpen(false)} />
      </Sheet>
      <Sheet visible={cycleOpen} title="Zyklus-Begleiter" onClose={() => setCycleOpen(false)}>
        <Cycle />
      </Sheet>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Main />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
  tabLabelActive: { color: colors.roseDark, fontWeight: '700' },
});
