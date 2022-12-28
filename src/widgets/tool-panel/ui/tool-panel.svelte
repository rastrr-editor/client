<script lang="ts">
  import { ChooseColor } from '~/features/tools/choose-color';
  import { CursorIcon, BrushIcon } from '~/shared/ui/icons';
  import { toolStore } from '~/entities/tool';
  import { BrushTool, brushToolId } from '~/features/tools/brush';
  import { position } from '../model/store';

  const { activeTool } = toolStore;
</script>

<div class:bottom={$position === 'bottom'} class:left={$position === 'left'}>
  <button on:click={() => activeTool.set(null)}><CursorIcon /></button>
  <button
    class:active={$activeTool?.id === brushToolId}
    on:click={() => activeTool.set(new BrushTool({ size: 10 }))}
  >
    <BrushIcon />
  </button>
  <ChooseColor
    orientation={$position === 'bottom' ? 'horizontal' : 'vertical'}
  />
</div>

<style lang="scss">
  $border-radius: 8px;

  div {
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

    &::after {
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

    &.active::after {
      background-color: $bg-extra;
    }

    > :global(svg) {
      font-size: 1.5rem;
      color: #fff;
    }
  }
</style>
