import { writable } from 'svelte/store';
import type { Tool } from '../types';

export const activeTool = writable<Tool<any, any> | null>(null);
