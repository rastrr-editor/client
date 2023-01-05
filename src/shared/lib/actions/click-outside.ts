import type { Action } from 'svelte/types/runtime/action';

type СlickOutsideOptions = {
  excludeSelectors?: string[];
  callback: () => void;
};

const clickOutside: Action = (
  node: HTMLElement,
  { excludeSelectors = [], callback }: СlickOutsideOptions
) => {
  const handleClick = (event: MouseEvent): void => {
    const targetElement = event.target as HTMLElement;

    const hasEventOnExcluded = excludeSelectors.some((selector) =>
      targetElement.closest(selector)
    );

    if (
      !node?.contains(targetElement) &&
      !hasEventOnExcluded &&
      !event.defaultPrevented
    ) {
      callback();
    }
  };

  document.body.addEventListener('click', handleClick, true);
  document.body.addEventListener('contextmenu', handleClick, true);

  return {
    update({ callback: newCallback }) {
      callback = newCallback;
    },
    destroy() {
      document.body.removeEventListener('click', handleClick, true);
      document.body.removeEventListener('contextmenu', handleClick, true);
    },
  };
};

export default clickOutside;
