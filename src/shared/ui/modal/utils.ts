import type { Action } from 'svelte/types/runtime/action';

const tabbableElementsSelector = `
  a[href],
  input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),
  select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  *[tabindex]:not([tabindex='-1']):not([disabled]),
  *[contenteditable=true]
`;

const focusTrap: Action = (node: HTMLElement) => {
  const tabbableElements = [
    ...node.querySelectorAll<HTMLElement>(tabbableElementsSelector),
  ];

  function keyboardEventHandler(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || event.code !== 'Tab') return;

    const focusedElement = document.activeElement as HTMLElement;
    let activeElementIndex =
      focusedElement !== null ? tabbableElements.indexOf(focusedElement) : -1;

    if (activeElementIndex === -1 && event.shiftKey) activeElementIndex = 0;
    activeElementIndex += tabbableElements.length + (event.shiftKey ? -1 : 1);
    activeElementIndex %= tabbableElements.length;

    tabbableElements[activeElementIndex].focus();

    event.preventDefault();
  }

  document.addEventListener('keydown', keyboardEventHandler, true);

  return {
    destroy() {
      document.removeEventListener('keydown', keyboardEventHandler, true);
    },
  };
};

export default focusTrap;
