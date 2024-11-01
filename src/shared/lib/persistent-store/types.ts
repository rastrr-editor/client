/* eslint-disable @typescript-eslint/no-explicit-any */
export type StorageType = 'local' | 'session';

export type PersistentOptions = {
  storageType?: StorageType;
  replacer?: (this: any, key: string, value: any) => any;
  reviver?: (this: any, key: string, value: any) => any;
};

export type Update<T> = (value: T) => T;
