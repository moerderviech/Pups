import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { isValidISO, makeISO } from '../lib/dates';
import { loadImage } from '../lib/images';
import { colors, radius, shadow, space } from '../theme';

/* ---------- Layout ---------- */

export function Screen({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.lg, paddingBottom: space.xl * 2 }}
      keyboardShouldPersistTaps="handled"
    >
      {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, tone }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'rose' | 'lavender' | 'mint' | 'sun' }) {
  const background =
    tone === 'rose' ? colors.roseLight : tone === 'lavender' ? colors.lavender : tone === 'mint' ? colors.mint : tone === 'sun' ? colors.sun : colors.card;
  return <View style={[styles.card, { backgroundColor: background }, tone ? null : shadow, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Muted({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Text style={styles.muted}>{children}</Text>
    </View>
  );
}

/* ---------- Buttons ---------- */

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', disabled, small, style }: ButtonProps) {
  const background =
    variant === 'primary' ? colors.rose : variant === 'secondary' ? colors.roseLight : variant === 'danger' ? '#FBE9E7' : 'transparent';
  const textColor = variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? colors.danger : colors.roseDark;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        small ? styles.buttonSmall : null,
        { backgroundColor: background, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        style,
      ]}
    >
      <Text style={[styles.buttonText, small ? styles.buttonTextSmall : null, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Auswahl-Chips ---------- */

export function Chip({ label, selected, onPress, dashed }: { label: string; selected?: boolean; onPress?: () => void; dashed?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected: !!selected }}
      style={[styles.chip, selected ? styles.chipSelected : null, dashed ? styles.chipDashed : null]}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : null, dashed ? { color: colors.roseDark } : null]}>{label}</Text>
    </Pressable>
  );
}

interface ChipPickerProps {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

/** Vorschläge zum Antippen plus eigene Einträge über „+ Andere“ */
export function ChipPicker({ options, selected, onChange }: ChipPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const custom = selected.filter((value) => !options.includes(value));
  const all = [...options, ...custom];

  const toggle = (value: string) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  const addCustom = () => {
    const value = draft.trim();
    if (value && !selected.some((v) => v.toLowerCase() === value.toLowerCase())) {
      const existing = options.find((o) => o.toLowerCase() === value.toLowerCase());
      onChange([...selected, existing ?? value]);
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <View>
      <View style={styles.chipWrap}>
        {all.map((option) => (
          <Chip key={option} label={option} selected={selected.includes(option)} onPress={() => toggle(option)} />
        ))}
        {!adding && <Chip label="+ Andere" dashed onPress={() => setAdding(true)} />}
      </View>
      {adding && (
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={draft}
            onChangeText={setDraft}
            placeholder="Eigener Eintrag"
            placeholderTextColor={colors.muted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={addCustom}
            maxLength={40}
          />
          <Button label="Hinzufügen" small onPress={addCustom} style={{ marginLeft: space.sm }} />
        </View>
      )}
    </View>
  );
}

/* ---------- Eingabefelder ---------- */

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: space.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, props.multiline ? { minHeight: 84, textAlignVertical: 'top' } : null, props.style]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

interface DateInputProps {
  label: string;
  /** ISO-Datum oder leer */
  value: string;
  onChange: (iso: string) => void;
}

/** Datum als Tag, Monat, Jahr. Meldet erst ein Ergebnis, wenn das Datum gültig ist. */
export function DateInput({ label, value, onChange }: DateInputProps) {
  const initial = isValidISO(value) ? value.split('-') : ['', '', ''];
  const [day, setDay] = useState(initial[2] ? String(parseInt(initial[2], 10)) : '');
  const [month, setMonth] = useState(initial[1] ? String(parseInt(initial[1], 10)) : '');
  const [year, setYear] = useState(initial[0]);

  const emit = (d: string, m: string, y: string) => {
    const iso = makeISO(parseInt(d, 10), parseInt(m, 10), parseInt(y, 10));
    onChange(y.length === 4 && iso ? iso : '');
  };
  const digits = (text: string) => text.replace(/[^0-9]/g, '');
  const complete = day !== '' && month !== '' && year.length === 4;

  return (
    <View style={{ marginBottom: space.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.dateSmall]}
          value={day}
          onChangeText={(t) => { const v = digits(t); setDay(v); emit(v, month, year); }}
          placeholder="TT"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={2}
          accessibilityLabel={`${label}: Tag`}
        />
        <TextInput
          style={[styles.input, styles.dateSmall]}
          value={month}
          onChangeText={(t) => { const v = digits(t); setMonth(v); emit(day, v, year); }}
          placeholder="MM"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={2}
          accessibilityLabel={`${label}: Monat`}
        />
        <TextInput
          style={[styles.input, styles.dateYear]}
          value={year}
          onChangeText={(t) => { const v = digits(t); setYear(v); emit(day, month, v); }}
          placeholder="JJJJ"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={4}
          accessibilityLabel={`${label}: Jahr`}
        />
      </View>
      {complete && !isValidISO(value) ? <Text style={styles.error}>Dieses Datum gibt es nicht.</Text> : null}
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active ? styles.segmentActive : null]}
          >
            <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Sheet (Seite, die von unten hereinfährt) ---------- */

interface SheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Sheet({ visible, title, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaProvider>
        <SheetBody title={title} onClose={onClose}>
          {children}
        </SheetBody>
      </SafeAreaProvider>
    </Modal>
  );
}

function SheetBody({ title, onClose, children }: Omit<SheetProps, 'visible'>) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.sheetHeader, Platform.OS === 'android' ? { paddingTop: insets.top + space.md } : null]}>
        <Text style={styles.sheetTitle} numberOfLines={1}>{title}</Text>
        <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Schließen">
          <Text style={styles.sheetClose}>Schließen</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingBottom: insets.bottom + space.xl * 2 }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Gespeicherte Bilder ---------- */

