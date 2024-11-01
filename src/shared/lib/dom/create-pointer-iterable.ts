import { asyncIter, events } from '@rastrr-editor/core';
import getCoords from './get-coords';

export default function createPointerIterable(
  initialEvent: PointerEvent,
  boundingContainer: HTMLElement = document.body,
  offset: Rastrr.Point = { x: 0, y: 0 },
): AsyncIterable<Rastrr.Point> {
  const coords = getCoords(boundingContainer);
  const maxYDiff = (coords.bottom - coords.top) * 0.5;
  const maxXDiff = (coords.right - coords.left) * 0.5;
  // NOTE: it's a hack. It would be better to have points in iterable as pairs [prev, curr]
  let prevPoint: Rastrr.Point | null = null;
  // TODO: refactor using dot notation
  return asyncIter.every(
    asyncIter.map(
      asyncIter.every(
        asyncIter.seq(
          asyncIter.toAsyncIter([initialEvent]),
          asyncIter.until(
            asyncIter.any(
              events.on(document.body, 'pointermove'),
              events.on(document.body, 'pointerup'),
            ),
            events.onlyEvent('pointerup'),
          ),
        ),
        (e) => {
          return !(
            e.pageX < coords.left ||
            e.pageX > coords.right ||
            e.pageY < coords.top ||
            e.pageY > coords.bottom
          );
        },
      ),
      (e) => {
        const point = {
          x: e.offsetX - offset.x,
          y: e.offsetY - offset.y,
        };
        return point;
      },
    ),
    (point) => {
      // Ignore fluctuations to prevent cursor jumps when user reaches the container border.
      // It is a fluctuation if x and y have different signs and difference is more than 50% of height or width
      // NOTE: x * y < 0 means that "x" and "y" have different signs
      if (
        prevPoint != null &&
        ((prevPoint.y * point.y < 0 &&
          Math.abs(prevPoint.y - point.y) > maxYDiff) ||
          (prevPoint.x * point.x < 0 &&
            Math.abs(prevPoint.x - point.x) > maxXDiff))
      ) {
        return false;
      }
      prevPoint = point;
      return true;
    },
  );
}
