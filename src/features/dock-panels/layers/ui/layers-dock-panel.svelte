<script lang="ts">
  import { Color, LayerFactory, type LayerList } from '@rastrr-editor/core';
  import { draggable } from '~/shared/lib/actions';
  import { LayersIcon, AddIcon } from '~/shared/ui/icons';
  import InvisibleIcon from '~/shared/ui/icons/invisible-icon.svelte';
  import VisibleIcon from '~/shared/ui/icons/visible-icon.svelte';

  export let layerList: LayerList | null = null;
  export let canvasSize: Rastrr.Point = { x: 0, y: 0 };

  $: layers = Array.from(layerList?.reverse() ?? []);

  $: activeIndex = layerList?.activeIndex
    ? getReversedIndex(layerList?.activeIndex)
    : undefined;

  $: createdCount = (layerList && 0) || 0;

  function getIndex(reversedIndex: number): number {
    return (layerList?.length ?? 0) - 1 - reversedIndex;
  }

  function getReversedIndex(index: number): number {
    return (layerList?.length ?? 0) - 1 - index;
  }

  function getLayers() {
    return Array.from(layerList?.reverse() ?? []);
  }

  function addLayer() {
    if (!layerList) return;
    // TODO: factory should be a global object
    const layer = LayerFactory.setType('canvas').filled(
      canvasSize.x,
      canvasSize.y,
      new Color(0, 0, 0, 0)
    );
    layer.name = `Новый слой${createdCount > 0 ? ` ${createdCount}` : ''}`;
    createdCount += 1;
    layerList.add(layer);
    layerList.setActive(layerList.length - 1);
    activeIndex = getReversedIndex(layerList.length - 1);
    layers = getLayers();
  }

  function setActive(reversedIndex: number) {
    layerList?.setActive(getIndex(reversedIndex));
    activeIndex = reversedIndex;
  }

  function setVisible(reversedIndex: number, visible: boolean) {
    if (!layerList) return;

    const layer = layerList.get(getIndex(reversedIndex));
    if (layer) {
      layer.setVisible(visible);
      layers[reversedIndex] = layer;
    }
  }

  const dropCallback = (prevIndex: number, nextIndex: number) => {
    if (layerList && prevIndex !== nextIndex) {
      layerList.changePosition(getIndex(prevIndex), getIndex(nextIndex));
      layers = getLayers();
      if (layerList.activeIndex != null) {
        activeIndex = getReversedIndex(layerList.activeIndex);
      }
    }
  };
</script>

<!-- TODO: create shared ui for dock panels -->
<section>
  <div class="heading">
    <LayersIcon />
    <h3>Слои</h3>
    <button class="add" on:click={addLayer} disabled={!layerList}
      ><AddIcon /></button
    >
  </div>
  <ul use:draggable={{ draggableSelector: 'li', callback: dropCallback }}>
    {#each layers as layer, reversedIndex (layer.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:active={reversedIndex === activeIndex}
        on:click={() => setActive(reversedIndex)}
      >
        {layer.name}
        <div class="actions" class:active={!layer.visible || layer.locked}>
          <button
            on:click|stopPropagation={() =>
              setVisible(reversedIndex, !layer.visible)}
            class:deactivated={!layer.visible}
          >
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
</section>

<style lang="scss">
  .heading {
    background-color: $bg-main;
    padding: spacing(1.25) spacing(3) spacing(1.5) spacing(2);
    line-height: 1;
    position: relative;
    /* FIXME: this is a hack */
    height: 1.75rem;

    h3 {
      display: inline-block;
      margin: 0;
      margin-left: calc(1.25rem + #{spacing(1.5)});
    }

    > :global(svg) {
      position: absolute;
      top: spacing(1);
      left: spacing(2);
      font-size: 1.25rem;
      color: $border-color;
    }
  }

  .add {
    @include reset-button(true);
    @include action-cursor;
    position: absolute;
    top: spacing(1.5);
    right: spacing(2);

    &:disabled {
      cursor: url('/icons/cursor-default.svg'), auto;
    }

    > :global(svg) {
      font-size: 1rem;
      color: $border-color;
    }
  }

  ul {
    list-style-type: none;
    padding: spacing(0.5);
    max-height: spacing(72);
    overflow-y: auto;

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
      padding: 0 spacing(2);

      :global(svg) {
        font-size: 0.75rem;
        color: #fff;
      }

      &.deactivated {
        :global(svg) {
          opacity: 0.5;
        }
      }
    }
  }
</style>
