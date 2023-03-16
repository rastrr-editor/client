import { Color } from '@rastrr-editor/core';
import { persistent } from '~/shared/lib/persistent-store';

const stringifyColorToJSON = (key: string, color: Color): string =>
  color.toString('hex');
const parseColorFromJSON = (key: string, color: string): Color =>
  Color.from(color, 'hex');

const JSONOptions = {
  reviver: parseColorFromJSON,
  replacer: stringifyColorToJSON,
};

export const mainColor = persistent<Color>(
  'choose-color-main',
  new Color(0, 0, 0),
  JSONOptions
);
export const secondaryColor = persistent<Color>(
  'choose-color-secondary',
  new Color(255, 255, 255),
  JSONOptions
);
