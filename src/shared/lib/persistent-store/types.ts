export type StorageType = 'local' | 'session';

export type PersistentOptions = {
  storageType?: StorageType;
  replacer?: Parameters<JSON['stringify']>[1];
  reviver?: Parameters<JSON['parse']>[1];
};

export type Update<T> = (value: T) => T;
