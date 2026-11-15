import React, { useState } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';

import { Button, Card, Chip, Field, Muted, Segmented, StoredImage, styles as ui } from '../components/ui';
import { GIFT_OCCASIONS } from '../data/options';
import { deleteImages, pickFromLibrary, takePhoto } from '../lib/images';
import { newId, useStore } from '../lib/store';
import { colors, space } from '../theme';
import type { Gift, GiftStatus } from '../types';

const STATUS_OPTIONS: { value: GiftStatus; label: string }[] = [
  { value: 'idea', label: 'Ideen' },
  { value: 'bought', label: 'Gekauft' },
  { value: 'given', label: 'Verschenkt' },
];

const NEXT_STATUS: Record<GiftStatus, { status: GiftStatus; label: string } | null> = {
  idea: { status: 'bought', label: 'Als gekauft markieren' },
  bought: { status: 'given', label: 'Als verschenkt markieren' },
  given: null,
};

function normalizeLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function GiftEditor({ gift, onDone }: { gift?: Gift; onDone: () => void }) {
  const { update } = useStore();
  const [title, setTitle] = useState(gift?.title ?? '');
  const [price, setPrice] = useState(gift?.price ?? '');
  const [link, setLink] = useState(gift?.link ?? '');
  const [note, setNote] = useState(gift?.note ?? '');
  const [occasion, setOccasion] = useState(gift?.occasion ?? '');
  const [imageId, setImageId] = useState<string | undefined>(gift?.imageId);

  const setImage = async (fromCamera: boolean) => {
    const id = fromCamera ? await takePhoto() : await pickFromLibrary();
    if (!id) return;
    if (imageId && imageId !== gift?.imageId) deleteImages([imageId]);
    setImageId(id);
  };

  const save = () => {
    if (gift?.imageId && gift.imageId !== imageId) deleteImages([gift.imageId]);
    const values = { title: title.trim(), price: price.trim(), link: normalizeLink(link), note: note.trim(), occasion, imageId };
    update((state) => {
      if (gift) return { ...state, gifts: state.gifts.map((g) => (g.id === gift.id ? { ...g, ...values } : g)) };
      const created: Gift = { id: newId(), status: 'idea', createdAt: new Date().toISOString(), ...values };
      return { ...state, gifts: [created, ...state.gifts] };
    });
    onDone();
  };

  const cancel = () => {
    if (imageId && imageId !== gift?.imageId) deleteImages([imageId]);
    onDone();
  };

  return (
    <Card>
      <Text style={[ui.bold, { marginBottom: space.md }]}>{gift ? 'Idee bearbeiten' : 'Neue Geschenkidee'}</Text>
      {imageId ? <StoredImage id={imageId} style={{ height: 180, marginBottom: space.md }} /> : null}
      <View style={[ui.row, { marginBottom: space.md }]}>
        <Button label={imageId ? 'Anderes Bild' : 'Bild oder Screenshot'} small variant="secondary" onPress={() => setImage(false)} />
        <Button label="Foto aufnehmen" small variant="secondary" onPress={() => setImage(true)} style={{ marginLeft: space.sm }} />
      </View>
      <Field label="Was ist es?" value={title} onChangeText={setTitle} placeholder="z. B. Die Kette aus dem Schaufenster" maxLength={80} />
      <Field label="Preis (optional)" value={price} onChangeText={setPrice} placeholder="z. B. 35 €" maxLength={20} />
      <Field label="Link (optional)" value={link} onChangeText={setLink} placeholder="https://…" autoCapitalize="none" autoCorrect={false} keyboardType="url" />
      <Text style={ui.label}>Anlass</Text>
      <View style={ui.chipWrap}>
        {GIFT_OCCASIONS.map((option) => (
          <Chip key={option} label={option} selected={occasion === option} onPress={() => setOccasion(occasion === option ? '' : option)} />
        ))}
      </View>
      <Field label="Notiz (optional)" value={note} onChangeText={setNote} placeholder="Größe, Farbe, wo gesehen …" multiline maxLength={500} />
      <Button label="Speichern" onPress={save} disabled={!title.trim()} />
      <Button label="Abbrechen" variant="ghost" onPress={cancel} style={{ marginTop: space.sm }} />
    </Card>
  );
}