export function StoredImage({ id, style }: { id: string; style?: StyleProp<ViewStyle> }) {
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    loadImage(id).then((result) => {
      if (active) setUri(result);
    });
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <View style={[styles.imageBox, style]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenTitle: { fontSize: 30, fontWeight: '800', color: colors.ink, marginBottom: 2 },
  screenSubtitle: { fontSize: 15, color: colors.muted, marginBottom: space.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: space.xl, marginBottom: space.sm },
  card: { borderRadius: radius.md, padding: space.lg, marginBottom: space.md },
  muted: { fontSize: 14, lineHeight: 20, color: colors.muted },
  text: { fontSize: 16, lineHeight: 23, color: colors.ink },
  bold: { fontSize: 16, fontWeight: '700', color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  button: { borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  buttonSmall: { paddingVertical: 9, paddingHorizontal: 14 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  buttonTextSmall: { fontSize: 14 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: space.sm },
  chip: { borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingVertical: 8, paddingHorizontal: 14, margin: 4 },
  chipSelected: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipDashed: { borderStyle: 'dashed', borderColor: colors.rose },
  chipText: { fontSize: 15, color: colors.ink },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', color: colors.muted, marginBottom: 6 },
  input: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.ink },
  dateSmall: { width: 64, marginRight: space.sm, textAlign: 'center' },
  dateYear: { width: 92, textAlign: 'center' },
  error: { color: colors.danger, fontSize: 13, marginTop: 4 },
  segmented: { flexDirection: 'row', backgroundColor: colors.lavender, borderRadius: radius.pill, padding: 4, marginBottom: space.md },
  segment: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.card },
  segmentText: { fontSize: 14, color: colors.muted, fontWeight: '600' },
  segmentTextActive: { color: colors.ink },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.card },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, flex: 1, marginRight: space.md },
  sheetClose: { fontSize: 16, fontWeight: '700', color: colors.roseDark },
  imageBox: { backgroundColor: colors.lavender, borderRadius: radius.sm, overflow: 'hidden' },
});
