<script lang="ts">
  import { run } from 'svelte/legacy';

  import LayerListItem from './layer-list-item.svelte';
  import { draggable } from '~/shared/lib/actions';
  import { ContextMenu, createContextMenuStore } from '~/shared/ui';
  import type { LayersStore } from '../model';
  import type { Layer, LayerList } from '@rastrr-editor/core';

  interface Props {
    layerList?: LayerList | null;
    layersStore: LayersStore;
    search?: string;
  }

  let { layerList = null, layersStore, search = '' }: Props = $props();

  const contextMenuStore = createContextMenuStore({ layerIndex: -1 });
  let renameModeEnableForIndex = $state(-1);

  let layers;
  run(() => {
    layers = $layersStore.layers;
  });

  function getIndex(reversedIndex: number): number {
    return (layers?.length ?? 0) - 1 - reversedIndex;
  }

  const matchesSearch = (layer: Layer): boolean =>
    layer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;

  function enableRenameMode(index: number) {
    renameModeEnableForIndex = index;
    contextMenuStore.close();
  }

  function removeLayer(index: number) {
    if (!layerList) return;
    if (index >= 0) layerList.remove(index);
    contextMenuStore.close();
  }

  function setActive(reversedIndex: number) {
    layerList?.setActive(getIndex(reversedIndex));
  }

  const dropCallback = (prevIndex: number, nextIndex: number) => {
    if (layerList && prevIndex !== nextIndex) {
      layerList.changePosition(getIndex(prevIndex), getIndex(nextIndex));
    }
  };
</script>

<ul use:draggable={{ draggableSelector: 'li', callback: dropCallback }}>
  {#each layers as layer, reversedIndex (layer.id)}
    <LayerListItem
      on:click={() => setActive(reversedIndex)}
      on:contextmenu={contextMenuStore.createOnContextMenu({
        layerIndex: getIndex(reversedIndex),
      })}
      on:lockToggle={() => {
        layers = layers;
      }}
      on:visibleToggle={() => {
        layers = layers;
      }}
      on:renamed={() => {
        renameModeEnableForIndex = -1;
      }}
      active={layer.id === $layersStore.activeLayer?.id}
      dimmed={Boolean(search && !matchesSearch(layer))}
      renameMode={renameModeEnableForIndex !== -1 &&
        renameModeEnableForIndex === getIndex(reversedIndex)}
      {layer} />
  {/each}
</ul>

<ContextMenu store={contextMenuStore}>
  <button
    class="context-menu-button"
    onclick={() => enableRenameMode($contextMenuStore.layerIndex)}
    >Переименовать</button>
  <button
    class="context-menu-button"
    onclick={() => removeLayer($contextMenuStore.layerIndex)}>Удалить</button>
</ContextMenu>

<style lang="scss">
  .context-menu-button {
    @include menu-button;
  }

  ul {
    list-style-type: none;
    margin: spacing(1.5) 0;
    padding: spacing(0.5);
    /* 100% - header - margin */
    height: calc(100% - #{spacing(17.5 + 1.5 * 2)});
    @include custom-scroll;
    overflow-x: hidden;

    :global(li) + :global(li) {
      margin-top: spacing(0.5);
    }
  }
</style>
