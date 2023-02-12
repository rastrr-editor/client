export const getIsStorageAvailable = (storage: Storage): boolean => {
  try {
    const key = '__test__';
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};
