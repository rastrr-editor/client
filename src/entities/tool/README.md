# Entity - Tool

This entity describes an abstract tool that can interact with the canvas. Concrete implementations of tools are located in `features/tools`.

## UI

- `ToolHelpTooltip` - help tooltip
- `ToolOptionsTooltip` - options tooltip

## Model

### Classes

- `DrawLineTool` - abstract class for the tools which works with lines: brush, eraser, etc.
- `ShapeTool` - abstract class for the shape tools: rectangle, ellipse, etc.

### Store

- `activeTool` - current tool
- `toolCursor` - css cursor for the current tool
