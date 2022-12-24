<script lang="ts">
  import { onMount } from 'svelte';

  import {
    X_PLACEMENT_POSITION_VALUES,
    Y_PLACEMENT_POSITION_VALUES,
  } from './utils';
  import type { XPlacement, YPlacement, Placement } from './types';

  export let placement: Placement = 'bottom-start';

  let menu: HTMLUListElement;

  function calculateMenuPlacement(): void {
    const [y, x] = placement.split('-');

    menu.style.top = Y_PLACEMENT_POSITION_VALUES[y as YPlacement];
    menu.style.left = X_PLACEMENT_POSITION_VALUES[x as XPlacement];
  }

  onMount(() => {
    calculateMenuPlacement();
  });
</script>

<ul bind:this={menu}>
  <slot />
</ul>

<style lang="scss">
  ul {
    position: absolute;
    z-index: 100;
    padding: spacing(0.5);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-extra;
    white-space: nowrap;
    list-style-type: none;
  }
</style>
