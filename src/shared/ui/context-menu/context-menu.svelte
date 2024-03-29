<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { clickOutside, focusTrap } from '~/shared/lib/actions';
  import { BASE_SPACING } from '~/shared/config';
  import { calculateLeftPosition, calculateTopPosition } from './utils';
  import type { ContextMenuStore } from './model';

  export let store: ContextMenuStore<any>;

  const viewportMenuGap = BASE_SPACING * 2;
  const dispatch = createEventDispatcher();

  let menu: HTMLElement;

  function setMenuPosition(): void {
    menu.style.left = calculateLeftPosition(menu, $store.left, viewportMenuGap);
    menu.style.top = calculateTopPosition(menu, $store.top, viewportMenuGap);
  }

  function hideContextMenu(): void {
    store.close();

    dispatch('hide');
  }

  function hideContextMenuByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.code === 'Escape') {
      hideContextMenu();
    }
  }

  afterUpdate(() => {
    if ($store.open) {
      setMenuPosition();
    }
  });
</script>

<div
  role="menu"
  class="context-menu"
  class:open={$store.open}
  bind:this={menu}
  use:clickOutside={{ callback: hideContextMenu }}
  use:focusTrap
  on:keydown={hideContextMenuByKeydown}>
  <slot />
</div>

<style lang="scss">
  .context-menu {
    @include typography(body2);

    position: fixed;
    z-index: 100;
    display: flex;
    flex-direction: column;
    padding: spacing(0.5);
    visibility: hidden;
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: var(--context-menu-background-color, #{$bg-extra});
  }

  .open {
    visibility: visible;
  }
</style>
