export function calculateLeftPosition(
  menu: HTMLElement,
  left: number,
  gap: number
): string {
  let calculatedLeftPosition = left;
  if (left + menu.clientWidth > window.innerWidth) {
    calculatedLeftPosition = window.innerWidth - menu.clientWidth - gap;
  }

  return `${calculatedLeftPosition}px`;
}

export function calculateTopPosition(
  menu: HTMLElement,
  top: number,
  gap: number
): string {
  let calculatedTopPosition = top;
  if (top + menu.clientHeight > window.innerHeight) {
    calculatedTopPosition = window.innerHeight - menu.clientHeight - gap;
  }

  return `${calculatedTopPosition}px`;
}
