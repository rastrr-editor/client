import { writable } from 'svelte/store';
import type { Palette } from './repository/palette-repository';

export const editablePalette = writable<Palette | null>(null);
