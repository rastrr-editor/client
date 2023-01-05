import type { PaletteData } from '../../types';

export interface Palette extends PaletteData {
  id: string;
}

export interface PaletteRepository {
  get: () => Promise<Palette[]>;
  add: () => Promise<Palette>;
  update: (id: string, palette: Palette | PaletteData) => Promise<Palette>;
  delete: (id: string) => Promise<boolean>;
}
