import { hotkeys } from '~/features/hotkeys-manager';
import { brushConstants, BrushTool } from '~/features/tools/brush';
import { eraserConstants, EraserTool } from '~/features/tools/eraser';
import {
  ellipseConstants,
  EllipseTool,
  rectConstants,
  RectTool,
} from '~/features/tools/shape';
import { toolStore, type Tool } from '~/entities/tool';

import { handleHistoryHotkeys, HistoryEvents } from './handle-history-hotkeys';

import saveProject from '../save-project';
import { viewport } from '../store';

export default function registerHotkeys(): () => void {
  const control = /Mac/i.test(navigator.platform) ? 'meta' : 'control';

  const subscriptions: Array<() => void> = [];

  subscriptions.push(hotkeys.register([control, 'z'], HistoryEvents.UNDO));
  subscriptions.push(
    hotkeys.register([control, 'shift', 'z'], HistoryEvents.REDO),
  );

  subscriptions.push(viewport.subscribe(handleHistoryHotkeys));

  subscriptions.push(hotkeys.register([control, 's'], 'save'));

  hotkeys.emitter.on('activated:save', (_alias, _ctx, e) => {
    e.preventDefault();
    saveProject().then(() => console.log('Saved'));
  });

  subscriptions.push(() =>
    hotkeys.emitter.removeAllListeners('activated:save'),
  );

  type ToolClass = new (options?: unknown) => Tool;
  type ToolConstants = { hotkey: string; id: string };

  const tools: Array<[ToolConstants, ToolClass | null]> = [
    [{ hotkey: 'V', id: 'cursor' }, null],
    [brushConstants, BrushTool as ToolClass],
    [eraserConstants, EraserTool as ToolClass],
    [ellipseConstants, EllipseTool as ToolClass],
    [rectConstants, RectTool as ToolClass],
  ];

  tools.forEach(([{ hotkey, id }, Tool]) => {
    subscriptions.push(hotkeys.register([hotkey], `tool:${id}`));

    const event: `activated:${string}` = `activated:tool:${id}`;

    hotkeys.emitter.on(event, () => {
      console.log(Tool?.name);
      toolStore.activeTool.set(Tool ? new Tool() : null);
    });

    subscriptions.push(() => hotkeys.emitter.removeAllListeners(event));
  });

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
}
