import { get } from 'svelte/store';
import { viewport as viewportStore } from './store';

const IMAGE_MIME_TYPE = {
  png: 'image/png',
  jpg: 'image/jpeg',
};

export default function exportImage(name: string, ext: 'png' | 'jpg'): void {
  const viewport = get(viewportStore);
  if (viewport == null) {
    return;
  }
  viewport
    .toBlob(IMAGE_MIME_TYPE[ext], ext === 'jpg' ? 0.85 : undefined)
    .then((blob) => {
      if (blob == null) {
        throw new Error('No blob');
      }
      // NOTE: consider using browser.downloads API if possible
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `${name}.${ext}`;
      // Simulate link click to download the image
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataUrl);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', fileName);
      if (typeof document.createEvent === 'function') {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        anchor.dispatchEvent(event);
      } else if (typeof anchor.click === 'function') {
        anchor.click();
      }
      // 10 seconds should be enough to download the image
      setTimeout(() => {
        URL.revokeObjectURL(dataUrl);
      }, 10000);
    })
    .catch((error) => {
      console.error(error);
      // TODO: show custom error
      alert('Не удалось экспортировать изображение!');
    });
}
