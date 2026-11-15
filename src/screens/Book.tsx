import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { Button, Card, Chip, Field, Muted, Screen, Sheet, StoredImage, styles as ui } from '../components/ui';
import { BOOK_CATEGORIES, colorName, PREF_CATEGORIES } from '../data/options';
import { ageFrom, formatDate, isValidISO } from '../lib/dates';
import { deleteImages, pickFromLibrary, takePhoto } from '../lib/images';
import { newId, useStore } from '../lib/store';
import { colors, radius, shadow, space } from '../theme';
import type { BookCategory, BookEntry, Profile } from '../types';
import { Gifts } from './Gifts';

const GENDER_LABEL = { female: 'Weiblich', male: 'Männlich', diverse: 'Divers' } as const;

/** Was das Profil des Partners zu einem Kapitel beiträgt */
function ProfileFacts({ profile, categoryId }: { profile: Profile; categoryId: string }) {
  const prefBlocks = PREF_CATEGORIES.filter(
    (category) => category.bookCategoryId === categoryId && (profile.prefs[category.id]?.length ?? 0) > 0
  );
  const age = ageFrom(profile.birthday);
  const rows: { label: string; value: string }[] = [];
  if (categoryId === 'about') {
    rows.push({ label: 'Name', value: profile.name });
    if (isValidISO(profile.birthday)) {
      rows.push({ label: 'Geburtstag', value: `${formatDate(profile.birthday)}${age !== null ? ` (${age} Jahre)` : ''}` });
    }
    rows.push({ label: 'Geschlecht', value: GENDER_LABEL[profile.gender] });
    if (profile.sizes.trim()) rows.push({ label: 'Größen', value: profile.sizes.trim() });
  }
  if (categoryId === 'style') rows.push({ label: 'Lieblingsfarbe', value: colorName(profile.color) });
  if (categoryId === 'dislikes' && profile.dislikes.trim()) {
    rows.push({ label: 'Mag ich nicht, Allergien', value: profile.dislikes.trim() });
  }
  if (rows.length === 0 && prefBlocks.length === 0) return null;

  return (
    <Card>
      <Text style={[ui.muted, { marginBottom: space.sm }]}>Von {profile.name} selbst eingetragen</Text>
      {rows.map((row) => (
        <View key={row.label} style={{ marginBottom: space.sm }}>
          <Text style={ui.label}>{row.label}</Text>
          <View style={ui.row}>
            {row.label === 'Lieblingsfarbe' && (
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: profile.color, marginRight: 8, borderWidth: 1, borderColor: colors.line }} />
            )}
            <Text style={ui.text}>{row.value}</Text>
          </View>
        </View>
      ))}
      {prefBlocks.map((category) => (
        <View key={category.id} style={{ marginBottom: space.sm }}>
          <Text style={ui.label}>
            {category.emoji} {category.label}
          </Text>
          <View style={ui.chipWrap}>
            {(profile.prefs[category.id] ?? []).map((value) => (
              <Chip key={value} label={value} />
            ))}
          </View>
        </View>
      ))}
    </Card>
  );
}

interface EditorProps {
  categoryId: string;
  entry?: BookEntry;
  onDone: () => void;
}

