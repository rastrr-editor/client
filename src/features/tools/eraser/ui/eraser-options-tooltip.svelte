<script lang="ts">
  // TODO Add opacity range if implemented
  import { ToolOptionsTooltip } from '~/entities/tool';
  import { Range } from '~/shared/ui';
  import { EraserIcon } from '~/shared/ui/icons';
  import { options } from '../model/store';

  export let show = false;
  export let trigger: HTMLElement;
  export let placement: 'top' | 'right' = 'top';

  function onSizeChange(e: Event) {
    const size = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isSafeInteger(size)) {
      options.update((value) => ({
        ...value,
        size: Math.max(1, size),
      }));
    }
  }
</script>

<ToolOptionsTooltip title="Ластики" bind:show {trigger} {placement}>
  <EraserIcon slot="icon" />
  <div>
    <Range
      label="Размер"
      value={Math.round($options.size)}
      min={1}
      max={125}
      units="px"
      on:change={onSizeChange} />
  </div>
</ToolOptionsTooltip>

<style lang="scss">
  div {
    display: grid;
    grid-template-columns: repeat(1, spacing(36));
    gap: spacing(8);
  }
</style>
