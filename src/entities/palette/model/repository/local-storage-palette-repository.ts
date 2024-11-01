import uniqid from 'uniqid';

import type { Palette, PaletteRepository } from './palette-repository';
import type { PaletteData } from '../../types';

const LS_PALETTE_REPO_KEY = 'rastrr/palettes';

export default class LocalStoragePaletteRepository
  implements PaletteRepository
{
  async get(): Promise<Palette[]> {
    const stringifiedPalettes = localStorage.getItem(LS_PALETTE_REPO_KEY);
    const palettes =
      stringifiedPalettes !== null ? JSON.parse(stringifiedPalettes) : [];
    return palettes;
  }

  async add(paletteData?: PaletteData): Promise<Palette> {
    const storedPalettes = await this.get();

    const palette: Palette = {
      ...(paletteData ?? { name: '', colors: [] }),
      id: uniqid(),
    };

    storedPalettes.unshift(palette);
    localStorage.setItem(LS_PALETTE_REPO_KEY, JSON.stringify(storedPalettes));

    return palette;
  }

  async update(id: string, palette: PaletteData): Promise<Palette> {
    const storedPalettes = await this.get();

    const paletteToUpdate = storedPalettes.find(
      (palette) => palette.id === id,
    )!;

    Object.assign(paletteToUpdate, palette);
    localStorage.setItem(LS_PALETTE_REPO_KEY, JSON.stringify(storedPalettes));

    return paletteToUpdate;
  }

  async delete(id: string): Promise<boolean> {
    const storedPalettes = await this.get();

    const paletteToDeleteIndex = storedPalettes.findIndex(
      (palette) => palette.id === id,
    );

    if (paletteToDeleteIndex >= 0) {
      storedPalettes.splice(paletteToDeleteIndex, 1);
      localStorage.setItem(LS_PALETTE_REPO_KEY, JSON.stringify(storedPalettes));

      return true;
    }

    return false;
  }

  async updatePosition(prev: number, next: number): Promise<Palette[]> {
    const storedPalettes = await this.get();
    const [palette] = storedPalettes.splice(prev, 1);
    if (palette != null) {
      storedPalettes.splice(next, 0, palette);
    }
    localStorage.setItem(LS_PALETTE_REPO_KEY, JSON.stringify(storedPalettes));
    return storedPalettes;
  }
}
