import type { PaletteData } from '../../types';

export interface Palette extends PaletteData {
  id: string;
}

export interface PaletteRepository {
  get: () => Promise<Palette[]>;
  add: (paletteData?: PaletteData) => Promise<Palette>;
  update: (id: string, palette: Palette | PaletteData) => Promise<Palette>;
  delete: (id: string) => Promise<boolean>;
  updatePosition: (prev: number, next: number) => Promise<Palette[]>;
}
