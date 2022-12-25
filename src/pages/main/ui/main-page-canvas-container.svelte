<script lang="ts">
  import { get } from 'svelte/store';
  import { LayerFactory, Viewport } from '@rastrr-editor/core';
  import { onMount } from 'svelte';
  import { projectStore } from '~/entities/project';
  import { toolStore } from '~/entities/tool';
  import { viewport as viewportStore } from '../model/store';
  import { chooseColorStore } from '~/features/tools/choose-color';

  let container: HTMLElement;
  let cursor = '';
  toolStore.activeTool.subscribe((tool) => {
    cursor = tool?.getCursor() ?? 'url(/icons/cursor-default.svg)';
  });
  const CanvasLayerFactory = LayerFactory.setType('canvas');

  // NOTE: this is WIP - refactor nedeed
  onMount(() => {
    container.addEventListener('pointerdown', (event) => {
      const viewport = get(viewportStore);
      const activeTool = get(toolStore.activeTool);
      if (event.button === 0 && activeTool && viewport) {
        const command = activeTool.createCommand(viewport, {
          triggerEvent: event,
          color: get(chooseColorStore.mainColor),
        });
        command?.execute().then((done) =>
          // TODO: add to history
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
        // FIXME: this sometimes works incorrectly
        htmlSizeDelta: { x: 0, y: -6 },
      });
      // Create new viewport if active project has changed
      viewportStore.set(viewport);
      const layer = CanvasLayerFactory.filled(
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
