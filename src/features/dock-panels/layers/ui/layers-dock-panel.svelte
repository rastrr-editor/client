<script lang="ts">
  import { run } from 'svelte/legacy';

  import type { LayerList } from '@rastrr-editor/core';
  import { DockPanel } from '~/shared/ui';
  import { LayersIcon } from '~/shared/ui/icons';
  import { createLayersStore } from '../model';
  import LayerListComponent from './layer-list.svelte';
  import LayersDockPanelActions from './layers-dock-panel-actions.svelte';
  import LayersDockPanelAddons from './layers-dock-panel-addons.svelte';

  interface Props {
    layerList?: LayerList | null;
    imageSize?: Rastrr.Point;
    withBorder?: boolean;
  }

  let { layerList = null, imageSize = { x: 0, y: 0 }, withBorder = false }: Props = $props();

  let layersStore = $state(createLayersStore(null));
  let search: string = $state('');

  run(() => {
    layersStore = createLayersStore(layerList);
  });
</script>

<DockPanel title="Слои" {withBorder}>
  {#snippet icon()}
    <LayersIcon  />
  {/snippet}
  {#snippet actions()}
    <LayersDockPanelActions  {imageSize} {layerList} bind:search />
  {/snippet}
  {#snippet addons()}
    <LayersDockPanelAddons
      
      {layerList}
      opacity={$layersStore.opacity} />
  {/snippet}
  <LayerListComponent {layerList} {layersStore} {search} />
</DockPanel>
