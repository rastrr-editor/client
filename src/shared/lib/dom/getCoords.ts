type CoordsResult = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

/**
 * @param element
 * @returns Element coordinates on page regarding window scroll
 */
export default function getCoords(element: HTMLElement): CoordsResult {
  const box = element.getBoundingClientRect();
  const { scrollY, scrollX } = window;
  return {
    top: box.top + scrollY,
    left: box.left + scrollX,
    bottom: box.bottom + scrollY,
    right: box.right + scrollX,
  };
}
