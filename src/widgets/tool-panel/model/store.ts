import { persistent } from '~/shared/lib/persistent-store';

export const position = persistent<'left' | 'bottom'>(
  'tool-panel-position',
  'bottom',
);
