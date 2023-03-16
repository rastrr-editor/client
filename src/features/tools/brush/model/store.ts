import { persistent } from '~/shared/lib/persistent-store';
import type { BrushOptions } from '../types';

export const options = persistent<BrushOptions>('brush-tool', {
  size: 10,
  opacity: 1,
});
