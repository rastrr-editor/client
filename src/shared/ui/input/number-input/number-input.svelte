<script lang="ts">
  import { TextInput } from '~/shared/ui/input/';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    units?: string | undefined;
    value?: number;
    densed?: boolean | undefined;
    noBorder?: boolean | undefined;
  }

  export let units: string | undefined = undefined;
  export let value: number = 0;
  export let densed: boolean | undefined = undefined;
  export let noBorder: boolean | undefined = undefined;
</script>

<TextInput let:props {...$$restProps} {noBorder}>
  <input
    {...props}
    type="number"
    class:densed
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
  }

  .units {
    padding: spacing(3);
    padding-left: 0;
    font-size: 1rem;
    color: $placeholder-color;
  }

  .densed {
    padding: spacing($index: 1);
  }

  .units.densed {
    padding: spacing($index: 1);
    padding-left: 0;
  }
</style>
