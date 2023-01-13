<script lang="ts">
  import type { Layer } from '@rastrr-editor/core';
  import { createEventDispatcher } from 'svelte';
  import {
    InvisibleIcon,
    LockedIcon,
    UnlockedIcon,
    VisibleIcon,
  } from '~/shared/ui/icons';

  export let layer: Layer;
  export let active: boolean = false;
  export let dimmed: boolean = false;

  const dispatch = createEventDispatcher<{
    lockToggle: Layer;
    visibleToggle: Layer;
  }>();

  function toggleLocked(): void {
    layer.locked = !layer.locked;
    dispatch('lockToggle', layer);
  }

  function toggleVisible(): void {
    layer.setVisible(!layer.visible);
    dispatch('visibleToggle', layer);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li class:active class:dimmed on:click on:contextmenu|preventDefault>
  {layer.name}
  <div class="actions" class:active={!layer.visible || layer.locked}>
    <button
      on:click|stopPropagation={toggleLocked}
      class:deactivated={layer.locked}>
      {#if layer.locked}
        <LockedIcon />
      {:else}
        <UnlockedIcon />
      {/if}
    </button>
    <button
      on:click|stopPropagation={toggleVisible}
      class:deactivated={!layer.visible}>
      {#if layer.visible}
        <VisibleIcon />
      {:else}
        <InvisibleIcon />
      {/if}
    </button>
  </div>
</li>

<style lang="scss">
  li {
    position: relative;
    /* TODO: create mixin */
    width: 100%;
    padding: spacing(1);
    border-radius: $border-radius;
    text-align-last: left;
    transition: background-color $animation-time;
    background-color: $bg-main;
    border: 1px solid transparent;
    user-select: none;
    @include typography(body2);
    line-height: 1.2;

    &:hover {
      background-color: #5f7079;

      > .actions {
        visibility: visible;
        opacity: 1;
      }
    }

    &.active {
      border-color: $border-active-color;
    }

    &.dimmed {
      opacity: 0.5;
    }

    &:global(.dragging),
    &:global(.mirror) {
      background-color: transparent;
      opacity: 0.2;
      color: transparent;

      :global(svg) {
        color: transparent;
      }
    }

    &:global(.dragging) {
      border-color: $border-active-color;
    }

    &:global(.mirror) {
      background-color: $border-active-color;
    }
  }

  .actions {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    opacity: 0;
    visibility: hidden;
    transition: opacity ease-in-out $animation-time, visibility $animation-time;

    &.active {
      visibility: visible;
      opacity: 1;
    }

    > button {
      @include reset-button(false);
      @include action-cursor;
      height: 1.5rem;
      padding-left: spacing(2);
      padding-right: spacing(1);

      + button {
        padding-left: spacing(1);
        padding-right: spacing(2);
      }

      :global(svg) {
        font-size: 0.75rem;
        color: $body-color;
      }

      &.deactivated {
        :global(svg) {
          opacity: 0.5;
        }
      }
    }
  }
</style>
