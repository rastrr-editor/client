<script lang="ts">
  import { NumberInput } from '~/shared/ui/input/';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    label?: string;
    class?: string;
    units?: string;
    value?: number;
  }

  let className: string = '';

  export { className as class };
  export let label: string = '';
  export let units: string = '';
  export let value: number = 0;
</script>

<label class={`root ${className}`}>
  {#if label.length > 0}
    <span class="label">{label}</span>
  {/if}

  <div class="wrapper">
    <input
      {...$$restProps}
      type="range"
      bind:value
      on:change
      on:click
      on:keypress
      on:keydown
      on:keyup />

    <div class="numeric">
      <NumberInput
        {...$$restProps}
        {units}
        max={$$restProps.max ?? 100}
        bind:value
        on:change
        densed
        noBorder
        fitWidth />
    </div>
  </div>
</label>

<style lang="scss">
  .root {
    display: block;
    cursor: inherit;
  }

  .label {
    @include typography(body3);

    position: relative;
    top: spacing(1);
  }

  .wrapper {
    display: flex;
    align-items: center;
    flex: 1;

    > input {
      @include action-cursor;

      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      padding: spacing(2) 0;
      background-color: transparent;

      &:not(:disabled):hover,
      &:not(:disabled):focus {
        &::-webkit-slider-thumb {
          background-color: $button-hover-color;
        }

        &::-moz-range-thumb {
          background-color: $button-hover-color;
        }
      }

      &:disabled {
        @include default-cursor;
      }

      &:focus {
        outline: none;
      }

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-slider-runnable-track {
        height: 2px;
        border-radius: 5px;
        background-color: $bg-extra;
        transition: background-color $animation-time;
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        top: -5px;
        width: 4px;
        height: 12px;
        border-radius: 1px;
        background-color: $border-color;
        transition: background-color $animation-time;
      }

      /* Firefox */
      &::-moz-range-track {
        height: 2px;
        border-radius: 5px;
        background-color: $bg-extra;
        transition: background-color $animation-time;
      }

      &::-moz-range-thumb {
        position: relative;
        top: -5px;
        width: 4px;
        height: 12px;
        border: none;
        border-radius: 1px;
        background-color: $border-color;
        transition: background-color $animation-time;
      }
    }
  }

  .numeric {
    margin-left: spacing(1);
  }
</style>
