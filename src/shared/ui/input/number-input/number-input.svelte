<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { TextInput } from '~/shared/ui/input/';

  interface Props extends HTMLInputAttributes { 
    label?: string;
    units?: string;
    value?: number;
    densed?: boolean;
    noBorder?: boolean;
    fitWidth?: boolean;
  }

  let {
    units = '',
    value = $bindable(undefined),
    densed = false,
    noBorder = false,
    fitWidth = false,
    ...rest
  }: Props = $props();

  function getNumericFieldWidth(): string {
    return fitWidth && rest.max
      ? `${String(rest.max).length}ch`
      : '';
  }
</script>

<TextInput {...rest} {noBorder}>
  {#snippet children({ props })}
    <input
      {...props}
      type="number"
      class:densed
      style:width={getNumericFieldWidth()}
      bind:value
    />

    {#if units}
      <span class="units" class:densed>{units}</span>
    {/if}
  {/snippet}
</TextInput>

<style lang="scss">
  input {
    @include style-input-field;
    @include disable-input-number-arrows;

    &.densed {
      padding: spacing(1);
      font-size: 0.75rem;
    }
  }

  .units {
    padding: spacing(3);
    padding-left: 0;
    font-size: 1rem;
    color: $placeholder-color;

    &.densed {
      padding: spacing(1);
      padding-left: 0;
      font-size: 0.75rem;
    }
  }
</style>
