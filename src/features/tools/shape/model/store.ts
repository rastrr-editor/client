import { persistent } from '~/shared/lib/persistent-store';
import type { ShapeOptions } from '../types';

export const options = persistent<ShapeOptions>('shape', { type: 'rect' });
