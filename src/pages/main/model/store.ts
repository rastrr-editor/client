import type { Viewport } from '@rastrr-editor/core';
import { writable } from 'svelte/store';

export const viewport = writable<Viewport | null>(null);