function EntryEditor({ categoryId, entry, onDone }: EditorProps) {
  const { update } = useStore();
  const [title, setTitle] = useState(entry?.title ?? '');
  const [note, setNote] = useState(entry?.note ?? '');
  const [imageIds, setImageIds] = useState<string[]>(entry?.imageIds ?? []);

  const addImage = async (fromCamera: boolean) => {
    const id = fromCamera ? await takePhoto() : await pickFromLibrary();
    if (id) setImageIds((current) => [...current, id]);
  };

  const save = () => {
    const removed = (entry?.imageIds ?? []).filter((id) => !imageIds.includes(id));
    deleteImages(removed);
    update((state) => {
      if (entry) {
        return {
          ...state,
          entries: state.entries.map((e) => (e.id === entry.id ? { ...e, title: title.trim(), note: note.trim(), imageIds } : e)),
        };
      }
      const created: BookEntry = {
        id: newId(),
        categoryId,
        title: title.trim(),
        note: note.trim(),
        imageIds,
        isPrivate: false,
        createdAt: new Date().toISOString(),
      };
      return { ...state, entries: [created, ...state.entries] };
    });
    onDone();
  };

  const cancel = () => {
    // Neu hinzugefügte Bilder wieder entfernen
    deleteImages(imageIds.filter((id) => !(entry?.imageIds ?? []).includes(id)));
    onDone();
  };

  return (
    <Card>
      <Text style={[ui.bold, { marginBottom: space.md }]}>{entry ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</Text>
      <Field label="Titel" value={title} onChangeText={setTitle} placeholder="z. B. Lieblingsrestaurant" maxLength={80} />
      <Field label="Notiz" value={note} onChangeText={setNote} placeholder="Was möchtest du dir merken?" multiline maxLength={1000} />
      {imageIds.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: space.md }}>
          {imageIds.map((id) => (
            <Pressable
              key={id}
              onPress={() => setImageIds((current) => current.filter((x) => x !== id))}
              accessibilityRole="button"
              accessibilityLabel="Bild entfernen"
            >
              <StoredImage id={id} style={{ width: 92, height: 92, marginRight: space.sm }} />
              <View style={styles.removeBadge}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>×</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <View style={[ui.row, { marginBottom: space.md }]}>
        <Button label="Bild auswählen" small variant="secondary" onPress={() => addImage(false)} />
        <Button label="Foto aufnehmen" small variant="secondary" onPress={() => addImage(true)} style={{ marginLeft: space.sm }} />
      </View>
      <Button label="Speichern" onPress={save} disabled={!title.trim() && !note.trim() && imageIds.length === 0} />
      <Button label="Abbrechen" variant="ghost" onPress={cancel} style={{ marginTop: space.sm }} />
    </Card>
  );
}

function CategoryContent({ category, profile }: { category: BookCategory; profile: Profile }) {
  const { state, update } = useStore();
  const [editing, setEditing] = useState<BookEntry | 'new' | null>(null);
  const entries = state.entries.filter((entry) => entry.categoryId === category.id);

  const remove = (entry: BookEntry) =>
    Alert.alert('Eintrag löschen?', 'Der Eintrag und seine Bilder werden entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          deleteImages(entry.imageIds);
          update((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== entry.id) }));
        },
      },
    ]);

  const removeCategory = () =>
    Alert.alert('Kapitel löschen?', 'Alle Einträge in diesem Kapitel werden entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          deleteImages(entries.flatMap((entry) => entry.imageIds));
          update((s) => ({
            ...s,
            entries: s.entries.filter((e) => e.categoryId !== category.id),
            customCategories: s.customCategories.filter((c) => c.id !== category.id),
          }));
        },
      },
    ]);

  return (
    <View>
      <ProfileFacts profile={profile} categoryId={category.id} />

      {editing === 'new' ? (
        <EntryEditor categoryId={category.id} onDone={() => setEditing(null)} />
      ) : (
        <Button label="+ Eintrag hinzufügen" onPress={() => setEditing('new')} style={{ marginBottom: space.md }} />
      )}

      {entries.length === 0 && !editing && (
        <Muted style={{ marginTop: space.sm }}>
          Hier ist noch nichts von dir. Trag ein, was dir an {profile.name} auffällt.
        </Muted>
      )}

      {entries.map((entry) =>
        editing !== 'new' && editing?.id === entry.id ? (
          <EntryEditor key={entry.id} categoryId={category.id} entry={entry} onDone={() => setEditing(null)} />
        ) : (
        <Card key={entry.id}>
          <Text style={[ui.muted, { marginBottom: 4 }]}>Von dir entdeckt · {formatDate(entry.createdAt.slice(0, 10))}</Text>
          {entry.title ? <Text style={ui.bold}>{entry.title}</Text> : null}
          {entry.note ? <Text style={[ui.text, { marginTop: 4 }]}>{entry.note}</Text> : null}
          {entry.imageIds.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: space.sm }}>
              {entry.imageIds.map((id) => (
                <StoredImage key={id} id={id} style={{ width: 150, height: 150, marginRight: space.sm }} />
              ))}
            </ScrollView>
          )}
          <View style={[ui.row, { marginTop: space.md }]}>
            <Button label="Bearbeiten" small variant="secondary" onPress={() => setEditing(entry)} />
            <Button label="Löschen" small variant="danger" onPress={() => remove(entry)} style={{ marginLeft: space.sm }} />
          </View>
        </Card>
        )
      )}

      {category.custom && <Button label="Kapitel löschen" variant="danger" onPress={removeCategory} style={{ marginTop: space.lg }} />}
    </View>
  );
}

