<script lang="ts">
  import { Color, LayerFactory, type Viewport } from '@rastrr-editor/core';
  import { getCoords } from '~/shared/lib/dom';
  import { LayersIcon, AddIcon } from '~/shared/ui/icons';
  import InvisibleIcon from '~/shared/ui/icons/invisible-icon.svelte';
  import VisibleIcon from '~/shared/ui/icons/visible-icon.svelte';

  export let viewport: Viewport | null = null;

  $: layers = Array.from(viewport?.layers?.reverse() ?? []);

  $: activeIndex = viewport?.layers.activeIndex
    ? getReversedIndex(viewport?.layers.activeIndex)
    : undefined;

  $: createdCount = (viewport && 0) || 0;

  function getIndex(reversedIndex: number): number {
    return (viewport?.layers.length ?? 0) - 1 - reversedIndex;
  }

  function getReversedIndex(index: number): number {
    return (viewport?.layers.length ?? 0) - 1 - index;
  }

  function getLayers() {
    return Array.from(viewport?.layers?.reverse() ?? []);
  }

  function addLayer() {
    if (!viewport) return;
    // TODO: factory should be a global object
    const layer = LayerFactory.setType('canvas').filled(
      viewport.options.canvasSize.x,
      viewport.options.canvasSize.y,
      new Color(0, 0, 0, 0)
    );
    layer.name = `Новый слой${createdCount > 0 ? ` ${createdCount}` : ''}`;
    createdCount += 1;
    viewport.layers.add(layer);
    viewport.layers.setActive(viewport.layers.length - 1);
    activeIndex = getReversedIndex(viewport.layers.length - 1);
    layers = getLayers();
  }

  function setActive(reversedIndex: number) {
    viewport?.layers.setActive(getIndex(reversedIndex));
    activeIndex = reversedIndex;
  }

  function setVisible(reversedIndex: number, visible: boolean) {
    if (!viewport) return;

    const layer = viewport.layers.get(getIndex(reversedIndex));
    if (layer) {
      layer.setVisible(visible);
      layers[reversedIndex] = layer;
    }
  }

  // TODO: refactor to a drag&drop action
  let list: HTMLElement;
  let nodes: Array<{
    el: HTMLElement;
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>;
  let originalPosition: number;
  let newPosition: number;
  let dragNode: HTMLElement;
  let cloneNode: HTMLElement;
  let shiftX: number;
  let shiftY: number;
  let isDragging = false;

  function dragStart(this: HTMLElement, event: MouseEvent) {
    const { top, left } = getCoords(this);
    const startDrag = () => {
      nodes = Array.from(list.querySelectorAll('li'), (el) => ({
        el,
        ...getCoords(el),
      }));
      newPosition = originalPosition = nodes.findIndex(({ el }) => el === this);
      isDragging = true;
      const { clientX, clientY } = event;
      shiftX = clientX - left;
      shiftY = clientY - top;
      cloneNode = this.cloneNode(true) as HTMLElement;
      cloneNode.style.display = 'none';
      cloneNode.classList.add('mirror');
      this.after(cloneNode);
      dragNode = this.cloneNode(true) as HTMLElement;
      this.parentElement!.append(dragNode);
      dragNode.focus();
      dragNode.style.width = `${this.clientWidth}px`;
      dragNode.style.position = 'fixed';
      dragNode.style.top = '0px';
      dragNode.style.left = '0px';
      dragNode.style.transform = `translate3d(${event.pageX - shiftX}px, ${
        event.pageY - shiftY
      }px, 0px)`;
      dragNode.style.zIndex = '1';
      document.addEventListener('pointermove', dragMove);
      document.addEventListener(
        'pointerup',
        createDragEnd(this, dragNode, cloneNode)
      );

      this.classList.add('dragging');
    };
    const timeout = setTimeout(startDrag, 150);

    // User clicked
    this.addEventListener(
      'pointerup',
      () => {
        clearTimeout(timeout);
      },
      { once: true }
    );
  }

  function dragMove(event: MouseEvent) {
    if (dragNode) {
      dragNode.style.transform = `translate3d(${event.pageX - shiftX}px, ${
        event.pageY - shiftY
      }px, 0px)`;
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const topDiff = event.pageY - node.top;
        const bottomDiff = node.bottom - event.pageY;
        // Vertical
        if (topDiff > 0 && bottomDiff > 0) {
          if (i === originalPosition) {
            cloneNode.style.display = 'none';
            node.el.after(cloneNode);
          } else {
            if (topDiff > bottomDiff && i + 1 !== originalPosition) {
              cloneNode.style.display = getComputedStyle(dragNode).display;
              node.el.after(cloneNode);
            } else if (topDiff < bottomDiff && i - 1 !== originalPosition) {
              cloneNode.style.display = getComputedStyle(dragNode).display;
              node.el.before(cloneNode);
            }
          }
          break;
        }
      }
    }
  }

  function createDragEnd(
    original: HTMLElement,
    dragNode: HTMLElement,
    cloneNode: HTMLElement
  ): (event: MouseEvent) => void {
    const pointerup = function () {
      dragNode.remove();
      cloneNode.after(original);
      cloneNode.remove();
      const newPosition = Array.from(list.children).indexOf(original);
      original.classList.remove('dragging');
      document.removeEventListener('pointermove', dragMove);
      document.removeEventListener('pointerup', pointerup);
      isDragging = false;
      console.log('prev', originalPosition, 'next', newPosition);

      if (viewport && originalPosition !== newPosition) {
        viewport.layers.changePosition(
          getIndex(originalPosition),
          getIndex(newPosition)
        );
        layers = getLayers();
        console.log(layers);
        if (viewport.layers.activeIndex) {
          activeIndex = getReversedIndex(viewport.layers.activeIndex);
        }
      }
    };
    return pointerup;
  }
</script>

<!-- TODO: create shared ui for dock panels -->
<section>
  <div class="heading">
    <LayersIcon />
    <h3>Слои</h3>
    <button class="add" on:click={addLayer} disabled={!viewport}
      ><AddIcon /></button
    >
  </div>
  <ul bind:this={list}>
    {#each layers as layer, reversedIndex (layer.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:active={reversedIndex === activeIndex}
        on:pointerdown={dragStart}
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
