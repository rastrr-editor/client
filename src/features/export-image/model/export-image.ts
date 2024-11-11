import type { Viewport } from '@rastrr-editor/core';
import { downloadBlob } from '~/shared/lib/url';

const IMAGE_MIME_TYPE = {
  png: 'image/png',
  jpg: 'image/jpeg',
};

export default function exportImage(
  viewport: Viewport | null,
  name: string,
  ext: 'png' | 'jpg',
): void {
  if (viewport == null) {
    return;
  }

  viewport
    .toBlob(IMAGE_MIME_TYPE[ext], ext === 'jpg' ? 0.85 : undefined)
    .then((blob) => {
      if (blob == null) {
        throw new Error('No blob');
      }
      const fileName = `${name}.${ext}`;
      downloadBlob(blob, fileName);
    })
    .catch((error) => {
      console.error(error);
      // TODO: show custom error
      alert('Не удалось экспортировать изображение!');
    });
}
