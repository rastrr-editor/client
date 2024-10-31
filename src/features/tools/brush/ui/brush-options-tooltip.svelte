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

  function onSizeChange(e: Event) {
    const size = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isSafeInteger(size)) {
      options.update((value) => ({
        ...value,
        size: Math.max(1, size),
      }));
    }
  }

  function onOpacityChange(e: Event) {
    const opacity = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isSafeInteger(opacity)) {
      options.update((value) => ({
        ...value,
        opacity: Math.min(Math.max(0, opacity / 100), 1),
      }));
    }
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
      on:change={onSizeChange} />
    <Range
      label="Непрозрачность"
      value={Math.round($options.opacity * 100)}
      min={0}
      max={100}
      units="%"
      on:change={onOpacityChange} />
  </div>
</ToolOptionsTooltip>

<style lang="scss">
  div {
    display: grid;
    grid-template-columns: repeat(2, spacing(36));
    gap: spacing(8);
  }
</style>
