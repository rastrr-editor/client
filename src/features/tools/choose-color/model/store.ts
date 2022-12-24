import { Color } from '@rastrr-editor/core';
import { writable } from 'svelte/store';

export const mainColor = writable<Color>(new Color(0, 0, 0));
export const secondaryColor = writable<Color>(new Color(255, 255, 255));
