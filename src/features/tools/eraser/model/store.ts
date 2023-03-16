import { persistent } from '~/shared/lib/persistent-store';
import type { EraserOptions } from '../types';

export const options = persistent<EraserOptions>('eraser', { size: 10 });
