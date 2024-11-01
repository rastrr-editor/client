import { writable } from 'svelte/store';

type ContextMenuState = {
  open: boolean;
  top: number;
  left: number;
};

export type ContextMenuStore<ExtraState> = SvelteStore<
  ExtraState & ContextMenuState
> & {
  createOnContextMenu: (next: ExtraState) => (e: MouseEvent) => void;
  close: () => void;
};

export function createContextMenuStore<ExtraState>(
  initialState: ExtraState,
): ContextMenuStore<ExtraState> {
  const { subscribe, set, update } = writable<ExtraState & ContextMenuState>({
    ...initialState,
    open: false,
    top: -9999,
    left: -9999,
  });

  return {
    subscribe,
    createOnContextMenu: (next: ExtraState) => (e: MouseEvent) => {
      e.preventDefault();
      update((prev) => ({
        ...prev,
        ...next,
        open: true,
        top: e.pageY,
        left: e.pageX,
      }));
    },
    close: () => set({ ...initialState, open: false, top: -9999, left: -9999 }),
  };
}
