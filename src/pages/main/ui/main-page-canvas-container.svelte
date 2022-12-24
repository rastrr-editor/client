<script lang="ts">
  import { get } from 'svelte/store';
  import {
    LayerFactory,
    Viewport,
    events,
    asyncIter,
  } from '@rastrr-editor/core';
  import { onMount } from 'svelte';
  import { projectStore } from '~/entities/project';
  import { toolStore } from '~/entities/tool';
  import { chooseColorStore } from '~/features/tools/choose-color';
  import { viewport as viewportStore } from '../model/store';

  const { activeTool } = toolStore;
  let container: HTMLElement;
  $: cursor = $activeTool?.getCursor() ?? 'url(/icons/cursor-default.svg)';
  const CanvasLayerFactory = LayerFactory.setType('canvas');

  // NOTE: this is WIP - refactor nedeed
  onMount(() => {
    container.addEventListener('pointerdown', (e) => {
      const viewport = get(viewportStore);
      if (
        e.button === 0 &&
        $activeTool &&
        viewport &&
        viewport.layers.activeIndex !== undefined
      ) {
        // TODO: refactor using dot notation
        const iterable = asyncIter.map(
          asyncIter.every(
            asyncIter.any(
              events.on(container, 'pointermove'),
              events.on(container, 'pointerup')
            ),
            (e) => e.type === 'pointermove',
            { includeLast: true }
          ),
          (e) => ({
            x: e.offsetX - viewport.offset.x,
            y: e.offsetY - viewport.offset.y,
          })
        );
        const command = $activeTool.createCommand(
          viewport.layers.activeLayer,
          iterable,
          { color: get(chooseColorStore.mainColor), width: 10 }
        );
        command
          ?.execute()
          .then((done) =>
            console.log(`Command '${command.name}' result: ${done}`)
          );
      }
    });
  });

  projectStore.activeProject.subscribe((newProject) => {
    let viewport = get(viewportStore);
    viewport?.destroy();
    if (newProject && container) {
      viewport = new Viewport(container, {
        strategy: 'canvas',
        minOffset: { x: 16, y: 16 },
        canvasSize: { x: newProject.width, y: newProject.height },
        htmlSizeDelta: { x: 0, y: -6 },
      });
      // Create new viewport if active project has changed
      viewportStore.set(viewport);
      const layer = CanvasLayerFactory.empty(
        newProject.width,
        newProject.height
      );
      layer.name = 'Фон';
      if (newProject.isTransparent) {
        layer.setOpacity(0);
      }
      viewport.layers.add(layer);
    }
  });
</script>

<main id="canvas-container" style:--cursor={cursor} bind:this={container} />

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
    overflow-x: auto;
    cursor: var(--cursor), auto;
  }
</style>