function Tile({ emoji, name, count, onPress }: { emoji: string; name: string; count?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.tileOuter}>
      <View style={[styles.tile, shadow]}>
        <Text style={{ fontSize: 34 }}>{emoji}</Text>
        <Text style={[ui.bold, { marginTop: space.sm, textAlign: 'center' }]}>{name}</Text>
        {count ? <Text style={[ui.muted, { marginTop: 2 }]}>{count}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Book({ openConnect }: { openConnect: () => void }) {
  const { state, update } = useStore();
  const { partner, me } = state;
  const [openId, setOpenId] = useState<string | null>(null);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  if (!me) return null;

  if (!partner) {
    return (
      <Screen title="Partner-Buch" subtitle="Alles über deinen Lieblingsmenschen an einem Ort">
        <Card tone="rose">
          <Text style={ui.bold}>Das Buch ist noch leer</Text>
          <Text style={[ui.muted, { marginVertical: space.sm }]}>
            Sobald ihr verbunden seid, findest du hier alles, was dein Partner über sich eingetragen hat, und kannst es selbst ergänzen.
          </Text>
          <Button label="Partner verbinden" onPress={openConnect} />
        </Card>
        <Text style={ui.sectionTitle}>So sieht dein Partner dich</Text>
        {BOOK_CATEGORIES.map((category) => (
          <ProfileFacts key={category.id} profile={me} categoryId={category.id} />
        ))}
      </Screen>
    );
  }

  const categories: BookCategory[] = [...BOOK_CATEGORIES, ...state.customCategories];
  const open = categories.find((category) => category.id === openId) ?? null;
  const countFor = (id: string) => {
    const count = state.entries.filter((entry) => entry.categoryId === id).length;
    return count === 0 ? undefined : count === 1 ? '1 Eintrag' : `${count} Einträge`;
  };

  const addCategory = () => {
    const name = categoryName.trim();
    if (!name) return;
    update((s) => ({ ...s, customCategories: [...s.customCategories, { id: `custom-${newId()}`, name, emoji: '📔', custom: true }] }));
    setCategoryName('');
    setAddingCategory(false);
  };

  const openGifts = state.gifts.filter((gift) => gift.status === 'idea').length;

  return (
    <Screen title={`Buch über ${partner.name}`} subtitle="Tippe auf ein Kapitel, um es aufzuschlagen">
      <View style={styles.grid}>
        {categories.map((category) => (
          <Tile
            key={category.id}
            emoji={category.emoji}
            name={category.id === 'about' ? `Über ${partner.name}` : category.name}
            count={countFor(category.id)}
            onPress={() => setOpenId(category.id)}
          />
        ))}
        <Tile emoji="🎁" name="Geschenkideen" count={openGifts > 0 ? `${openGifts} offen` : undefined} onPress={() => setGiftsOpen(true)} />
        <Tile emoji="➕" name="Eigenes Kapitel" onPress={() => setAddingCategory(true)} />
      </View>

      <Sheet visible={open !== null} title={open ? `${open.emoji} ${open.id === 'about' ? `Über ${partner.name}` : open.name}` : ''} onClose={() => setOpenId(null)}>
        {open && <CategoryContent key={open.id} category={open} profile={partner} />}
      </Sheet>

      <Sheet visible={giftsOpen} title="🎁 Geschenkideen" onClose={() => setGiftsOpen(false)}>
        <Gifts />
      </Sheet>

      <Sheet visible={addingCategory} title="Eigenes Kapitel" onClose={() => setAddingCategory(false)}>
        <Field label="Name des Kapitels" value={categoryName} onChangeText={setCategoryName} placeholder="z. B. Reiseziele" maxLength={30} autoFocus />
        <Button label="Kapitel anlegen" onPress={addCategory} disabled={!categoryName.trim()} />
      </Sheet>
    </Screen>
  );
}

const styles = {
  grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginHorizontal: -6 },
  tileOuter: { width: '50%' as const, padding: 6 },
  tile: { backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: space.lg, paddingHorizontal: space.sm, alignItems: 'center' as const, minHeight: 128, justifyContent: 'center' as const },
  removeBadge: {
    position: 'absolute' as const,
    top: 4,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
