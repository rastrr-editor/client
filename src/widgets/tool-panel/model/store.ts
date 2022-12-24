import { writable } from 'svelte/store';

export const position = writable<'left' | 'bottom'>('bottom');
