import React, { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { Button, Card, ChipPicker, DateInput, Field, Muted, Screen, SectionTitle, Segmented, Sheet, styles as ui } from '../components/ui';
import { colorName, PREF_CATEGORIES } from '../data/options';
import { ageFrom, formatDate, isValidISO, todayISO } from '../lib/dates';
import { requestNotificationPermission } from '../lib/notifications';
import { useStore } from '../lib/store';
import { colors, space } from '../theme';
import type { Gender, Prefs, Profile } from '../types';
import { ColorPicker, GENDER_OPTIONS } from './Onboarding';

function ProfileEditor({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { update } = useStore();
  const [name, setName] = useState(profile.name);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [color, setColor] = useState(profile.color);
  const [prefs, setPrefs] = useState<Prefs>(profile.prefs);
  const [dislikes, setDislikes] = useState(profile.dislikes);
  const [sizes, setSizes] = useState(profile.sizes);

  const birthdayOk = isValidISO(birthday) && birthday <= todayISO();

  const save = () => {
    update((s) => ({ ...s, me: { name: name.trim(), birthday, gender, color, prefs, dislikes: dislikes.trim(), sizes: sizes.trim() } }));
    onDone();
  };

  return (
    <View>
      <Field label="Name oder Spitzname" value={name} onChangeText={setName} maxLength={40} autoCapitalize="words" />
      <DateInput label="Geburtstag" value={birthday} onChange={setBirthday} />
      <Text style={ui.label}>Geschlecht</Text>
      <Segmented options={GENDER_OPTIONS} value={gender} onChange={setGender} />
      <Text style={ui.label}>Lieblingsfarbe</Text>
      <ColorPicker value={color} onChange={setColor} />

      {PREF_CATEGORIES.map((category) => (
        <View key={category.id}>
          <SectionTitle>
            {category.emoji} {category.label}
          </SectionTitle>
          <ChipPicker
            options={category.options}
            selected={prefs[category.id] ?? []}
            onChange={(values) => setPrefs({ ...prefs, [category.id]: values })}
          />
        </View>
      ))}

      <SectionTitle>Gut zu wissen</SectionTitle>
      <Field label="Größen (Kleidung, Schuhe, Ring)" value={sizes} onChangeText={setSizes} placeholder="z. B. Oberteile M, Schuhe 39, Ring 54" multiline maxLength={200} />
      <Field label="Mag ich nicht, Allergien" value={dislikes} onChangeText={setDislikes} placeholder="z. B. keine Nüsse, keine Lilien" multiline maxLength={300} />

      <Button label="Speichern" onPress={save} disabled={!name.trim() || !birthdayOk} />
    </View>
  );
}

interface Props {
  openConnect: () => void;
  openCycle: () => void;
}

export function Me({ openConnect, openCycle }: Props) {
  const { state, update, reset } = useStore();
  const { me, partner, settings } = state;
  const [editing, setEditing] = useState(false);
  if (!me) return null;

  const age = ageFrom(me.birthday);
  const filledPrefs = PREF_CATEGORIES.filter((category) => (me.prefs[category.id]?.length ?? 0) > 0).length;

  const setNotify = async (key: 'notifyTasks' | 'notifyReminders', value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Benachrichtigungen sind aus', 'Erlaube Pups in den iPhone-Einstellungen, Mitteilungen zu senden.');
        return;
      }
    }
    update((s) => ({ ...s, settings: { ...s.settings, [key]: value } }));
  };

  const disconnect = () =>
    Alert.alert(`Verbindung zu ${partner?.name} lösen?`, 'Das Profil deines Partners wird von diesem Handy entfernt. Deine eigenen Einträge im Buch bleiben erhalten.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Verbindung lösen', style: 'destructive', onPress: () => update((s) => ({ ...s, partner: null })) },
    ]);

  const deleteAll = () =>
    Alert.alert('Wirklich alles löschen?', 'Dein Profil, das Buch, alle Bilder, Geschenkideen, Termine und Zyklusdaten werden von diesem Handy gelöscht. Das lässt sich nicht rückgängig machen.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Alles löschen', style: 'destructive', onPress: () => reset() },
    ]);

  return (
    <Screen title="Ich">
      <Card style={{ alignItems: 'center' }}>
        <Mascot gender={me.gender} color={me.color} size={130} />
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: space.sm }}>{me.name}</Text>
        <Text style={ui.muted}>
          {formatDate(me.birthday)}
          {age !== null ? ` · ${age} Jahre` : ''} · Lieblingsfarbe {colorName(me.color)}
        </Text>
        <Text style={[ui.muted, { marginTop: 2 }]}>
          {filledPrefs} von {PREF_CATEGORIES.length} Vorlieben-Bereichen ausgefüllt
        </Text>
        <Button label="Profil bearbeiten" variant="secondary" onPress={() => setEditing(true)} style={{ marginTop: space.md, alignSelf: 'stretch' }} />
      </Card>

      <SectionTitle>Partner</SectionTitle>
      <Card>
        {partner ? (
          <View>
            <Text style={ui.bold}>Verbunden mit {partner.name} 💗</Text>
            <Muted style={{ marginVertical: space.sm }}>Stand vom {formatDate(partner.receivedAt.slice(0, 10))}</Muted>
            <Button label="Code zeigen oder Stand aktualisieren" onPress={openConnect} />
            <Button label="Verbindung lösen" variant="danger" onPress={disconnect} style={{ marginTop: space.sm }} />
          </View>
        ) : (
          <View>
            <Text style={ui.text}>Du bist noch mit niemandem verbunden.</Text>
            <Button label="Partner verbinden" onPress={openConnect} style={{ marginTop: space.md }} />
          </View>
        )}
      </Card>

      <SectionTitle>Zyklus</SectionTitle>
      <Card>
        <Text style={ui.text}>
          {state.cycle.enabled ? 'Dein Zyklus-Begleiter ist eingeschaltet.' : 'Phasen verstehen und wissen, was gerade guttut.'}
        </Text>
        <Button label="Zyklus-Begleiter öffnen" variant="secondary" onPress={openCycle} style={{ marginTop: space.md }} />
      </Card>

      <SectionTitle>Benachrichtigungen</SectionTitle>
      <Card>
        <View style={ui.rowBetween}>
          <Text style={[ui.text, { flex: 1 }]}>Tagesaufgabe um 9 Uhr</Text>
          <Switch value={settings.notifyTasks} onValueChange={(value) => setNotify('notifyTasks', value)} trackColor={{ true: colors.rose }} />
        </View>
        <View style={[ui.rowBetween, { marginTop: space.md }]}>
          <Text style={[ui.text, { flex: 1 }]}>Geburtstag, Jahrestag und Termine</Text>
          <Switch value={settings.notifyReminders} onValueChange={(value) => setNotify('notifyReminders', value)} trackColor={{ true: colors.rose }} />
        </View>
      </Card>

      <SectionTitle>Deine Daten</SectionTitle>
      <Card>
        <Muted style={{ marginBottom: space.md }}>
          Alles, was du in Pups einträgst, liegt nur auf diesem Handy. Dein Partner bekommt dein Profil ausschließlich über deinen Einladungscode.
        </Muted>
        <Button label="Alle Daten löschen" variant="danger" onPress={deleteAll} />
      </Card>

      <Sheet visible={editing} title="Profil bearbeiten" onClose={() => setEditing(false)}>
        <ProfileEditor profile={me} onDone={() => setEditing(false)} />
      </Sheet>
    </Screen>
  );
}
