import { writable } from 'svelte/store';
import type { Project } from '~/shared/api';

export const activeProject = writable<Project | null>(null);
