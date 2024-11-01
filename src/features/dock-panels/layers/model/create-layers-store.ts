import type { Layer, LayerList } from '@rastrr-editor/core';

type LayerStoreValue = {
  layers: Layer[];
  activeLayer: Layer | null;
  opacity: number;
};

export type LayersStore = SvelteStore<LayerStoreValue>;

export default function createLayersStore(
  layerList: LayerList | null,
): LayersStore {
  const subscriptions = new Set<(value: LayerStoreValue) => void>();

  const notifySubscribers = (): void => {
    subscriptions.forEach((subscription) => {
      subscription(value);
    });
  };

  const getLayers = (): Layer[] => Array.from(layerList?.reverse() ?? []);

  const value: LayerStoreValue = {
    layers: getLayers(),
    activeLayer: layerList?.activeLayer ?? null,
    opacity: Math.round((layerList?.activeLayer?.opacity ?? 1) * 100),
  };

  const onMove = (): void => {
    value.layers = getLayers();
    notifySubscribers();
  };

  const onActiveChange = (index: number, layer: Layer): void => {
    value.opacity = Math.round(layer.opacity * 100);
    value.activeLayer = layer;
    notifySubscribers();
  };

  const onOpacityChange = (layer: Layer): void => {
    if (layerList?.activeLayer === layer) {
      value.opacity = Math.round(layer.opacity * 100);
      notifySubscribers();
    }
  };

  const onAddLayer = (): void => {
    value.layers = getLayers();
    if (layerList?.activeLayer != null) {
      value.activeLayer = layerList.activeLayer;
    }
    notifySubscribers();
  };

  const onRemoveLayer = (): void => {
    value.layers = getLayers();
    if (layerList?.activeLayer != null) {
      value.activeLayer = layerList.activeLayer;
    }
    notifySubscribers();
  };

  const unsubscribe = (): void => {
    layerList?.emitter.off('activeChange', onActiveChange);
    layerList?.emitter.off('opacityChange', onOpacityChange);
    layerList?.emitter.off('add', onAddLayer);
    layerList?.emitter.off('remove', onRemoveLayer);
    layerList?.emitter.off('move', onMove);
  };

  layerList?.emitter.on('activeChange', onActiveChange);
  layerList?.emitter.on('opacityChange', onOpacityChange);
  layerList?.emitter.on('add', onAddLayer);
  layerList?.emitter.on('remove', onRemoveLayer);
  layerList?.emitter.on('move', onMove);

  return {
    subscribe: (subscription) => {
      subscriptions.add(subscription);
      subscription(value);

      return () => {
        subscriptions.delete(subscription);
        if (subscriptions.size === 0) {
          unsubscribe();
        }
      };
    },
  };
}
