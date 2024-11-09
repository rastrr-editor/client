import type { Viewport } from '@rastrr-editor/core';
import { location } from 'svelte-spa-router';
import { writable } from 'svelte/store';

export const viewport = writable<Viewport | null>(null);

export const openProjects = writable<boolean>(false);

export const openAbout = writable<boolean>(false);

location.subscribe((value) => {
  openProjects.set(value === '/projects');
  openAbout.set(value === '/about');
});
