import { writable, get, type Writable } from 'svelte/store';
import { STORAGE_PREFIX } from './consts';
import type { PersistentOptions, Update } from './types';

const stores: Record<string, Writable<any>> = {};

const getIsStorageAvailable = (storage: Storage): boolean => {
  try {
    const key = '__test__';
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const persistent = <T>(
  rawKey: string,
  initial: T,
  options?: PersistentOptions
): Writable<T> => {
  const key = `${STORAGE_PREFIX}-${rawKey}`;
  const { storageType = 'local', reviver, replacer } = options ?? {};
  const storage = (typeof window !== 'undefined' &&
    window[`${storageType}Storage`]) as Storage;
  const isStorageAvailable = getIsStorageAvailable(storage);

  const updateStorage = (key: string, value: T): void => {
    if (!isStorageAvailable) {
      return;
    }

    storage.setItem(key, JSON.stringify(value, replacer));
  };

  if (stores[key] === undefined) {
    const store = writable(initial, (set) => {
      if (!isStorageAvailable) {
        return;
      }

      const json = storage.getItem(key);
      const handleStorage = ({
        key: eventKey,
        newValue: value,
      }: StorageEvent): void => {
        if (eventKey === key) {
          set(value !== null ? JSON.parse(value, reviver) : null);
        }
      };

      if (json !== null) {
        set(JSON.parse(json, reviver) as T);
      }

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    });

    const { subscribe, set } = store;

    stores[key] = {
      set(value: T) {
        updateStorage(key, value);
        set(value);
      },
      update(updater: Update<T>) {
        const value = updater(get(store));

        updateStorage(key, value);
        set(value);
      },
      subscribe,
    };
  }

  return stores[key];
};
