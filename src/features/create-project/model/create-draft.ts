import type { Project } from '~/shared/api';

import { MAX_PROJECT_SIZE } from '../config';

export default function createDraft(width: number, height: number): Project {
  // Reset to basic size
  if (width * height > MAX_PROJECT_SIZE) {
    width = 640;
    height = 480;
  }

  return {
    name: new Date().toLocaleString(),
    preview: null,
    width,
    height,
    hasTransparentBackground: false,
    createdAt: new Date(),
    updatedAt: null,
    layers: [],
  };
}
