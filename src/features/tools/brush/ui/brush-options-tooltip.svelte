<script lang="ts">
  import { ToolOptionsTooltip } from '~/entities/tool';
  import { Range } from '~/shared/ui';
  import { BrushIcon } from '~/shared/ui/icons';
  import { options } from '../model/store';

  interface Props {
    show?: boolean;
    trigger: HTMLElement;
    placement?: 'top' | 'right';
  }

  let { show = $bindable(false), trigger, placement = 'top' }: Props = $props();

  function onSizeChange(size: number) {
    options.update((value) => ({
      ...value,
      size: Math.max(1, size),
    }));
  }

  function onOpacityChange(opacity: number) {
    options.update((value) => ({
      ...value,
      opacity: Math.min(Math.max(0, opacity / 100), 1),
    }));
  }
</script>

<ToolOptionsTooltip title="Кисти" bind:show {trigger} {placement}>
  {#snippet icon()}
    <BrushIcon />
  {/snippet}
  <div>
    <Range
      label="Размер"
      value={Math.round($options.size)}
      min={1}
      max={125}
      units="px"
      onchange={onSizeChange} />
    <Range
      label="Непрозрачность"
      value={Math.round($options.opacity * 100)}
      min={0}
      max={100}
      units="%"
      onchange={onOpacityChange} />
  </div>
</ToolOptionsTooltip>

<style lang="scss">
  div {
    display: grid;
    grid-template-columns: repeat(2, spacing(36));
    gap: spacing(8);
  }
</style>
