<script lang="ts">
  // TODO Add opacity range if implemented
  import { ToolOptionsTooltip } from '~/entities/tool';
  import { Range } from '~/shared/ui';
  import { EraserIcon } from '~/shared/ui/icons';
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
</script>

<ToolOptionsTooltip title="Ластики" bind:show {trigger} {placement}>
  {#snippet icon()}
    <EraserIcon />
  {/snippet}
  <div>
    <Range
      label="Размер"
      value={Math.round($options.size)}
      min={1}
      max={125}
      units="px"
      onchange={onSizeChange} />
  </div>
</ToolOptionsTooltip>

<style lang="scss">
  div {
    display: grid;
    grid-template-columns: repeat(1, spacing(36));
    gap: spacing(8);
  }
</style>
