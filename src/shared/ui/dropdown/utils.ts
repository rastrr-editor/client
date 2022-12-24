import type { XPlacement, YPlacement, PlacementPosition } from './types';

export const X_PLACEMENT_POSITION_VALUES: Record<
  XPlacement,
  PlacementPosition
> = {
  start: '0%',
  center: '50%',
  end: '100%',
};

export const Y_PLACEMENT_POSITION_VALUES: Record<
  YPlacement,
  PlacementPosition
> = {
  top: '0%',
  middle: '50%',
  bottom: '100%',
};
