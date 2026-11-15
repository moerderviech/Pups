import React, { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';

import { Button, Card, Chip, DateInput, Field, Muted, Screen, SectionTitle, Sheet, styles as ui } from '../components/ui';
import { countdownLabel, daysUntil, formatDate, isValidISO, todayISO } from '../lib/dates';
import { upcomingEvents } from '../lib/events';
import { newId, useStore } from '../lib/store';
import { colors, space } from '../theme';

const LEAD_OPTIONS: { days: number; label: string }[] = [
  { days: 60, label: '2 Monate' },
  { days: 42, label: '6 Wochen' },
  { days: 28, label: '4 Wochen' },
  { days: 14, label: '2 Wochen' },
  { days: 7, label: '1 Woche' },
  { days: 3, label: '3 Tage' },
  { days: 1, label: '1 Tag' },
  { days: 0, label: 'Am Tag selbst' },
];

export function Calendar() {
  const { state, update } = useStore();
  const today = todayISO();
  const events = upcomingEvents(state, today);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [yearly, setYearly] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState(false);
  const [anniversary, setAnniversary] = useState(state.anniversary);

  const addReminder = () => {
    update((s) => ({ ...s, reminders: [...s.reminders, { id: newId(), title: title.trim(), date, yearly }] }));
    setTitle('');
    setDate('');
    setYearly(false);
    setAdding(false);
  };

  const removeReminder = (eventId: string, eventTitle: string) => {
    const id = eventId.replace('custom:', '');
    Alert.alert('Termin löschen?', eventTitle, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => update((s) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) })) },
    ]);
  };

  const toggleLead = (days: number) =>
    update((s) => {
      const has = s.settings.leadDays.includes(days);
      const leadDays = has ? s.settings.leadDays.filter((d) => d !== days) : [...s.settings.leadDays, days].sort((a, b) => b - a);
      return { ...s, settings: { ...s.settings, leadDays } };
    });

  const validNewDate = isValidISO(date) && (yearly || date >= today);

  return (
    <Screen title="Termine" subtitle="Damit du an alles rechtzeitig denkst">
      {events.map((event) => {
        const days = daysUntil(event.date, today);
        return (
          <Card key={event.id} tone={days <= 14 && event.needsGift ? 'rose' : undefined}>
            <View style={ui.rowBetween}>
              <Text style={[ui.bold, { flex: 1, marginRight: space.sm }]}>
                {event.emoji} {event.title}
              </Text>
              <Text style={{ color: colors.roseDark, fontWeight: '700' }}>{countdownLabel(days)}</Text>
            </View>
            <Text style={[ui.muted, { marginTop: 4 }]}>{formatDate(event.date)}</Text>
            {event.kind === 'custom' && (
              <Button label="Löschen" small variant="danger" onPress={() => removeReminder(event.id, event.title)} style={{ alignSelf: 'flex-start', marginTop: space.sm }} />
            )}
          </Card>
        );
      })}

      <Button label="+ Eigenen Termin anlegen" onPress={() => setAdding(true)} style={{ marginTop: space.sm }} />
      <Button
        label={isValidISO(state.anniversary) ? `Jahrestag ändern (${formatDate(state.anniversary)})` : 'Jahrestag eintragen'}
        variant="secondary"
        onPress={() => {
          setAnniversary(state.anniversary);
          setEditingAnniversary(true);
        }}
        style={{ marginTop: space.sm }}
      />

      <SectionTitle>Wann möchtest du erinnert werden?</SectionTitle>
      <Muted style={{ marginBottom: space.sm }}>Gilt für Geburtstag und Jahrestag, damit genug Zeit für ein Geschenk bleibt.</Muted>
      <View style={ui.chipWrap}>
        {LEAD_OPTIONS.map((option) => (
          <Chip key={option.days} label={option.label} selected={state.settings.leadDays.includes(option.days)} onPress={() => toggleLead(option.days)} />
        ))}
      </View>
      {!state.settings.notifyReminders && <Muted>Erinnerungen sind gerade ausgeschaltet. Du kannst sie unter „Ich“ wieder einschalten.</Muted>}

      <Sheet visible={adding} title="Eigener Termin" onClose={() => setAdding(false)}>
        <Field label="Was steht an?" value={title} onChangeText={setTitle} placeholder="z. B. Prüfung: Glück wünschen!" maxLength={60} />
        <DateInput label="Datum" value={date} onChange={setDate} />
        {isValidISO(date) && !validNewDate ? <Text style={ui.error}>Das Datum liegt in der Vergangenheit.</Text> : null}
        <View style={[ui.rowBetween, { marginBottom: space.lg }]}>
          <Text style={ui.text}>Jedes Jahr wiederholen</Text>
          <Switch value={yearly} onValueChange={setYearly} trackColor={{ true: colors.rose }} />
        </View>
        <Button label="Termin speichern" onPress={addReminder} disabled={!title.trim() || !validNewDate} />
      </Sheet>

      <Sheet visible={editingAnniversary} title="Jahrestag" onClose={() => setEditingAnniversary(false)}>
        <Muted style={{ marginBottom: space.md }}>Seit wann seid ihr zusammen? Pups zählt die Tage und erinnert euch jedes Jahr.</Muted>
        <DateInput key={editingAnniversary ? 'open' : 'closed'} label="Seit wann seid ihr zusammen?" value={anniversary} onChange={setAnniversary} />
        {isValidISO(anniversary) && anniversary > today ? <Text style={ui.error}>Das Datum liegt in der Zukunft.</Text> : null}
        <Button
          label="Speichern"
          disabled={!isValidISO(anniversary) || anniversary > today}
          onPress={() => {
            update((s) => ({ ...s, anniversary }));
            setEditingAnniversary(false);
          }}
        />
        {isValidISO(state.anniversary) && (
          <Button
            label="Jahrestag entfernen"
            variant="danger"
            style={{ marginTop: space.sm }}
            onPress={() => {
              update((s) => ({ ...s, anniversary: '' }));
              setEditingAnniversary(false);
            }}
          />
        )}
      </Sheet>
    </Screen>
  );
}
