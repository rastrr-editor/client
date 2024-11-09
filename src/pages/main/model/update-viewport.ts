import { Color, LayerFactory, Viewport, type Layer } from '@rastrr-editor/core';
import { type Writable, get } from 'svelte/store';
import type { Project } from '~/shared/api';
import { TOOL_CURSOR_COLOR } from '~/shared/config';

const CanvasLayerFactory = LayerFactory.setType('canvas');

export default function updateViewport(
  viewportStore: Writable<Viewport | null>,
  container?: HTMLElement,
  project?: Project,
): void {
  if (container == null || project == null) {
    return;
  }

  let viewport = get(viewportStore);

  // Preserve in memory layers
  // FIXME: viewport must be updated only when the project changes
  let inMemoryLayers: Layer[] | null = null;
  const inMemoryActiveIndex: number | undefined = viewport?.layers.activeIndex;

  if (project?.id != null && viewport?.meta === project?.id) {
    inMemoryLayers = Array.from(viewport?.layers ?? []);
  }

  // Cleanup
  viewport?.destroy();

  viewport = new Viewport(container, {
    strategy: 'canvas',
    minOffset: { x: 16, y: 40 },
    imageSize: { x: project.width, y: project.height },
    // FIXME: this sometimes works incorrectly
    htmlSizeDelta: { x: 0, y: -6 },
    workingAreaBorderColor: project.hasTransparentBackground
      ? Color.from(TOOL_CURSOR_COLOR, 'hex')
      : null,
  });

  viewport.setMeta(project.id);

  // Restore layers from memory
  if (inMemoryLayers != null) {
    for (const layer of inMemoryLayers) {
      viewport.layers.add(layer);
    }

    viewport.layers.setActive(
      inMemoryActiveIndex ?? viewport.layers.length - 1,
    );

    // Restore layers from project
  } else if (project.layers.length > 0) {
    // TODO: move to core
    for (const layerData of project.layers) {
      const layer = CanvasLayerFactory.empty(
        layerData.width,
        layerData.height,
        { opacity: layerData.opacity, id: layerData.id },
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

    // New project
  } else {
    const layer = project.hasTransparentBackground
      ? CanvasLayerFactory.empty(project.width, project.height)
      : CanvasLayerFactory.filled(project.width, project.height);

    layer.name = 'Фон';
    viewport.layers.add(layer);
    viewport.layers.setActive(0);
  }

  viewportStore.set(viewport);
}
