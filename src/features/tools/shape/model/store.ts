import { writable } from 'svelte/store';
import type { ShapeOptions } from '../types';

export const options = writable<ShapeOptions>({ type: 'rect' });
