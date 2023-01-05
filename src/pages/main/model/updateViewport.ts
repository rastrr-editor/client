import { LayerFactory, Viewport, type Layer } from '@rastrr-editor/core';
import { type Writable, get } from 'svelte/store';
import type { Project } from '~/shared/api';

const CanvasLayerFactory = LayerFactory.setType('canvas');

export default function updateViewport(
  container: HTMLElement | null,
  project: Project | null,
  viewportStore: Writable<Viewport | null>
): void {
  let viewport = get(viewportStore);
  // Preserve in memory layers
  let inMemoryLayers: Layer[] | null = null;
  const inMemoryActiveIndex: number | undefined = viewport?.layers.activeIndex;
  if (viewport?.meta === project?.id) {
    inMemoryLayers = Array.from(viewport?.layers ?? []);
  }
  // Cleanup
  viewport?.destroy();
  if (project != null && container != null) {
    viewport = new Viewport(container, {
      strategy: 'canvas',
      minOffset: { x: 16, y: 40 },
      canvasSize: { x: project.width, y: project.height },
      // FIXME: this sometimes works incorrectly
      htmlSizeDelta: { x: 0, y: -6 },
    });
    viewport.setMeta(project.id);
    // Restore layers from memory
    if (inMemoryLayers != null) {
      for (const layer of inMemoryLayers) {
        viewport.layers.add(layer);
      }
      viewport.layers.setActive(
        inMemoryActiveIndex ?? viewport.layers.length - 1
      );
    } else if (project.layers.length > 0) {
      // Restore layers from project
      // TODO: move to core
      for (const layerData of project.layers) {
        const layer = CanvasLayerFactory.empty(
          layerData.width,
          layerData.height,
          { opacity: layerData.opacity, id: layerData.id }
        );
        layer.name = layerData.name;
        layer.locked = layerData.locked;
        layer.setVisible(layerData.visible);
        layer.setOffset(layerData.offset);
        // TODO: Restore alpha data
        layer.setData(layerData.data);
        viewport.layers.add(layer);
      }
      viewport.layers.setActive(viewport.layers.length - 1);
    } else {
      // New project
      const layer = CanvasLayerFactory.filled(project.width, project.height);
      layer.name = 'Фон';
      if (project.hasTransparentBackground) {
        layer.setOpacity(0);
      }
      viewport.layers.add(layer);
      viewport.layers.setActive(0);
    }
    viewportStore.set(viewport);
  }
}
