import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import { newId, STORAGE_PREFIX } from './store';

/**
 * Bilder werden verkleinert als Base64 auf dem Gerät gespeichert.
 * Im Zustand der App steht nur die ID. Sobald es einen Server gibt,
 * wandern die Bilder dorthin.
 */

const IMAGE_PREFIX = `${STORAGE_PREFIX}img:`;
const cache = new Map<string, string>();

async function store(base64: string, mimeType: string | undefined): Promise<string> {
  const id = newId();
  const uri = `data:${mimeType ?? 'image/jpeg'};base64,${base64}`;
  await AsyncStorage.setItem(IMAGE_PREFIX + id, uri);
  cache.set(id, uri);
  return id;
}

const OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.35,
  base64: true,
  allowsEditing: false,
};

/** Öffnet die Fotomediathek. Gibt die ID des gespeicherten Bildes zurück. */
export async function pickFromLibrary(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync(OPTIONS);
    const asset = result.canceled ? null : result.assets[0];
    if (!asset?.base64) return null;
    return await store(asset.base64, asset.mimeType);
  } catch (error) {
    console.warn('Pups: Bild konnte nicht geladen werden', error);
    Alert.alert('Das hat nicht geklappt', 'Das Bild konnte nicht geladen werden.');
    return null;
  }
}

/** Öffnet die Kamera. Gibt die ID des gespeicherten Bildes zurück. */
export async function takePhoto(): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Kein Kamerazugriff', 'Erlaube Pups in den Einstellungen den Zugriff auf die Kamera.');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync(OPTIONS);
    const asset = result.canceled ? null : result.assets[0];
    if (!asset?.base64) return null;
    return await store(asset.base64, asset.mimeType);
  } catch (error) {
    console.warn('Pups: Foto konnte nicht aufgenommen werden', error);
    Alert.alert('Das hat nicht geklappt', 'Das Foto konnte nicht aufgenommen werden.');
    return null;
  }
}

export async function loadImage(id: string): Promise<string | null> {
  const cached = cache.get(id);
  if (cached) return cached;
  const uri = await AsyncStorage.getItem(IMAGE_PREFIX + id);
  if (uri) cache.set(id, uri);
  return uri;
}

export async function deleteImages(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  ids.forEach((id) => cache.delete(id));
  await AsyncStorage.multiRemove(ids.map((id) => IMAGE_PREFIX + id));
}
