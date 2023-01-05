import type { Palette, PaletteRepository } from './palette-repository';
import LocalStoragePaletteRepository from './local-storage-palette-repository';

export { type Palette, type PaletteRepository, LocalStoragePaletteRepository };

export function createPaletteRepository(): PaletteRepository {
  return new LocalStoragePaletteRepository();
}
