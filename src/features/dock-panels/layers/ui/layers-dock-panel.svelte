<script lang="ts">
  import type { Layer, LayerList } from '@rastrr-editor/core';
  import { draggable } from '~/shared/lib/actions';
  import { DockPanel, ContextMenu } from '~/shared/ui';
  import { LayersIcon } from '~/shared/ui/icons';
  import { createLayersStore } from '../model';
  import LayerListItem from './layer-list-item.svelte';
  import LayersDockPanelActions from './layers-dock-panel-actions.svelte';
  import LayersDockPanelAddons from './layers-dock-panel-addons.svelte';

  export let layerList: LayerList | null = null;
  export let imageSize: Rastrr.Point = { x: 0, y: 0 };
  export let withBorder = false;

  let renameModeEnableForIndex = -1;
  let prevLayerList: LayerList | null = null;
  let layerStore = createLayersStore(null);
  let search: string = '';

  $: if (prevLayerList !== layerList) {
    layerStore = createLayersStore(layerList);
    prevLayerList = layerList;
  }

  $: layers = $layerStore.layers;

  const layerContextMenu = {
    open: false,
    layerIndex: -1,
    top: -9999,
    left: -9999,
  };

  const matchesSearch = (layer: Layer): boolean =>
    layer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;

  function closeLayerContextMenu() {
    layerContextMenu.open = false;
    layerContextMenu.top = -9999;
    layerContextMenu.left = -9999;
    layerContextMenu.layerIndex = -1;
  }

  function getIndex(reversedIndex: number): number {
    return (layerList?.length ?? 0) - 1 - reversedIndex;
  }

  function enableRenameMode(index: number) {
    renameModeEnableForIndex = index;
    closeLayerContextMenu();
  }

  function removeLayer(index: number) {
    if (!layerList) return;
    if (index >= 0) layerList.remove(index);
    closeLayerContextMenu();
  }

  function setActive(reversedIndex: number) {
    layerList?.setActive(getIndex(reversedIndex));
  }

  function createOnLayerContextMenu(reversedIndex: number) {
    return (e: MouseEvent) => {
      layerContextMenu.layerIndex = getIndex(reversedIndex);
      layerContextMenu.top = e.pageY;
      layerContextMenu.left = e.pageX;
      layerContextMenu.open = true;
    };
  }

  const dropCallback = (prevIndex: number, nextIndex: number) => {
    if (layerList && prevIndex !== nextIndex) {
      layerList.changePosition(getIndex(prevIndex), getIndex(nextIndex));
    }
  };
</script>

<DockPanel title="Слои" {withBorder}>
  <LayersIcon slot="icon" />
  <LayersDockPanelActions slot="actions" {imageSize} {layerList} bind:search />
  <LayersDockPanelAddons
    slot="addons"
    {layerList}
    opacity={$layerStore.opacity} />

  <ul use:draggable={{ draggableSelector: 'li', callback: dropCallback }}>
    {#each layers as layer, reversedIndex (layer.id)}
      <LayerListItem
        on:click={() => setActive(reversedIndex)}
        on:contextmenu={createOnLayerContextMenu(reversedIndex)}
        on:lockToggle={() => {
          layers = layers;
        }}
        on:visibleToggle={() => {
          layers = layers;
        }}
        on:renamed={() => {
          renameModeEnableForIndex = -1;
        }}
        active={layer.id === $layerStore.activeLayer?.id}
        dimmed={Boolean(search && !matchesSearch(layer))}
        renameMode={renameModeEnableForIndex !== -1 &&
          renameModeEnableForIndex === getIndex(reversedIndex)}
        {layer} />
    {/each}
  </ul>

  <ContextMenu
    bind:open={layerContextMenu.open}
    top={layerContextMenu.top}
    left={layerContextMenu.left}>
    <button
      class="context-menu-button"
      on:click={() => enableRenameMode(layerContextMenu.layerIndex)}
      >Переименовать</button>
    <button
      class="context-menu-button"
      on:click={() => removeLayer(layerContextMenu.layerIndex)}>Удалить</button>
  </ContextMenu>
</DockPanel>

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
