<script lang="ts">
  import { LayerFactory, Viewport } from '@rastrr-editor/core';
  import { projectStore } from '~/entities/project';

  let container: HTMLElement;
  let viewport: Viewport;
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

<main id="canvas-container" bind:this={container} />

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
    overflow-x: auto;
  }
</style>
