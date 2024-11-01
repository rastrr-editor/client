import type { Action } from 'svelte/action';

const tabbableElementsSelector = `
  a[href],
  input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),
  select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  *[tabindex]:not([tabindex='-1']):not([disabled]),
  *[contenteditable=true]
`;

const focusTrap: Action<HTMLElement, boolean | undefined> = (node, active: boolean | undefined = true) => {
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

  if (active) {
    document.addEventListener('keydown', keyboardEventHandler, true);
  }

  return {
    update(newActive: boolean = true) {
      if (newActive) {
        document.addEventListener('keydown', keyboardEventHandler, true);
      } else {
        document.removeEventListener('keydown', keyboardEventHandler, true);
      }
    },
    destroy() {
      document.removeEventListener('keydown', keyboardEventHandler, true);
    },
  };
};

export default focusTrap;
