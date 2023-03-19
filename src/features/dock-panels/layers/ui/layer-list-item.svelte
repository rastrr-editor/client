<script lang="ts">
  import type { Layer } from '@rastrr-editor/core';
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { clickOutside } from '~/shared/lib/actions';
  import {
    InvisibleIcon,
    LockedIcon,
    UnlockedIcon,
    VisibleIcon,
  } from '~/shared/ui/icons';

  export let layer: Layer;
  export let active: boolean = false;
  export let dimmed: boolean = false;
  export let renameMode = false;

  let inputNode: HTMLInputElement;

  afterUpdate(() => {
    if (inputNode) {
      inputNode.focus();
    }
  });

  const dispatch = createEventDispatcher<{
    lockToggle: { prev: boolean; next: boolean };
    visibleToggle: { prev: boolean; next: boolean };
    renamed: { prev: string; next: string };
  }>();

  function toggleLocked(): void {
    const prev = layer.locked;
    layer.locked = !prev;
    dispatch('lockToggle', { prev, next: layer.locked });
  }

  function toggleVisible(): void {
    const prev = layer.visible;
    layer.setVisible(!layer.visible);
    dispatch('visibleToggle', { prev, next: layer.visible });
  }

  function renameLayer(e: Event): void {
    const { value } = e.target as HTMLInputElement;
    const prev = layer.name;
    if (value) {
      layer.name = value;
      renameMode = false;
    }
    dispatch('renamed', { prev, next: layer.name });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
  class:active
  class:dimmed
  on:click
  on:contextmenu|preventDefault
  on:dblclick={() => {
    renameMode = true;
  }}
  use:clickOutside={{
    callback: () => {
      renameMode = false;
      dispatch('renamed', { prev: layer.name, next: layer.name });
    },
  }}>
  {#if renameMode}
    <input
      bind:this={inputNode}
      type="text"
      value={layer.name}
      on:change={renameLayer} />
  {:else}
    {layer.name}
  {/if}
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
  input {
    @include invisible-input;
    @include text-cursor;
    color: $body-color;
    line-height: 1.2;
  }

  li {
    position: relative;

    @include clickable-list-item {
      padding-right: spacing(12);
    }

    &:hover {
      > .actions {
        visibility: visible;
        opacity: 1;
      }
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
