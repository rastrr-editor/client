import { Color } from '@rastrr-editor/core';
import { persistent } from '~/shared/lib/persistent-store';

const parseColorFromJSON = (key: string, value: Color): Color | unknown => {
  if (key === '') {
    const { r, g, b, a } = value;
    return new Color(r, g, b, a);
  }

  return value;
};

export const mainColor = persistent<Color>(
  'choose-color-main',
  new Color(0, 0, 0),
  { reviver: parseColorFromJSON }
);
export const secondaryColor = persistent<Color>(
  'choose-color-secondary',
  new Color(255, 255, 255),
  { reviver: parseColorFromJSON }
);
