<script lang="ts">
  import type { Layer } from '@rastrr-editor/core';
  import { clickOutside } from '~/shared/lib/actions';
  import {
    InvisibleIcon,
    LockedIcon,
    UnlockedIcon,
    VisibleIcon,
  } from '~/shared/ui/icons';

  interface Props {
    layer: Layer;
    onlockToggle?: (params: { prev: boolean; next: boolean }) => void;
    onvisibleToggle?: (params: { prev: boolean; next: boolean }) => void;
    onrenamed?: (params: { prev: string; next: string }) => void;
    onclick: (e: MouseEvent) => void;
    oncontextmenu: (e: MouseEvent) => void;
    active?: boolean;
    dimmed?: boolean;
    renameMode?: boolean;
  }

  let {
    layer,
    onlockToggle,
    onvisibleToggle,
    onrenamed,
    onclick,
    oncontextmenu,
    active = false,
    dimmed = false,
    renameMode = false,
  }: Props = $props();

  let self: HTMLLIElement | undefined = $state();
  let inputNode: HTMLInputElement | undefined = $state();
  let visible = $state(layer.visible);
  let locked = $state(layer.locked);

  $effect(() => {
    if (inputNode) {
      inputNode.focus();
    }
  });

  function toggleLocked(): void {
    const prev = layer.locked;
    locked = layer.locked = !prev;
    onlockToggle?.({ prev, next: layer.locked });
  }

  function toggleVisible(): void {
    const prev = layer.visible;
    layer.setVisible(visible = !layer.visible);
    onvisibleToggle?.({ prev, next: layer.visible });
  }

  function renameLayer(e: Event): void {
    const { value } = e.target as HTMLInputElement;
    const prev = layer.name;
    if (value) {
      layer.name = value;
      renameMode = false;
    }
    onrenamed?.({ prev, next: layer.name });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
  bind:this={self}
  class:active
  class:dimmed
  onclick={onclick}
  oncontextmenu={(e: MouseEvent) => (e.preventDefault(), oncontextmenu(e))}
  ondblclick={(e: MouseEvent) => {
    if (e.target == self) {
      renameMode = true;
    }
  }}
  use:clickOutside={{
    callback: () => {
      renameMode = false;
      onrenamed?.({ prev: layer.name, next: layer.name });
    },
  }}>
  {#if renameMode}
    <input
      bind:this={inputNode}
      type="text"
      value={layer.name}
      onchange={renameLayer} />
  {:else}
    {layer.name}
  {/if}
  <div class="actions" class:active={!visible || locked}>
    <button
      onclick={toggleLocked}
      class:deactivated={locked}>
      {#if locked}
        <LockedIcon />
      {:else}
        <UnlockedIcon />
      {/if}
    </button>
    <button
      onclick={toggleVisible}
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

      &.active {
        border-color: $border-active-color;
      }
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
