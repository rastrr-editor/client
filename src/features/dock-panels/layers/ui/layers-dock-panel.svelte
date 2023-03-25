<script lang="ts">
  import type { LayerList } from '@rastrr-editor/core';
  import { DockPanel } from '~/shared/ui';
  import { LayersIcon } from '~/shared/ui/icons';
  import { createLayersStore } from '../model';
  import LayerListComponent from './layer-list.svelte';
  import LayersDockPanelActions from './layers-dock-panel-actions.svelte';
  import LayersDockPanelAddons from './layers-dock-panel-addons.svelte';

  export let layerList: LayerList | null = null;
  export let imageSize: Rastrr.Point = { x: 0, y: 0 };
  export let withBorder = false;

  let layersStore = createLayersStore(null);
  let search: string = '';

  $: layersStore = createLayersStore(layerList);
</script>

<DockPanel title="Слои" {withBorder}>
  <LayersIcon slot="icon" />
  <LayersDockPanelActions slot="actions" {imageSize} {layerList} bind:search />
  <LayersDockPanelAddons
    slot="addons"
    {layerList}
    opacity={$layersStore.opacity} />
  <LayerListComponent {layerList} {layersStore} {search} />
</DockPanel>
