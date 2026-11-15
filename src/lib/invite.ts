import type { AppState, Gender, Partner, Prefs, SharedCycle } from '../types';
import { averageLength } from './cycle';
import { isValidISO } from './dates';

/**
 * Solange es noch keinen Server gibt, steckt das ganze Profil direkt im
 * Einladungscode. Der Partner scannt den QR-Code oder fügt den Code ein und
 * hat damit den aktuellen Stand auf seinem Handy.
 */

const PREFIX = 'PUPS1.';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function utf8Bytes(text: string): number[] {
  const encoded = encodeURIComponent(text);
  const bytes: number[] = [];
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === '%') {
      bytes.push(parseInt(encoded.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(encoded.charCodeAt(i));
    }
  }
  return bytes;
}

function utf8Text(bytes: number[]): string {
  let encoded = '';
  for (const b of bytes) encoded += '%' + (b < 16 ? '0' : '') + b.toString(16);
  return decodeURIComponent(encoded);
}

function toBase64Url(bytes: number[]): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += ALPHABET[b0 >> 2];
    out += ALPHABET[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) out += ALPHABET[((b1 & 15) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) out += ALPHABET[b2 & 63];
  }
  return out;
}

function fromBase64Url(text: string): number[] {
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of text) {
    const value = ALPHABET.indexOf(ch);
    if (value < 0) throw new Error('Ungültiges Zeichen');
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 255);
    }
  }
  return bytes;
}

interface Payload {
  v: 1;
  n: string;
  b: string;
  g: Gender;
  c: string;
  p: Prefs;
  d: string;
  s: string;
  a?: string;
  cy?: { l: string; len: number; sh: 'phase' | 'tips' };
}

/** Erzeugt den Einladungscode aus dem eigenen Profil */
export function createInvite(state: AppState): string | null {
  const me = state.me;
  if (!me) return null;
  const payload: Payload = {
    v: 1,
    n: me.name,
    b: me.birthday,
    g: me.gender,
    c: me.color,
    p: me.prefs,
    d: me.dislikes,
    s: me.sizes,
  };
  if (state.anniversary) payload.a = state.anniversary;
  const { cycle } = state;
  if (cycle.enabled && cycle.share !== 'none' && cycle.starts.length > 0) {
    const sorted = [...cycle.starts].sort();
    payload.cy = { l: sorted[sorted.length - 1], len: averageLength(sorted), sh: cycle.share };
  }
  return PREFIX + toBase64Url(utf8Bytes(JSON.stringify(payload)));
}

export interface InviteResult {
  partner: Partner;
  anniversary?: string;
}

/** Liest einen Einladungscode. Gibt null zurück, wenn er nicht gültig ist. */
export function readInvite(raw: string): InviteResult | null {
  try {
    // Der Code kann mitten in einer Nachricht stehen
    const match = raw.match(/PUPS1\.[A-Za-z0-9_-]+/);
    if (!match) return null;
    const json = utf8Text(fromBase64Url(match[0].slice(PREFIX.length)));
    const data = JSON.parse(json) as Partial<Payload>;
    if (data.v !== 1 || typeof data.n !== 'string' || !data.n.trim()) return null;

    const gender: Gender = data.g === 'female' || data.g === 'male' ? data.g : 'diverse';
    const prefs: Prefs = {};
    if (data.p && typeof data.p === 'object') {
      for (const [key, value] of Object.entries(data.p)) {
        if (Array.isArray(value)) prefs[key] = value.filter((x) => typeof x === 'string').slice(0, 40);
      }
    }
    let cycle: SharedCycle | undefined;
    if (data.cy && isValidISO(data.cy.l) && (data.cy.sh === 'phase' || data.cy.sh === 'tips')) {
      const len = Number(data.cy.len);
      cycle = { lastStart: data.cy.l, length: len >= 18 && len <= 45 ? len : 28, share: data.cy.sh };
    }
    const partner: Partner = {
      name: data.n.trim().slice(0, 40),
      birthday: typeof data.b === 'string' && isValidISO(data.b) ? data.b : '',
      gender,
      color: typeof data.c === 'string' && /^#[0-9a-fA-F]{6}$/.test(data.c) ? data.c : '#E8607D',
      prefs,
      dislikes: typeof data.d === 'string' ? data.d : '',
      sizes: typeof data.s === 'string' ? data.s : '',
      cycle,
      receivedAt: new Date().toISOString(),
    };
    const anniversary = typeof data.a === 'string' && isValidISO(data.a) ? data.a : undefined;
    return { partner, anniversary };
  } catch {
    return null;
  }
}
