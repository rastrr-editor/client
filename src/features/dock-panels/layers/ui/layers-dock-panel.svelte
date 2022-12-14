<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    Color,
    LayerFactory,
    type Layer,
    type LayerList,
  } from '@rastrr-editor/core';
  import { draggable } from '~/shared/lib/actions';
  import {
    DockPanel,
    IconButton,
    Search,
    Range,
    ContextMenu,
  } from '~/shared/ui';
  import {
    LayersIcon,
    AddIcon,
    VisibleIcon,
    InvisibleIcon,
    LockedIcon,
    UnlockedIcon,
  } from '~/shared/ui/icons';
  import { generateDefaultName } from '~/shared/lib/strings';

  export let layerList: LayerList | null = null;
  export let imageSize: Rastrr.Point = { x: 0, y: 0 };

  let search: string = '';

  const layerContextMenu = {
    open: false,
    layerIndex: -1,
    top: -9999,
    left: -9999,
  };

  $: layers = Array.from(layerList?.reverse() ?? []);

  $: activeLayer = layerList?.activeLayer;

  $: opacity = Math.round((layerList?.activeLayer?.opacity ?? 1) * 100);

  const matchesSearch = (layer: Layer): boolean =>
    layer.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;

  const onActiveChange = (index: number, layer: Layer) => {
    opacity = Math.round(layer.opacity * 100);
    activeLayer = layer;
  };

  const onOpacityChange = (layer: Layer) => {
    if (layerList?.activeLayer === layer) {
      opacity = Math.round(layer.opacity * 100);
    }
  };

  const onAddLayer = () => {
    layers = getLayers();
    if (layerList?.activeLayer != null) {
      activeLayer = layerList.activeLayer;
    }
  };

  const onRemoveLayer = () => {
    layers = getLayers();
    if (layerList?.activeLayer != null) {
      activeLayer = layerList.activeLayer;
    }
  };

  $: {
    // NOTE: it would be better to implement custom store
    layerList?.emitter.on('activeChange', onActiveChange);
    layerList?.emitter.on('opacityChange', onOpacityChange);
    layerList?.emitter.on('add', onAddLayer);
    layerList?.emitter.on('remove', onRemoveLayer);
  }

  onDestroy(() => {
    layerList?.emitter.off('activeChange', onActiveChange);
    layerList?.emitter.off('opacityChange', onOpacityChange);
    layerList?.emitter.off('add', onAddLayer);
    layerList?.emitter.off('remove', onRemoveLayer);
  });

  function closeLayerContextMenu() {
    layerContextMenu.open = false;
    layerContextMenu.top = -9999;
    layerContextMenu.left = -9999;
    layerContextMenu.layerIndex = -1;
  }

  function getIndex(reversedIndex: number): number {
    return (layerList?.length ?? 0) - 1 - reversedIndex;
  }

  function getLayers() {
    return Array.from(layerList?.reverse() ?? []);
  }

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
      '?????????? ????????'
    );
    layerList.add(layer);
    layerList.setActive(layerList.length - 1);
  }

  function removeLayer(index: number) {
    if (!layerList) return;
    if (index >= 0) layerList.remove(index);
    closeLayerContextMenu();
  }

  function setActive(reversedIndex: number) {
    layerList?.setActive(getIndex(reversedIndex));
  }

  function setVisible(reversedIndex: number, visible: boolean) {
    if (!layerList) return;

    const layer = layerList.get(getIndex(reversedIndex));
    if (layer) {
      layer.setVisible(visible);
      layers[reversedIndex] = layer;
    }
  }

  function setLocked(reversedIndex: number, locked: boolean) {
    if (!layerList) return;

    const layer = layerList.get(getIndex(reversedIndex));
    if (layer) {
      layer.locked = locked;
      layers[reversedIndex] = layer;
    }
  }

  function setOpacity(e: Event) {
    const opacity = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isSafeInteger(opacity)) {
      layerList?.activeLayer?.setOpacity(
        Math.min(Math.max(0, opacity / 100), 1)
      );
    }
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
      layers = getLayers();
      if (layerList.activeLayer != null) {
        activeLayer = layerList.activeLayer;
      }
    }
  };
</script>

<DockPanel title="????????">
  <LayersIcon slot="icon" />

  <div slot="actions" class="panel-actions">
    <Search
      class="layer-search"
      placeholder="??????????"
      disabled={!layerList}
      bind:value={search} />
    <IconButton
      aria-label="Add layer"
      class="add"
      on:click={addLayer}
      disabled={!layerList}><AddIcon /></IconButton>
  </div>

  <div slot="addons" class="layer-transparency">
    <span>????????????????????????????</span>
    <Range
      class="transparency-range"
      units="%"
      value={opacity}
      on:change={setOpacity}
      min={0}
      max={100}
      disabled={!layerList} />
  </div>

  <ul use:draggable={{ draggableSelector: 'li', callback: dropCallback }}>
    {#each layers as layer, reversedIndex (layer.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:active={layer.id === activeLayer?.id}
        class:dimmed={search && !matchesSearch(layer)}
        on:click={() => setActive(reversedIndex)}
        on:contextmenu|preventDefault={createOnLayerContextMenu(reversedIndex)}>
        {layer.name}
        <div class="actions" class:active={!layer.visible || layer.locked}>
          <button
            on:click|stopPropagation={() =>
              setLocked(reversedIndex, !layer.locked)}
            class:deactivated={layer.locked}>
            {#if layer.locked}
              <LockedIcon />
            {:else}
              <UnlockedIcon />
            {/if}
          </button>
          <button
            on:click|stopPropagation={() =>
              setVisible(reversedIndex, !layer.visible)}
            class:deactivated={!layer.visible}>
            {#if layer.visible}
              <VisibleIcon />
            {:else}
              <InvisibleIcon />
            {/if}
          </button>
        </div>
      </li>
    {/each}
  </ul>

  <ContextMenu
    bind:open={layerContextMenu.open}
    top={layerContextMenu.top}
    left={layerContextMenu.left}>
    <button
      class="context-menu-button"
      on:click={() => removeLayer(layerContextMenu.layerIndex)}>??????????????</button>
  </ContextMenu>
</DockPanel>

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

  .layer-transparency {
    display: flex;
    align-items: center;
    margin-top: spacing(3);

    span {
      @include typography(body3);
    }

    :global(.transparency-range) {
      width: spacing(44.5);
      margin-left: auto;
    }
  }

  .context-menu-button {
    @include menu-button;
  }

  ul {
    list-style-type: none;
    margin: spacing(1.5) 0;
    padding: spacing(0.5);
    height: spacing(50);
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

      + li {
        margin-top: spacing(0.5);
      }
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
