<script lang="ts">
  import { Color, LayerFactory, type LayerList } from '@rastrr-editor/core';
  import { generateDefaultName } from '~/shared/lib/strings';
  import { IconButton, Search } from '~/shared/ui';
  import { AddIcon } from '~/shared/ui/icons';

  interface Props {
    layerList?: LayerList | null;
    imageSize?: Rastrr.Point;
    search?: string;
  }

  let { layerList = null, imageSize = { x: 0, y: 0 }, search = $bindable('') }: Props = $props();

  // TODO: it's better to insert new layer after active
  function addLayer() {
    if (!layerList) return;
    // TODO: factory should be a global object
    const layer = LayerFactory.setType('canvas').filled(
      imageSize.x,
      imageSize.y,
      new Color(0, 0, 0, 0)
    );
    layer.name = generateDefaultName(
      Array.from(layerList).map(({ name }) => name),
      'Новый слой'
    );
    layerList.add(layer);
    layerList.setActive(layerList.length - 1);
  }
</script>

<div class="panel-actions">
  <Search
    class="layer-search"
    placeholder="Поиск"
    disabled={!layerList}
    bind:value={search} />
  <IconButton
    aria-label="Add layer"
    class="add"
    on:click={addLayer}
    disabled={!layerList}><AddIcon /></IconButton>
</div>

<style lang="scss">
  .panel-actions {
    flex: 1;
    display: flex;
    align-items: center;

    :global(.layer-search) {
      margin-left: auto;

      :global(svg) {
        font-size: 0.875rem;
      }

      :global(input) {
        font-size: 0.75rem;
      }
    }

    :global(.add) {
      margin-left: spacing(3);
    }
  }
</style>
