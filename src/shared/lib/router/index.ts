import { tick } from 'svelte';
import { writable } from 'svelte/store';

export const location = writable<string>(window.location.hash.slice(1));

export async function push(url: string): Promise<void> {
  await tick();

  window.location.hash = `#${url}`;
}

export async function replace(url: string): Promise<void> {
  // Same as push for hash strategy
  push(url);
}

window.addEventListener('popstate', () => {
  location.set(window.location.hash.slice(1));
});
