import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Mascot } from '../components/Mascot';
import { Button, ChipPicker, DateInput, Field, Screen, Segmented, styles as ui } from '../components/ui';
import { COLOR_OPTIONS, PREF_CATEGORIES } from '../data/options';
import { isValidISO, todayISO } from '../lib/dates';
import { requestNotificationPermission } from '../lib/notifications';
import { useStore } from '../lib/store';
import { colors, space } from '../theme';
import type { Gender, Prefs } from '../types';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Weiblich' },
  { value: 'male', label: 'Männlich' },
  { value: 'diverse', label: 'Divers' },
];

export function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
      {COLOR_OPTIONS.map((option) => {
        const active = option.hex === value;
        return (
          <Pressable
            key={option.hex}
            onPress={() => onChange(option.hex)}
            accessibilityRole="button"
            accessibilityLabel={option.name}
            accessibilityState={{ selected: active }}
            style={{ alignItems: 'center', width: '25%', paddingVertical: space.sm }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: option.hex,
                borderWidth: active ? 4 : 1.5,
                borderColor: active ? colors.ink : colors.line,
              }}
            />
            <Text style={{ fontSize: 13, marginTop: 4, color: active ? colors.ink : colors.muted, fontWeight: active ? '700' : '400' }}>
              {option.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const onboardingPrefs = PREF_CATEGORIES.filter((category) => category.onboarding);
const STEP_COUNT = 3 + onboardingPrefs.length;

export function Onboarding() {
  const { update } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [color, setColor] = useState(COLOR_OPTIONS[0].hex);
  const [prefs, setPrefs] = useState<Prefs>({});

  const birthdayOk = isValidISO(birthday) && birthday <= todayISO();
  const canContinue = step !== 1 || (name.trim().length > 0 && birthdayOk);

  const finish = () => {
    update((state) => ({
      ...state,
      me: { name: name.trim(), birthday, gender, color, prefs, dislikes: '', sizes: '' },
    }));
    requestNotificationPermission();
  };

  const next = () => (step === STEP_COUNT - 1 ? finish() : setStep(step + 1));
  const prefCategory = step >= 3 ? onboardingPrefs[step - 3] : null;

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: space.lg }}>
        <Mascot gender={step === 0 ? 'male' : gender} color={color} size={step === 0 ? 220 : 130} />
      </View>

      {step === 0 && (
        <View style={{ alignItems: 'center' }}>
          <Text style={[ui.screenTitle, { marginTop: space.lg }]}>Willkommen bei Pups</Text>
          <Text style={[ui.text, { textAlign: 'center', color: colors.muted, marginVertical: space.md }]}>
            Lerne deinen Lieblingsmenschen noch besser kennen, denk an alles Wichtige und mach ihm jeden Tag eine kleine Freude.
          </Text>
        </View>
      )}

      {step === 1 && (
        <View>
          <Text style={[ui.sectionTitle, { marginTop: space.lg }]}>Erzähl uns von dir</Text>
          <Field label="Name oder Spitzname" value={name} onChangeText={setName} placeholder="Wie nennt man dich?" maxLength={40} autoCapitalize="words" />
          <DateInput label="Geburtstag" value={birthday} onChange={setBirthday} />
          {isValidISO(birthday) && !birthdayOk ? <Text style={ui.error}>Der Geburtstag liegt in der Zukunft.</Text> : null}
          <Text style={ui.label}>Geschlecht</Text>
          <Segmented options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={[ui.sectionTitle, { marginTop: space.lg }]}>Deine Lieblingsfarbe</Text>
          <ColorPicker value={color} onChange={setColor} />
        </View>
      )}

      {prefCategory && (
        <View>
          <Text style={[ui.sectionTitle, { marginTop: space.lg }]}>
            {prefCategory.emoji} {prefCategory.label}
          </Text>
          <Text style={[ui.muted, { marginBottom: space.md }]}>Tippe alles an, was du magst. Über „+ Andere“ legst du Eigenes an.</Text>
          <ChipPicker
            options={prefCategory.options}
            selected={prefs[prefCategory.id] ?? []}
            onChange={(values) => setPrefs({ ...prefs, [prefCategory.id]: values })}
          />
        </View>
      )}

      <View style={{ marginTop: space.xl }}>
        <Button label={step === 0 ? "Los geht's" : step === STEP_COUNT - 1 ? 'Fertig' : 'Weiter'} onPress={next} disabled={!canContinue} />
        {step > 0 && <Button label="Zurück" variant="ghost" onPress={() => setStep(step - 1)} style={{ marginTop: space.sm }} />}
      </View>
      {step > 0 && (
        <Text style={[ui.muted, { textAlign: 'center', marginTop: space.md }]}>
          Schritt {step} von {STEP_COUNT - 1}
        </Text>
      )}
    </Screen>
  );
}
