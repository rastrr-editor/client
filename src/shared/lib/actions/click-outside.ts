import type { Action } from 'svelte/types/runtime/action';

const clickOutside: Action = (node: HTMLElement, callback: () => void) => {
  const handleClick = (event: MouseEvent): void => {
    const targetElement = event.target as HTMLElement;

    if (!node?.contains(targetElement) && !event.defaultPrevented) {
      callback();
    }
  };

  document.body.addEventListener('click', handleClick, true);
  document.body.addEventListener('contextmenu', handleClick, true);

  return {
    update(newCallback) {
      callback = newCallback;
    },
    destroy() {
      document.body.removeEventListener('click', handleClick, true);
      document.body.removeEventListener('contextmenu', handleClick, true);
    },
  };
};

export default clickOutside;
