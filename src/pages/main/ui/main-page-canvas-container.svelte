<script lang="ts">
  import { get } from 'svelte/store';
  import { LayerFactory, Viewport } from '@rastrr-editor/core';
  import { onMount } from 'svelte';
  import { projectStore } from '~/entities/project';
  import { toolStore, type Tool } from '~/entities/tool';
  import { viewport as viewportStore } from '../model/store';
  import { chooseColorStore } from '~/features/tools/choose-color';

  const { toolCursor } = toolStore;

  let container: HTMLElement;
  const CanvasLayerFactory = LayerFactory.setType('canvas');

  // NOTE: this is WIP - refactor nedeed
  onMount(() => {
    let viewport: Viewport | null = null;
    let activeTool: Tool<any, any> | null = null;
    const unsubsribeViewport = viewportStore.subscribe((value) => {
      viewport = value;
    });
    const unsubsribeActiveTool = toolStore.activeTool.subscribe((value) => {
      activeTool = value;
    });

    const onPointerDown = (event: MouseEvent) => {
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
    };
    container.addEventListener('pointerdown', onPointerDown);
    return () => {
      unsubsribeViewport();
      unsubsribeActiveTool();
      container.removeEventListener('pointerdown', onPointerDown);
    };
  });

  projectStore.activeProject.subscribe((newProject) => {
    let viewport = get(viewportStore);
    viewport?.destroy();
    if (newProject && container) {
      viewport = new Viewport(container, {
        strategy: 'canvas',
        minOffset: { x: 16, y: 40 },
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

<!-- NOTE: max cursor size is 128 x 128, @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#icon_size_limits -->
<main
  id="canvas-container"
  style:--cursor={$toolCursor}
  bind:this={container}
/>

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
    overflow-x: auto;
    cursor: var(--cursor), auto;
  }
</style>
