import { writable } from 'svelte/store';
import type { Project } from '../types';

export const activeProject = writable<Project | null>(null);
