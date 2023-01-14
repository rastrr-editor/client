import { asyncIter, events } from '@rastrr-editor/core';
import getCoords from './get-coords';

export default function createPointerIterable(
  initialEvent: PointerEvent,
  boundingContainer: HTMLElement = document.body,
  offset: Rastrr.Point = { x: 0, y: 0 }
): AsyncIterable<Rastrr.Point> {
  const coords = getCoords(boundingContainer);
  // NOTE: it's a hack. It would be better to have points in iterable as pairs [prev, curr]
  let prevPoint: Rastrr.Point | null = null;
  // TODO: refactor using dot notation
  return asyncIter.filter(
    asyncIter.map(
      asyncIter.every(
        asyncIter.seq(
          asyncIter.toAsyncIter([initialEvent]),
          asyncIter.until(
            asyncIter.any(
              events.on(document.body, 'pointermove'),
              events.on(document.body, 'pointerup')
            ),
            events.onlyEvent('pointerup')
          )
        ),
        (e) => {
          return !(
            e.pageX < coords.left ||
            e.pageX > coords.right ||
            e.pageY < coords.top ||
            e.pageY > coords.bottom
          );
        }
      ),
      (e) => {
        const point = {
          x: e.offsetX - offset.x,
          y: e.offsetY - offset.y,
        };
        return point;
      }
    ),
    (point) => {
      // Ignore fluctuations to prevent cursor jumps when user reaches the container border
      // NOTE: a * b < 0 means that "a" and "b" have different signs
      if (
        prevPoint != null &&
        (prevPoint.y * point.y < 0 || prevPoint.x * point.x < 0)
      ) {
        return false;
      }
      prevPoint = point;
      return true;
    }
  );
}
