<script lang="ts">
  import { tick, onDestroy, createEventDispatcher, type Snippet } from 'svelte';

  import { clickOutside } from '~/shared/lib/actions';
  import { BASE_SPACING } from '~/shared/config';
  import { calculateLeftPosition, calculateTopPosition } from './utils';
  import type { Placement } from './types';

  interface Props {
    children: Snippet;
    trigger: HTMLElement;
    open?: boolean;
    active?: boolean;
    disabled?: boolean;
    placement?: Placement;
    gap?: number;
    openDelay?: number;
    hideDelay?: number;
  }

  let {
    children,
    trigger,
    open = $bindable(false),
    active = false,
    disabled = $bindable(false),
    placement = 'top',
    gap = 0,
    openDelay = 0,
    hideDelay = 0,
  }: Props = $props();

  const noop = () => {};

  const dispatch = createEventDispatcher();
  let tooltip: HTMLDivElement;

  const tooltipVisibilityTransition = $derived(
    disabled
      ? ''
      : open
        ? `visibility 0ms ${openDelay}ms`
        : `visibility 0ms ${hideDelay}ms`,
  );

  function updateTooltipPosition(): void {
    tooltip.style.left = calculateLeftPosition(
      trigger,
      tooltip,
      placement,
      BASE_SPACING * gap,
    );
    tooltip.style.top = calculateTopPosition(
      trigger,
      tooltip,
      placement,
      BASE_SPACING * gap,
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

  $effect(() => {
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

<svelte:window onresize={updateTooltipPosition} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  role="tooltip"
  class="tooltip"
  class:active
  class:open={open && !disabled}
  style:transition={tooltipVisibilityTransition}
  bind:this={tooltip}
  use:clickOutside={{ callback: active ? hideTooltip : noop }}
  onkeydown={active ? hideTooltipByKeydown : undefined}>
  {@render children?.()}
</div>

<style lang="scss">
  .tooltip {
    @include typography(body2);

    position: fixed;
    z-index: 99;
    visibility: hidden;
    padding: spacing(3);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: var(--tooltip-background-color, #{$bg-extra});
  }

  .open {
    visibility: visible;
  }

  .active {
    z-index: 200;
  }
</style>
