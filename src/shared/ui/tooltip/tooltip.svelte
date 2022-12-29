<script lang="ts">
  // TODO: handle window resize
  import { tick, onDestroy, afterUpdate, createEventDispatcher } from 'svelte';
  import { noop } from 'svelte/internal';

  import { clickOutside } from '~/shared/lib/actions';
  import { BASE_SPACING } from '~/shared/config';
  import { calculateLeftPosition, calculateTopPosition } from './utils';
  import type { Placement } from './types';

  export let trigger: HTMLElement;
  export let open: boolean = false;
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let placement: Placement = 'top';
  export let gap: number = 0;
  export let openDelay: number = 0;
  export let hideDelay: number = 0;

  const dispatch = createEventDispatcher();
  let tooltip: HTMLDivElement;
  let tooltipVisibilityTransition = '';

  $: {
    tooltipVisibilityTransition = open
      ? `visibility 0ms ${openDelay}ms`
      : `visibility 0ms ${hideDelay}ms`;

    if (disabled) {
      tooltipVisibilityTransition = '';
    }
  }

  function updateTooltipPosition(): void {
    tooltip.style.left = calculateLeftPosition(
      trigger,
      tooltip,
      placement,
      BASE_SPACING * gap
    );
    tooltip.style.top = calculateTopPosition(
      trigger,
      tooltip,
      placement,
      BASE_SPACING * gap
    );
  }

  function openTooltip(): void {
    open = true;

    dispatch('open');
  }

  function hideTooltip(): void {
    open = false;

    dispatch('hide');
  }

  function hideTooltipByKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.code === 'Escape') {
      open = false;
    }
  }

  function setTriggerListeners(): void {
    trigger.addEventListener('mouseenter', openTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('focus', openTooltip, true);
    trigger.addEventListener('blur', hideTooltip, true);
  }

  function removeTriggerListeners(): void {
    trigger.removeEventListener('mouseenter', openTooltip);
    trigger.removeEventListener('mouseleave', hideTooltip);
    trigger.removeEventListener('focus', openTooltip, true);
    trigger.removeEventListener('blur', hideTooltip, true);
  }

  tick().then(() => {
    if (trigger && !active) {
      setTriggerListeners();
    }
  });

  afterUpdate(() => {
    if (disabled) {
      open = false;
    }

    if (trigger) {
      updateTooltipPosition();
    }
  });

  onDestroy(() => {
    if (!active) {
      removeTriggerListeners();
    }
  });
</script>

<div
  role="tooltip"
  class="tooltip"
  class:open={open && !disabled}
  style:transition={tooltipVisibilityTransition}
  bind:this={tooltip}
  use:clickOutside={active ? hideTooltip : noop}
  on:keydown={active ? hideTooltipByKeydown : undefined}
>
  <slot />
</div>

<style lang="scss">
  .tooltip {
    @include typography(body2);

    position: fixed;
    z-index: 100;
    visibility: hidden;
    padding: spacing(3);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: var(--tooltip-background-color, #{$bg-extra});
  }

  .open {
    visibility: visible;
  }
</style>
