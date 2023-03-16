import { RenderMode, type Viewport } from '@rastrr-editor/core';

export default function createGotoCommand(
  viewport: Viewport
): (index: number) => void {
  const { history } = viewport;

  return function gotoCommand(index: number) {
    if (history.isLocked) {
      return;
    }
    viewport.setRenderMode(RenderMode.BATCH);
    history
      .goto(index)
      .then((resultingIndex) => {
        if (resultingIndex !== index) {
          // TODO: show custom alert
          alert(
            `Не удалось вернуться к операции: ${index}, текущая операция: ${resultingIndex}`
          );
        }
      })
      .finally(() => {
        viewport.setRenderMode(RenderMode.IMMEDIATE);
      });
  };
}
