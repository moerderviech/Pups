import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Button, Card, DateInput, Muted, SectionTitle, Segmented, styles as ui } from '../components/ui';
import { CYCLE_DISCLAIMER, PHASES } from '../data/cycle';
import type { CycleStatus } from '../lib/cycle';
import { averageLength } from '../lib/cycle';
import { countdownLabel, formatDate, isValidISO, todayISO } from '../lib/dates';
import { myCycleStatus, partnerCycleStatus } from '../lib/derived';
import { useStore } from '../lib/store';
import { colors, space } from '../theme';
import type { CycleShare } from '../types';

const SHARE_OPTIONS: { value: CycleShare; label: string }[] = [
  { value: 'none', label: 'Nichts' },
  { value: 'phase', label: 'Nur Phase' },
  { value: 'tips', label: 'Phase + Tipps' },
];

function PhaseHeader({ status }: { status: CycleStatus }) {
  const phase = PHASES[status.phase];
  return (
    <View style={{ borderLeftWidth: 5, borderLeftColor: phase.color, paddingLeft: space.md, marginBottom: space.md }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink }}>
        {phase.emoji} {phase.name}
      </Text>
      <Text style={ui.muted}>
        Zyklustag {status.day} von etwa {status.length}
      </Text>
    </View>
  );
}

/** Ansicht für den Partner: Erklärung und Tipps zur aktuellen Phase */
function PartnerView() {
  const { state } = useStore();
  const partner = state.partner;
  const status = partnerCycleStatus(state);
  if (!partner?.cycle || !status) return null;
  const phase = PHASES[status.phase];

  return (
    <View>
      <SectionTitle>Zyklus von {partner.name}</SectionTitle>
      <Card>
        <PhaseHeader status={status} />
        <Text style={ui.label}>Was gerade im Körper passiert</Text>
        <Text style={ui.text}>{phase.biology}</Text>
        <Text style={[ui.muted, { marginTop: space.md }]}>
          Nächste Periode voraussichtlich {countdownLabel(status.daysToNext)} ({formatDate(status.nextStart, false)}).
        </Text>
      </Card>

      {partner.cycle.share === 'tips' && (
        <Card tone="mint">
          <Text style={[ui.bold, { marginBottom: space.sm }]}>So kannst du {partner.name} jetzt unterstützen</Text>
          {phase.partnerTips.map((tip) => (
            <Text key={tip} style={[ui.text, { marginBottom: 6 }]}>
              • {tip}
            </Text>
          ))}
        </Card>
      )}
      <Muted>
        Stand vom {formatDate(partner.receivedAt.slice(0, 10))}. Für einen neuen Stand scannt ihr den Code von {partner.name} noch einmal.
      </Muted>
    </View>
  );
}

