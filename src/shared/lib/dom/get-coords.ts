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
  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    bottom: box.bottom + window.scrollY,
    right: box.right + window.scrollX,
  };
}
