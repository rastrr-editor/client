<script lang="ts">
  import { LayerFactory, Viewport } from '@rastrr-editor/core';
  import { projectStore } from '~/entities/project';
  import { toolStore } from '~/entities/tool';

  const { activeTool } = toolStore;

  let container: HTMLElement;
  let viewport: Viewport;
  $: cursor = $activeTool?.getCursor() ?? 'url(/icons/cursor-default.svg)';
  const CanvasLayerFactory = LayerFactory.setType('canvas');

  // NOTE: this is WIP - refactor nedeed
  projectStore.activeProject.subscribe((newProject) => {
    viewport?.destroy();
    if (newProject && container) {
      // Create new viewport if active project has changed
      viewport = new Viewport(container, {
        strategy: 'canvas',
        minOffset: { x: 16, y: 16 },
        canvasSize: { x: newProject.width, y: newProject.height },
        htmlSizeDelta: { x: 0, y: -6 },
      });
      const layer = CanvasLayerFactory.empty(
        newProject.width,
        newProject.height
      );
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
