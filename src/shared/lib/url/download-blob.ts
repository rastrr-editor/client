export default function downloadBlob(blob: Blob, fileName: string): void {
  // NOTE: consider using browser.downloads API if possible
  const dataUrl = URL.createObjectURL(blob);
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
}
