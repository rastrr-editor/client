<script lang="ts">
  import {
    CursorIcon,
    BrushIcon,
    EraserIcon,
    RectIcon,
    EllipseIcon,
  } from '~/shared/ui/icons';
  import { ShapeTool, toolStore, ToolHelpTooltip } from '~/entities/tool';
  import {
    BrushTool,
    brushConstants,
    BrushOptionsTooltip,
  } from '~/features/tools/brush';
  import {
    EraserTool,
    eraserConstants,
    EraserOptionsTooltip,
  } from '~/features/tools/eraser';
  import {
    type ShapeType,
    options as shapeOptions,
    rectConstants,
    RectTool,
    ellipseConstants,
    EllipseTool,
    ShapeOptionsTooltip,
  } from '~/features/tools/shape';
  import { ChooseColor } from '~/features/tools/choose-color';
  import { position } from '../model/store';
  import type { ShapeToolData, ToolTooltip } from '../types';

  const { activeTool } = toolStore;

  const shapeToolMap: Record<ShapeType, ShapeToolData> = {
    rect: {
      icon: RectIcon,
      tool: RectTool,
      constants: rectConstants,
    },
    ellipse: {
      icon: EllipseIcon,
      tool: EllipseTool,
      constants: ellipseConstants,
    },
  };

  let placement: 'top' | 'right';
  let isShapeToolSelected: boolean;
  let currentShapeToolData: ShapeToolData;

  $: placement = $position === 'bottom' ? 'top' : 'right';
  $: isShapeToolSelected = $activeTool instanceof ShapeTool;
  $: currentShapeToolData = shapeToolMap[$shapeOptions.type];

  function onShapeToolSelect(): void {
    const { tool: CurrentShapeTool } = currentShapeToolData;
    activeTool.set(new CurrentShapeTool());
  }

  $: if (
    isShapeToolSelected &&
    !($activeTool instanceof currentShapeToolData.tool)
  ) {
    onShapeToolSelect();
  }

  const brushTooltip: ToolTooltip = {
    show: false,
    trigger: null,
  };

  const eraserTooltip: ToolTooltip = {
    show: false,
    trigger: null,
  };

  const shapeTooltip: ToolTooltip = {
    show: false,
    trigger: null,
  };
</script>

<div>
  <div
    class="tool-panel"
    class:bottom={$position === 'bottom'}
    class:left={$position === 'left'}>
    <button on:click={() => activeTool.set(null)}><CursorIcon /></button>

    <button
      class:active={$activeTool?.id === brushConstants.id}
      class="withOptions"
      bind:this={brushTooltip.trigger}
      on:click={() => activeTool.set(new BrushTool())}
      on:contextmenu|preventDefault={() => (brushTooltip.show = true)}>
      <BrushIcon />
    </button>

    <button
      class:active={$activeTool?.id === eraserConstants.id}
      class="withOptions"
      bind:this={eraserTooltip.trigger}
      on:click={() => activeTool.set(new EraserTool())}
      on:contextmenu|preventDefault={() => (eraserTooltip.show = true)}>
      <EraserIcon />
    </button>

    <button
      class:active={isShapeToolSelected}
      class="withOptions"
      bind:this={shapeTooltip.trigger}
      on:click={onShapeToolSelect}
      on:contextmenu|preventDefault={() => (shapeTooltip.show = true)}>
      <svelte:component this={currentShapeToolData.icon} />
    </button>

    <ChooseColor
      orientation={$position === 'bottom' ? 'horizontal' : 'vertical'} />
  </div>

  <ToolHelpTooltip
    name={brushConstants.name}
    hotkey={brushConstants.hotkey}
    bind:show={brushTooltip.show}
    trigger={brushTooltip.trigger}
    {placement} />

  <BrushOptionsTooltip
    bind:show={brushTooltip.show}
    trigger={brushTooltip.trigger}
    {placement} />

  <ToolHelpTooltip
    name={eraserConstants.name}
    hotkey={eraserConstants.hotkey}
    bind:show={eraserTooltip.show}
    trigger={eraserTooltip.trigger}
    {placement} />

  <EraserOptionsTooltip
    bind:show={eraserTooltip.show}
    trigger={eraserTooltip.trigger}
    {placement} />

  <ToolHelpTooltip
    name={currentShapeToolData.constants.name}
    hotkey={currentShapeToolData.constants.hotkey}
    bind:show={shapeTooltip.show}
    trigger={shapeTooltip.trigger}
    {placement} />

  <ShapeOptionsTooltip
    bind:show={shapeTooltip.show}
    trigger={shapeTooltip.trigger}
    {placement} />
</div>

<style lang="scss">
  $border-radius: 8px;

  .tool-panel {
    position: absolute;
    border: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: spacing(5);
    background-color: $bg-main;
  }

  .bottom {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    padding: spacing(2) spacing(4) spacing(3);
    border-bottom-width: 0;
  }

  .left {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    padding: spacing(4) spacing(2);
    padding-right: spacing(3);
    flex-direction: column;
    border-left-width: 0;
  }

  button {
    @include reset-button(true);
    @include action-cursor;
    position: relative;

    &::before {
      box-sizing: content-box;
      content: '';
      z-index: -1;
      position: absolute;
      top: -2px;
      left: -3px;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      padding: 0.125rem 0.3125rem 0.375rem 0.1875rem;
    }

    &.withOptions {
      @include triangle {
        bottom: -0.175rem;
        right: -0.125rem;
      }
    }

    &.active::before {
      background-color: $bg-extra;
    }

    > :global(svg) {
      font-size: 1.5rem;
      color: $body-color;
    }
  }
</style>
