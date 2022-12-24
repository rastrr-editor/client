<script lang="ts">
  import { noop } from 'svelte/internal';

  import { clickOutside } from '~/shared/lib/actions';

  export let open: boolean = false;
  export let hover: boolean = false;
  export let autoClose: boolean = false;
  export let nested: boolean = false;

  function openMenu(): void {
    open = true;
  }

  function hideMenu(): void {
    open = false;
  }

  function hideMenuByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      open = false;
    }
  }
</script>

<svelte:element
  this={nested ? 'li' : 'div'}
  class="wrapper"
  use:clickOutside={!hover ? hideMenu : noop}
  on:mouseenter={hover ? openMenu : undefined}
  on:mouseleave={hover ? hideMenu : undefined}
  on:focus|capture={hover ? openMenu : undefined}
  on:blur|capture={hover ? hideMenu : undefined}
  on:keydown|capture={hideMenuByKeydown}
>
  <div class="trigger">
    <slot />
  </div>

  {#if open}
    <div on:click={autoClose ? hideMenu : undefined} on:keyup>
      <slot name="menu" />
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  .wrapper {
    position: relative;
  }
</style>
