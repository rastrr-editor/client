import { writable, get, type Writable } from 'svelte/store';
import { STORAGE_PREFIX } from './consts';
import { getIsStorageAvailable } from './get-is-storage-available';
import type { PersistentOptions, Update } from './types';

const stores: Record<string, Writable<any>> = {};

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

  const createStore = (): Writable<T> =>
    writable(initial, (set) => {
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

  if (stores[key] === undefined) {
    const store = createStore();
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