/** Eigene Ansicht: Periodenbeginn eintragen, Phase lesen, Freigabe festlegen */
function OwnView() {
  const { state, update } = useStore();
  const { cycle, partner } = state;
  const today = todayISO();
  const status = myCycleStatus(state, today);
  const [pickingDate, setPickingDate] = useState(false);
  const [date, setDate] = useState('');
  const sorted = [...cycle.starts].sort().reverse();

  const addStart = (iso: string) =>
    update((s) => (s.cycle.starts.includes(iso) ? s : { ...s, cycle: { ...s.cycle, starts: [...s.cycle.starts, iso].sort() } }));

  const removeStart = (iso: string) =>
    Alert.alert('Eintrag löschen?', formatDate(iso), [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => update((s) => ({ ...s, cycle: { ...s.cycle, starts: s.cycle.starts.filter((d) => d !== iso) } })) },
    ]);

  const disable = () =>
    Alert.alert('Zyklus-Begleiter ausschalten?', 'Alle Zyklus-Einträge werden von diesem Gerät gelöscht.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Ausschalten', style: 'destructive', onPress: () => update((s) => ({ ...s, cycle: { enabled: false, starts: [], share: 'none' } })) },
    ]);

  if (!cycle.enabled) {
    return (
      <View>
        <SectionTitle>Dein Zyklus-Begleiter</SectionTitle>
        <Card>
          <Text style={ui.text}>
            Trag den ersten Tag deiner Periode ein. Pups schätzt daraus deine Zyklusphase und erklärt, was sie für dich bedeutet.
          </Text>
          <Text style={[ui.muted, { marginVertical: space.md }]}>
            Zyklusdaten sind Gesundheitsdaten. Sie bleiben auf deinem Handy. Du entscheidest selbst, ob und was dein Partner davon sieht, und kannst
            es jederzeit zurücknehmen.
          </Text>
          <Button label="Einverstanden, Zyklus-Begleiter einschalten" onPress={() => update((s) => ({ ...s, cycle: { ...s.cycle, enabled: true } }))} />
        </Card>
      </View>
    );
  }

  const phase = status ? PHASES[status.phase] : null;

  return (
    <View>
      <SectionTitle>Dein Zyklus</SectionTitle>
      <Card>
        {status && phase ? (
          <View>
            <PhaseHeader status={status} />
            <Text style={[ui.muted, { marginBottom: space.md }]}>
              {status.overdue
                ? 'Deine Periode ist später dran als berechnet. Trag den Beginn ein, sobald sie da ist.'
                : `Nächste Periode voraussichtlich ${countdownLabel(status.daysToNext)} (${formatDate(status.nextStart, false)}).`}
            </Text>
          </View>
        ) : (
          <Text style={[ui.text, { marginBottom: space.md }]}>Trag den ersten Tag deiner letzten Periode ein, dann geht es los.</Text>
        )}
        <Button label="Periode hat heute begonnen" onPress={() => addStart(today)} disabled={cycle.starts.includes(today)} />
        {pickingDate ? (
          <View style={{ marginTop: space.md }}>
            <DateInput label="Erster Tag der Periode" value={date} onChange={setDate} />
            {isValidISO(date) && date > today ? <Text style={ui.error}>Das Datum liegt in der Zukunft.</Text> : null}
            <Button
              label="Eintragen"
              variant="secondary"
              disabled={!isValidISO(date) || date > today}
              onPress={() => {
                addStart(date);
                setDate('');
                setPickingDate(false);
              }}
            />
          </View>
        ) : (
          <Button label="Anderes Datum eintragen" variant="ghost" onPress={() => setPickingDate(true)} style={{ marginTop: space.sm }} />
        )}
      </Card>

      {phase && (
        <Card tone="lavender">
          <Text style={ui.label}>Was gerade in deinem Körper passiert</Text>
          <Text style={ui.text}>{phase.biology}</Text>
          <Text style={[ui.label, { marginTop: space.md }]}>Was dir jetzt guttun kann</Text>
          <Text style={ui.text}>{phase.forHer}</Text>
        </Card>
      )}

      <Card>
        <Text style={[ui.bold, { marginBottom: 4 }]}>Was darf {partner?.name ?? 'dein Partner'} sehen?</Text>
        <Muted style={{ marginBottom: space.md }}>Du kannst das jederzeit ändern.</Muted>
        <Segmented options={SHARE_OPTIONS} value={cycle.share} onChange={(share) => update((s) => ({ ...s, cycle: { ...s.cycle, share } }))} />
        <Muted>
          {cycle.share === 'none'
            ? 'Dein Zyklus ist nicht Teil deines Einladungscodes.'
            : 'Der Stand steckt in deinem Einladungscode. Lass deinen Partner den Code unter „Ich“ neu scannen, damit er den aktuellen Stand bekommt.'}
        </Muted>
      </Card>

      {sorted.length > 0 && (
        <Card>
          <Text style={[ui.bold, { marginBottom: space.sm }]}>Bisherige Einträge</Text>
          <Muted style={{ marginBottom: space.sm }}>Durchschnittliche Zykluslänge: {averageLength(cycle.starts)} Tage</Muted>
          {sorted.slice(0, 12).map((iso) => (
            <View key={iso} style={[ui.rowBetween, { paddingVertical: 6 }]}>
              <Text style={ui.text}>{formatDate(iso)}</Text>
              <Button label="Löschen" small variant="ghost" onPress={() => removeStart(iso)} />
            </View>
          ))}
        </Card>
      )}

      <Button label="Zyklus-Begleiter ausschalten" variant="danger" onPress={disable} />
    </View>
  );
}

export function Cycle() {
  const { state } = useStore();
  const showOwn = state.cycle.enabled || state.me?.gender !== 'male';
  const hasPartnerCycle = !!state.partner?.cycle;

  return (
    <View>
      {hasPartnerCycle && <PartnerView />}
      {showOwn && <OwnView />}
      {!hasPartnerCycle && !showOwn && (
        <Card>
          <Text style={ui.text}>
            {state.partner
              ? `${state.partner.name} teilt gerade keinen Zyklus mit dir. Sobald das freigegeben ist und ihr den Code neu scannt, findest du hier die aktuelle Phase mit Erklärung und Tipps.`
              : 'Sobald deine Partnerin ihren Zyklus mit dir teilt, findest du hier die aktuelle Phase mit Erklärung und Tipps.'}
          </Text>
        </Card>
      )}
      <Muted style={{ marginTop: space.lg }}>{CYCLE_DISCLAIMER}</Muted>
    </View>
  );
}
