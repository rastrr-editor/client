import type { Placement } from './types';

export function calculateLeftPosition(
  trigger: HTMLElement,
  tooltip: HTMLElement,
  placement: Placement,
  gap: number
): string {
  const { x: triggerLeftPosition } = trigger.getBoundingClientRect();

  let calculatedLeftPosition = 0;
  if (placement === 'top' || placement === 'bottom') {
    calculatedLeftPosition =
      triggerLeftPosition + trigger.offsetWidth / 2 - tooltip.clientWidth / 2;
  }

  if (placement === 'left') {
    calculatedLeftPosition = triggerLeftPosition - tooltip.offsetWidth - gap;
  }

  if (placement === 'right') {
    calculatedLeftPosition = triggerLeftPosition + trigger.offsetWidth + gap;
  }

  if (calculatedLeftPosition < 0) {
    if (placement === 'left') {
      calculatedLeftPosition = triggerLeftPosition + trigger.offsetWidth + gap;
    } else {
      calculatedLeftPosition = gap;
    }
  }

  if (calculatedLeftPosition + tooltip.clientWidth > window.innerWidth) {
    if (placement === 'right') {
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
  placement: Placement,
  gap: number
): string {
  const { y: triggerTopPosition } = trigger.getBoundingClientRect();

  let calculatedTopPosition = 0;
  if (placement === 'top') {
    calculatedTopPosition = triggerTopPosition - tooltip.offsetHeight - gap;
  }

  if (placement === 'bottom') {
    calculatedTopPosition = triggerTopPosition + trigger.offsetHeight + gap;
  }

  if (placement === 'left' || placement === 'right') {
    calculatedTopPosition =
      triggerTopPosition + trigger.offsetHeight / 2 - tooltip.offsetHeight / 2;
  }

  if (calculatedTopPosition < 0) {
    if (placement === 'top') {
      calculatedTopPosition = triggerTopPosition + trigger.offsetHeight + gap;
    } else {
      calculatedTopPosition = gap;
    }
  }

  if (calculatedTopPosition + tooltip.clientHeight > window.innerHeight) {
    if (placement === 'bottom') {
      calculatedTopPosition = triggerTopPosition - tooltip.offsetHeight - gap;
    } else {
      calculatedTopPosition = window.innerHeight - tooltip.clientHeight - gap;
    }
  }

  return `${calculatedTopPosition}px`;
}
