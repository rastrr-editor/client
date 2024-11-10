import type { Action } from 'svelte/action';

import { push, replace } from '~/shared/lib/router';

type LinkOptions = {
  replace?: boolean;
};

const link: Action<HTMLAnchorElement, LinkOptions | undefined> = (
  node: HTMLAnchorElement,
  { replace: performReplace = false } = {},
) => {
  const handleClick = (e: MouseEvent) => {
    const url = node.getAttribute('href') ?? '';

    if (url.length > 0 && !url.startsWith('/')) {
      return;
    }

    e.preventDefault();

    if (performReplace) {
      replace(url);
    } else {
      push(url);
    }
  };

  node.addEventListener('click', handleClick, true);

  return {
    destroy() {
      node.removeEventListener('click', handleClick, true);
    },
  };
};

export default link;
