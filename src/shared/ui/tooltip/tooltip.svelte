<script lang="ts">
  import { afterUpdate } from 'svelte';

  import { clickOutside } from '~/shared/lib';
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

  function openInactiveTooltip(): void {
    if (active) return;

    open = true;
  }

  function hideInactiveTooltip(): void {
    if (active) return;

    open = false;
  }

  function handleTooltipKeydown(event: KeyboardEvent): void {
    if (!active) return;

    if (event.key === 'Escape') {
      open = false;
    }
  }

  function handleOutsideClick(): void {
    if (!active) return;

    open = false;
  }

  afterUpdate(() => {
    updateTooltipPosition();
  });
</script>

<div
  class="trigger"
  bind:this={trigger}
  on:mouseenter={openInactiveTooltip}
  on:mouseleave={hideInactiveTooltip}
  on:focus|capture={openInactiveTooltip}
  on:blur|capture={hideInactiveTooltip}
>
  <slot />
</div>

<div
  class="tooltip"
  class:open
  style:transition={tooltipVisibilityTransition}
  bind:this={tooltip}
  use:clickOutside={handleOutsideClick}
  on:keydown={handleTooltipKeydown}
>
  <slot name="tooltip" />
</div>

<style lang="scss">
  .trigger {
    width: fit-content;
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
