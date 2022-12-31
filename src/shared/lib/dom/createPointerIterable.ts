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
      (e) =>
        !(
          e.offsetX < coords.left ||
          e.offsetX > coords.right ||
          e.offsetY < coords.top ||
          e.offsetY > coords.bottom
        )
    ),
    (e) => ({
      x: e.offsetX - offset.x,
      y: e.offsetY - offset.y,
    })
  );
}
