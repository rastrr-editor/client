<script lang="ts">
  // TODO Refactoring. Pass trigger element as a prop and do coord calcs here. Handle edge cases to prevent menu cutoffs.
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '~/shared/lib/actions';

  export let open: boolean = false;
  export let top: number = -9999;
  export let left: number = -9999;

  const dispatch = createEventDispatcher();

  function hideContextMenu(): void {
    open = false;

    dispatch('hide');
  }

  function hideContextMenuByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.code === 'Escape') {
      open = false;
    }
  }
</script>

<div
  role="menu"
  class="context-menu"
  class:open
  style:top={`${top}px`}
  style:left={`${left}px`}
  use:clickOutside={{ callback: hideContextMenu }}
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
