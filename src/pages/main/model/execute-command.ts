import type { Viewport } from '@rastrr-editor/core';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';

export default function executeCommand(
  viewport: Viewport,
  tool: Tool,
  options: ToolCreateCommandOptions<MouseEvent>,
) {
  const command = tool.createCommand(viewport, options);

  command
    ?.execute()
    .then((done) => {
      console.log(`Command '${command.name}' result: ${done}`);

      if (done) {
        viewport?.history.push(command);
      }
    })
    .catch(console.error);
}
