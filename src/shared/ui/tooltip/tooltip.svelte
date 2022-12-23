<script lang="ts">
  import { onMount } from 'svelte';

  import type { Position, GapRatio } from './types';

  export let active: boolean = false;
  export let position: Position = 'top';
  export let gap: GapRatio = 0;
  export let showDelay: number = 0;
  export let hideDelay: number = 0;

  const gapValue = 4;
  let visible: boolean = false;
  let trigger: HTMLElement;
  let tooltip: HTMLElement;
  let tooltipVisibilityTransition = '';

  $: {
    if (!active && !visible) {
      tooltipVisibilityTransition = `visibility 0ms ${hideDelay}ms`;
    }

    if (!active && visible) {
      tooltipVisibilityTransition = `visibility 0ms ${showDelay}ms`;
    }
  }

  function calculateLeftPosition(): string {
    const triggerLeftPosition = trigger.getBoundingClientRect().x;

    let calculatedLeftPosition = 0;
    if (position === 'top' || position === 'bottom') {
      calculatedLeftPosition =
        triggerLeftPosition + trigger.offsetWidth / 2 - tooltip.clientWidth / 2;
    }

    if (position === 'left') {
      calculatedLeftPosition =
        triggerLeftPosition - tooltip.offsetWidth - gapValue * gap;
    }

    if (position === 'right') {
      calculatedLeftPosition =
        triggerLeftPosition + trigger.offsetWidth + gapValue * gap;
    }

    return `${calculatedLeftPosition}px`;
  }

  function calculateTopPosition(): string {
    const triggerTopPosition = trigger.getBoundingClientRect().y;

    let calculatedTopPosition = 0;
    if (position === 'top') {
      calculatedTopPosition =
        triggerTopPosition - tooltip.offsetHeight - gapValue * gap;
    }

    if (position === 'bottom') {
      calculatedTopPosition =
        triggerTopPosition + trigger.offsetHeight + gapValue * gap;
    }

    if (position === 'left' || position === 'right') {
      calculatedTopPosition =
        triggerTopPosition +
        trigger.offsetHeight / 2 -
        tooltip.offsetHeight / 2;
    }

    return `${calculatedTopPosition}px`;
  }

  function updateTooltipPosition(): void {
    tooltip.style.left = calculateLeftPosition();
    tooltip.style.top = calculateTopPosition();
  }

  function handleTriggerMouseEnter(): void {
    if (active) return;

    updateTooltipPosition();
    visible = true;
  }

  function handleTriggerMouseLeave(): void {
    if (active) return;

    visible = false;
  }

  function handleTriggerClick(): void {
    if (!active) return;

    updateTooltipPosition();
    visible = true;
  }

  function handleTriggerKeydown(event: KeyboardEvent): void {
    if (!active) return;

    if (event.key === 'Enter' || event.key === ' ') {
      updateTooltipPosition();
      visible = true;
    }
  }

  function handleTooltipKeydown(event: KeyboardEvent): void {
    if (!active) return;

    if (event.key === 'Escape') {
      visible = false;
    }
  }

  function handleOutsideClick(event: MouseEvent): void {
    if (!visible) return;

    const eventPath = event.composedPath();
    const isTrigger = eventPath.includes(trigger);
    const isTooltip = eventPath.includes(tooltip);

    if (!isTrigger && !isTooltip) {
      visible = false;
    }
  }

  onMount(() => {
    if (active) {
      window.addEventListener('click', handleOutsideClick);
    }

    return () => {
      if (active) {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  });
</script>

<div
  bind:this={trigger}
  on:mouseenter={handleTriggerMouseEnter}
  on:mouseleave={handleTriggerMouseLeave}
  on:click={handleTriggerClick}
  on:keydown={handleTriggerKeydown}
>
  <slot />
</div>

<div
  class="tooltip"
  class:visible
  style:transition={tooltipVisibilityTransition}
  bind:this={tooltip}
  on:keydown={handleTooltipKeydown}
>
  <slot name="tooltip" />
</div>

<style lang="scss">
  .tooltip {
    @include typography(body2);

    position: absolute;
    visibility: hidden;
    padding: spacing(2);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-extra;
  }

  .visible {
    visibility: visible;
  }
</style>
