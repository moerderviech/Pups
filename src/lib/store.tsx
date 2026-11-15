import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { AppState } from '../types';

const STATE_KEY = 'pups:state:v1';
export const STORAGE_PREFIX = 'pups:';

export const initialState: AppState = {
  version: 1,
  me: null,
  partner: null,
  anniversary: '',
  entries: [],
  customCategories: [],
  gifts: [],
  reminders: [],
  cycle: { enabled: false, starts: [], share: 'none' },
  tasks: { hearts: 0, streak: 0, doneCount: 0 },
  settings: { notifyTasks: true, notifyReminders: true, leadDays: [60, 42, 14, 3, 0] },
};

type Updater = (state: AppState) => AppState;

interface StoreValue {
  state: AppState;
  /** false, solange die gespeicherten Daten noch geladen werden */
  ready: boolean;
  update: (updater: Updater) => void;
  /** Löscht alle Daten der App von diesem Gerät */
  reset: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STATE_KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          const saved = JSON.parse(raw) as Partial<AppState>;
          // Neue Felder aus späteren Versionen mit Standardwerten auffüllen
          setState({
            ...initialState,
            ...saved,
            cycle: { ...initialState.cycle, ...saved.cycle },
            tasks: { ...initialState.tasks, ...saved.tasks },
            settings: { ...initialState.settings, ...saved.settings },
          });
        }
      })
      .catch((error) => console.warn('Pups: Daten konnten nicht geladen werden', error))
      .finally(() => {
        if (!active) return;
        loaded.current = true;
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STATE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn('Pups: Daten konnten nicht gespeichert werden', error)
    );
  }, [state]);

  const update = useCallback((updater: Updater) => setState((current) => updater(current)), []);

  const reset = useCallback(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const own = keys.filter((key) => key.startsWith(STORAGE_PREFIX));
    if (own.length > 0) await AsyncStorage.multiRemove(own);
    setState(initialState);
  }, []);

  const value = useMemo(() => ({ state, ready, update, reset }), [state, ready, update, reset]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore muss innerhalb von StoreProvider verwendet werden');
  return value;
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
