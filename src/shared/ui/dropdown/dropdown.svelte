<script lang="ts">
  import { noop } from 'svelte/internal';

  import { clickOutside } from '~/shared/lib/actions';

  export let open: boolean = false;
  export let hover: boolean = false;
  export let nested: boolean = false;

  function openMenu(): void {
    open = true;
  }

  function hideMenu(): void {
    open = false;
  }

  function hideMenuByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.code === 'Escape') {
      open = false;
    }
  }
</script>

<svelte:element
  this={nested ? 'li' : 'div'}
  class="root"
  use:clickOutside={{ callback: !hover ? hideMenu : noop }}
  on:mouseenter={hover ? openMenu : undefined}
  on:mouseleave={hover ? hideMenu : undefined}
  on:focus|capture={hover ? openMenu : undefined}
  on:blur|capture={hover ? hideMenu : undefined}
  on:keydown|capture={hideMenuByKeydown}
>
  <slot />

  <div
    class="menu"
    class:open
    on:click={hideMenu}
    on:contextmenu={hideMenu}
    on:keydown={noop}
  >
    <slot name="menu" />
  </div>
</svelte:element>

<style lang="scss">
  .root {
    position: relative;
  }

  .menu {
    visibility: hidden;
  }

  .open {
    visibility: visible;
  }
</style>
