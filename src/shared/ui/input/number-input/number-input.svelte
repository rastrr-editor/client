<script lang="ts">
  import { TextInput } from '~/shared/ui/input/';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    units?: string;
    value?: number;
    densed?: boolean;
    noBorder?: boolean;
    fitWidth?: boolean;
  }

  export let units: string = '';
  export let value: number | null = null;
  export let densed: boolean = false;
  export let noBorder: boolean = false;
  export let fitWidth: boolean = false;

  $: width =
    fitWidth && $$restProps.max ? `${String($$restProps.max).length}ch` : '';
</script>

<TextInput let:props {...$$restProps} {noBorder}>
  <input
    {...props}
    type="number"
    class:densed
    style:width
    bind:value
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
    on:keypress
    on:click
    on:mouseenter
    on:mouseover
    on:mouseleave
    on:paste
    on:copy
  />

  {#if units}
    <span class="units" class:densed>{units}</span>
  {/if}
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
  }

  .units.densed {
    padding: spacing(1);
    padding-left: 0;
    font-size: 0.75rem;
  }
</style>
