import Dexie, { type Table } from 'dexie';
import type { Project } from './types';

interface IndexedDBProject extends Project {
  normalizedName: string;
}

export class RastrrDexie extends Dexie {
  projects!: Table<IndexedDBProject, number>;

  constructor() {
    super('RastrrDatabase');
    this.version(1).stores({
      projects: '++id, normalizedName, createdAt, updatedAt',
    });
  }
}

export const db = new RastrrDexie();
