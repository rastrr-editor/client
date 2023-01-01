import { asyncIter, events } from '@rastrr-editor/core';
import getCoords from './getCoords';

export default function createPointerIterable(
  initialEvent: PointerEvent,
  boundingContainer: HTMLElement = document.body,
  offset: Rastrr.Point = { x: 0, y: 0 }
): AsyncIterable<Rastrr.Point> {
  const coords = getCoords(boundingContainer);
  // TODO: refactor using dot notation
  return asyncIter.map(
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
        // TODO: it's better to use offsetX, offsetY
        // because it prevents cursor jumps when user reaches the container border,
        // but there are problems when canvas container has scroll
        return !(
          e.pageX < coords.left ||
          e.pageX > coords.right ||
          e.pageY < coords.top ||
          e.pageY > coords.bottom
        );
      }
    ),
    (e) => ({
      x: e.offsetX - offset.x,
      y: e.offsetY - offset.y,
    })
  );
}
