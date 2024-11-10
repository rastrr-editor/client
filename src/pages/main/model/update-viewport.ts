import { type Writable, get } from 'svelte/store';
import { Color, LayerFactory, Viewport, type Layer } from '@rastrr-editor/core';

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
  let layers: Iterable<Layer>;
  let activeIndex = 0;

  // Preserve layers for HMR
  if (
    import.meta.hot &&
    project.id != null &&
    viewport != null &&
    viewport.meta === project.id
  ) {
    layers = Array.from(viewport.layers);
    activeIndex = viewport.layers.activeIndex ?? viewport.layers.length - 1;

    viewport?.destroy();
    viewport = createViewport(container, project);
    fillViewport(viewport, layers, activeIndex);

    viewportStore.set(viewport);
    return;
  }

  viewport?.destroy();
  viewport = createViewport(container, project);

  // Restore layers from project
  if (project.layers.length > 0) {
    // TODO: move to core
    layers = (function* () {
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

        yield layer;
      }
    })();

    // New project
  } else {
    const layer = project.hasTransparentBackground
      ? CanvasLayerFactory.empty(project.width, project.height)
      : CanvasLayerFactory.filled(project.width, project.height);

    layer.name = 'Фон';
    layers = [layer];
  }

  fillViewport(viewport, layers, activeIndex);
  viewportStore.set(viewport);
}

function createViewport(container: HTMLElement, project: Project): Viewport {
  const viewport = new Viewport(container, {
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

  return viewport;
}

function fillViewport(
  viewport: Viewport,
  layers: Iterable<Layer>,
  activeIndex?: number,
) {
  for (const layer of layers) {
    viewport.layers.add(layer);
  }

  if (activeIndex != null) {
    viewport.layers.setActive(activeIndex);
  }
}
