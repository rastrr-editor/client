<script lang="ts">
  import { noop } from 'svelte/internal';

  import { clickOutside } from '~/shared/lib/actions';

  interface Props {
    open?: boolean;
    hover?: boolean;
    nested?: boolean;
    children?: import('svelte').Snippet;
    menu?: import('svelte').Snippet;
  }

  let {
    open = $bindable(false),
    hover = false,
    nested = false,
    children,
    menu
  }: Props = $props();

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
  onmouseenter={hover ? openMenu : undefined}
  onmouseleave={hover ? hideMenu : undefined}
  onfocuscapture={hover ? openMenu : undefined}
  onblurcapture={hover ? hideMenu : undefined}
  onkeydowncapture={hideMenuByKeydown}
>
  {@render children?.()}

  <div
    class="menu"
    class:open
    onclick={hideMenu}
    oncontextmenu={hideMenu}
    onkeydown={noop}
  >
    {@render menu?.()}
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