/** Geschenke-Board: Ideen sammeln, als gekauft und verschenkt markieren */
export function Gifts() {
  const { state, update } = useStore();
  const [filter, setFilter] = useState<GiftStatus>('idea');
  const [editing, setEditing] = useState<Gift | 'new' | null>(null);
  const gifts = state.gifts.filter((gift) => gift.status === filter);
  const name = state.partner?.name ?? 'deinen Partner';

  const setStatus = (gift: Gift, status: GiftStatus) =>
    update((s) => ({ ...s, gifts: s.gifts.map((g) => (g.id === gift.id ? { ...g, status } : g)) }));

  const remove = (gift: Gift) =>
    Alert.alert('Idee löschen?', gift.title, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          if (gift.imageId) deleteImages([gift.imageId]);
          update((s) => ({ ...s, gifts: s.gifts.filter((g) => g.id !== gift.id) }));
        },
      },
    ]);

  const openLink = (link: string) =>
    Linking.openURL(link).catch(() => Alert.alert('Link konnte nicht geöffnet werden', link));

  return (
    <View>
      <Muted style={{ marginBottom: space.md }}>
        Sammle hier übers Jahr alles, was sich {name} wünscht. Die Ideen liegen nur auf deinem Handy, {name} sieht sie nicht.
      </Muted>

      {editing === 'new' ? (
        <GiftEditor onDone={() => setEditing(null)} />
      ) : (
        <Button label="+ Geschenkidee hinzufügen" onPress={() => setEditing('new')} style={{ marginBottom: space.md }} />
      )}

      <Segmented options={STATUS_OPTIONS} value={filter} onChange={setFilter} />

      {gifts.length === 0 && (
        <Muted>{filter === 'idea' ? 'Noch keine Ideen gesammelt.' : filter === 'bought' ? 'Noch nichts gekauft.' : 'Noch nichts verschenkt.'}</Muted>
      )}

      {gifts.map((gift) => {
        const next = NEXT_STATUS[gift.status];
        if (editing !== 'new' && editing?.id === gift.id) {
          return <GiftEditor key={gift.id} gift={gift} onDone={() => setEditing(null)} />;
        }
        return (
          <Card key={gift.id}>
            {gift.imageId ? <StoredImage id={gift.imageId} style={{ height: 190, marginBottom: space.md }} /> : null}
            <View style={ui.rowBetween}>
              <Text style={[ui.bold, { flex: 1, marginRight: space.sm }]}>{gift.title}</Text>
              {gift.price ? <Text style={{ color: colors.roseDark, fontWeight: '700' }}>{gift.price}</Text> : null}
            </View>
            {gift.occasion ? <Text style={[ui.muted, { marginTop: 2 }]}>{gift.occasion}</Text> : null}
            {gift.note ? <Text style={[ui.text, { marginTop: space.sm }]}>{gift.note}</Text> : null}
            {gift.link ? (
              <Pressable onPress={() => openLink(gift.link)} accessibilityRole="link" style={{ marginTop: space.sm }}>
                <Text style={{ color: colors.lavenderDark, fontWeight: '700' }} numberOfLines={1}>
                  {gift.link}
                </Text>
              </Pressable>
            ) : null}
            {next && <Button label={next.label} small onPress={() => setStatus(gift, next.status)} style={{ marginTop: space.md }} />}
            <View style={[ui.row, { marginTop: space.sm }]}>
              <Button label="Bearbeiten" small variant="secondary" onPress={() => setEditing(gift)} />
              {gift.status !== 'idea' && (
                <Button label="Zurück zu Ideen" small variant="secondary" onPress={() => setStatus(gift, 'idea')} style={{ marginLeft: space.sm }} />
              )}
              <Button label="Löschen" small variant="danger" onPress={() => remove(gift)} style={{ marginLeft: space.sm }} />
            </View>
          </Card>
        );
      })}
    </View>
  );
}
