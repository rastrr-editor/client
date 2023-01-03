import { LayerFactory, Viewport } from '@rastrr-editor/core';
import { type Writable, get } from 'svelte/store';
import type { Project } from '~/shared/api';

const CanvasLayerFactory = LayerFactory.setType('canvas');

export default function updateViewport(
  container: HTMLElement | null,
  project: Project | null,
  viewportStore: Writable<Viewport | null>
): void {
  let viewport = get(viewportStore);
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
    // Restore layers from project
    if (project.layers.length > 0) {
      // TODO: implement
      // New project
    } else {
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
