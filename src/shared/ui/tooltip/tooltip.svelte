<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { noop } from 'svelte/internal';

  import { clickOutside } from '~/shared/lib/actions';
  import { BASE_SPACING } from '~/shared/config';
  import { calculateLeftPosition, calculateTopPosition } from './utils';
  import type { Position } from './types';

  export let open: boolean = false;
  export let active: boolean = false;
  export let position: Position = 'top';
  export let gap: number = 0;
  export let showDelay: number = 0;
  export let hideDelay: number = 0;

  let trigger: HTMLElement;
  let tooltip: HTMLElement;
  let tooltipVisibilityTransition = '';

  $: {
    if (!active && !open) {
      tooltipVisibilityTransition = `visibility 0ms ${hideDelay}ms`;
    }

    if (!active && open) {
      tooltipVisibilityTransition = `visibility 0ms ${showDelay}ms`;
    }
  }

  function updateTooltipPosition(): void {
    tooltip.style.left = calculateLeftPosition(
      trigger,
      tooltip,
      position,
      BASE_SPACING * gap
    );
    tooltip.style.top = calculateTopPosition(
      trigger,
      tooltip,
      position,
      BASE_SPACING * gap
    );
  }

  function openTooltip(): void {
    open = true;
  }

  function hideTooltip(): void {
    open = false;
  }

  function hideTooltipByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  afterUpdate(() => {
    updateTooltipPosition();
  });
</script>

<div
  class="trigger"
  bind:this={trigger}
  on:mouseenter={!active ? openTooltip : undefined}
  on:mouseleave={!active ? hideTooltip : undefined}
  on:focus|capture={!active ? openTooltip : undefined}
  on:blur|capture={!active ? hideTooltip : undefined}
>
  <slot />
</div>

<div
  class="tooltip"
  class:open
  style:transition={tooltipVisibilityTransition}
  bind:this={tooltip}
  use:clickOutside={active ? hideTooltip : noop}
  on:keydown={active ? hideTooltipByKeydown : undefined}
>
  <slot name="tooltip" />
</div>

<style lang="scss">
  .trigger {
    display: inline-block;
  }

  .tooltip {
    @include typography(body2);

    position: absolute;
    visibility: hidden;
    padding: spacing(2);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-extra;
  }

  .open {
    visibility: visible;
  }
</style>
