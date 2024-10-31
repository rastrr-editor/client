<script lang="ts">
  import type { Viewport } from '@rastrr-editor/core';
  
  import { DockPanel } from '~/shared/ui';
  import { HistoryIcon } from '~/shared/ui/icons';
  import {
    createHistoryStore,
    createGotoCommand,
    type HistoryStore,
  } from '../model';

  interface Props {
    viewport?: Viewport | null;
    withBorder?: boolean;
  }

  let { viewport = null, withBorder = false }: Props = $props();

  let historyContainer: HTMLElement | undefined = $state();
  let prevViewport: Viewport | null = $state(null);

  const updateScrollPosition = () =>
    requestAnimationFrame(() => {
      if (historyContainer != null) {
        const activeNode = historyContainer.querySelector(
          `li:nth-child(${(viewport?.history?.index ?? 0) + 1})`
        ) as HTMLElement;

        historyContainer.scrollTop = activeNode.offsetTop;
      }
    });

  let store: HistoryStore = $state(createHistoryStore(null, updateScrollPosition));

  // Update history store only if new viewport differs from previous
  $effect(() => {
    if (prevViewport !== viewport) {
      prevViewport = viewport;
      store = createHistoryStore(viewport?.history ?? null, updateScrollPosition);
    }
  });

  let gotoCommand = $derived(viewport ? createGotoCommand(viewport) : () => {});
</script>

<DockPanel title="История" {withBorder}>
  {#snippet icon()}
    <HistoryIcon  />
  {/snippet}
  <ul bind:this={historyContainer}>
    {#each $store.commands as command, index}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li
        class:dimmed={index > $store.historyIndex}
        onclick={() => gotoCommand(index)}>
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
      @include clickable-list-item;

      + li {
        margin-top: spacing(0.5);
      }
    }
  }
</style>
