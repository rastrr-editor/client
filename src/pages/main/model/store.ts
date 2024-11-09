import type { Viewport } from '@rastrr-editor/core';
import { location } from 'svelte-spa-router';
import { writable } from 'svelte/store';

import { hotkeys } from '~/features/hotkeys-manager';

import { handleHistoryHotkeys, HistoryEvents } from './handle-history-hotkeys';
import saveProject from './save-project';

export const viewport = writable<Viewport | null>(null);

export const openProjects = writable<boolean>(false);

export const openAbout = writable<boolean>(false);

location.subscribe((value) => {
  openProjects.set(value === '/projects');
  openAbout.set(value === '/about');
});

const control = /Mac/i.test(navigator.platform) ? 'meta' : 'control';

hotkeys.register([control, 'z'], HistoryEvents.UNDO);
hotkeys.register([control, 'shift', 'z'], HistoryEvents.REDO);

viewport.subscribe(handleHistoryHotkeys);

hotkeys.register([control, 's'], 'save');

hotkeys.emitter.on('activated:save', (_alias, _ctx, e) => {
  e.preventDefault();
  saveProject().then(() => console.log('Saved'));
});
