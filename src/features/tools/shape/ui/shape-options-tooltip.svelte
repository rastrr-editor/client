<script lang="ts">
  import { ToolOptionsTooltip } from '~/entities/tool';
  import { ShapesIcon } from '~/shared/ui/icons';
  import { options } from '../model/store';
  import type { ShapeType } from '../types';

  interface Props {
    show?: boolean;
    trigger: HTMLElement;
    placement?: 'top' | 'right';
  }

  let { show = $bindable(false), trigger, placement = 'top' }: Props = $props();

  function createChangeShapeType(type: ShapeType): () => void {
    return () => {
      options.update((prevOptions) => ({
        ...prevOptions,
        type,
      }));
    };
  }
</script>

<ToolOptionsTooltip title="Фигуры" bind:show {trigger} {placement}>
  {#snippet icon()}
    <ShapesIcon  />
  {/snippet}

  <div class="shape-types">
    <button
      class="shape-item"
      class:active={$options.type === 'ellipse'}
      onclick={createChangeShapeType('ellipse')}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 12A12 12 0 0 1 12 24A12 12 0 0 1 0 12A12 12 0 0 1 24 12z" />
      </svg>
    </button>

    <button
      class="shape-item"
      class:active={$options.type === 'rect'}
      onclick={createChangeShapeType('rect')}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H24V24H0V0z" />
      </svg>
    </button>
  </div>
</ToolOptionsTooltip>

<style lang="scss">
  .shape-types {
    display: grid;
    grid-template-columns: repeat(8, spacing(8));
    gap: spacing(1);
    padding: spacing(2) spacing(1.5);
    background-color: $bg-extra;
  }

  .shape-item {
    @include reset-button(true);
    @include action-cursor;

    display: flex;
    align-items: center;
    justify-content: center;
    width: spacing(8);
    height: spacing(8);
    padding: spacing(1.25);
    border: 1px solid transparent;
    background-color: $bg-main;
    color: $body-color;
    font-size: 1.5rem;
    transition: border-color $animation-time;
  }

  .active {
    border-color: $body-color;
  }
</style>
