<script lang="ts">
  import type { Viewport } from '@rastrr-editor/core';
  import { DockPanel } from '~/shared/ui';
  import { HistoryIcon } from '~/shared/ui/icons';
  import {
    createHistoryStore,
    createGotoCommand,
    type HistoryStore,
  } from '../model';

  export let viewport: Viewport | null = null;
  export let withBorder = false;

  let historyContainer: HTMLElement;
  let prevViewport: Viewport | null = null;

  const updateScrollPosition = () =>
    requestAnimationFrame(() => {
      const activeNode = historyContainer.querySelector(
        `li:nth-child(${(viewport?.history?.index ?? 0) + 1})`
      ) as HTMLElement;
      historyContainer.scrollTop = activeNode.offsetTop;
    });

  let store: HistoryStore = createHistoryStore(null, updateScrollPosition);

  // Update history store only if new viewport differs from previous
  $: if (prevViewport !== viewport) {
    prevViewport = viewport;
    store = createHistoryStore(viewport?.history ?? null, updateScrollPosition);
  }

  $: gotoCommand = viewport ? createGotoCommand(viewport) : () => {};
</script>

<DockPanel title="История" {withBorder}>
  <HistoryIcon slot="icon" />
  <ul bind:this={historyContainer}>
    {#each $store.commands as command, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:dimmed={index > $store.historyIndex}
        on:click={() => gotoCommand(index)}>
        {command.name}
      </li>
    {/each}
  </ul>
</DockPanel>

<style lang="scss">
  ul {
    position: relative;
    list-style-type: none;
    margin: spacing(1.5) 0;
    padding: spacing(0.5);
    /* 100% - header - margin - correction for firefox */
    height: calc(100% - #{spacing(7 + 1.5 * 2 + 0.1)});
    @include custom-scroll;
    overflow-x: hidden;

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
      }

      &.dimmed {
        opacity: 0.5;
      }

      + li {
        margin-top: spacing(0.5);
      }
    }
  }
</style>
