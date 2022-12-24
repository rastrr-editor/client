import type { Position } from './types';

export function calculateLeftPosition(
  trigger: HTMLElement,
  tooltip: HTMLElement,
  position: Position,
  gap: number
): string {
  const triggerLeftPosition = trigger.getBoundingClientRect().x;

  let calculatedLeftPosition = 0;
  if (position === 'top' || position === 'bottom') {
    calculatedLeftPosition =
      triggerLeftPosition + trigger.offsetWidth / 2 - tooltip.clientWidth / 2;
  }

  if (position === 'left') {
    calculatedLeftPosition = triggerLeftPosition - tooltip.offsetWidth - gap;
  }

  if (position === 'right') {
    calculatedLeftPosition = triggerLeftPosition + trigger.offsetWidth + gap;
  }

  if (calculatedLeftPosition < gap) {
    if (position === 'left') {
      calculatedLeftPosition = triggerLeftPosition + trigger.offsetWidth + gap;
    } else {
      calculatedLeftPosition = gap;
    }
  }

  if (calculatedLeftPosition + tooltip.clientWidth + gap > window.innerWidth) {
    if (position === 'right') {
      calculatedLeftPosition = triggerLeftPosition - tooltip.offsetWidth - gap;
    } else {
      calculatedLeftPosition = window.innerWidth - tooltip.clientWidth - gap;
    }
  }

  return `${calculatedLeftPosition}px`;
}

export function calculateTopPosition(
  trigger: HTMLElement,
  tooltip: HTMLElement,
  position: Position,
  gap: number
): string {
  const triggerTopPosition = trigger.getBoundingClientRect().y;

  let calculatedTopPosition = 0;
  if (position === 'top') {
    calculatedTopPosition = triggerTopPosition - tooltip.offsetHeight - gap;
  }

  if (position === 'bottom') {
    calculatedTopPosition = triggerTopPosition + trigger.offsetHeight + gap;
  }

  if (position === 'left' || position === 'right') {
    calculatedTopPosition =
      triggerTopPosition + trigger.offsetHeight / 2 - tooltip.offsetHeight / 2;
  }

  if (calculatedTopPosition < gap) {
    if (position === 'top') {
      calculatedTopPosition = triggerTopPosition + trigger.offsetHeight + gap;
    } else {
      calculatedTopPosition = gap;
    }
  }

  if (calculatedTopPosition + tooltip.clientHeight + gap > window.innerHeight) {
    if (position === 'bottom') {
      calculatedTopPosition = triggerTopPosition - tooltip.offsetHeight - gap;
    } else {
      calculatedTopPosition = window.innerHeight - tooltip.clientHeight - gap;
    }
  }

  return `${calculatedTopPosition}px`;
}
