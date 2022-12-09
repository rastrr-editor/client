<script lang="ts">
  import { NumberInput } from '~/shared/ui/input/';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    label?: string;
    units?: string;
    value?: number;
  }

  export let label: string = '';
  export let units: string = '';
  export let value: number = 0;
</script>

<label>
  <span class="label">{label}</span>

  <div class="wrapper">
    <input
      {...$$restProps}
      type="range"
      bind:value
      on:change
      on:click
      on:keypress
      on:keydown
      on:keyup
    />

    <div class="numeric">
      <NumberInput {...$$restProps} {units} bind:value densed noBorder />
    </div>
  </div>
</label>

<style lang="scss">
  .label {
    position: relative;
    top: 8px;
    font-size: 0.75rem;
    color: $body-color;
  }

  .wrapper {
    display: flex;
    align-items: center;
    flex: 1;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    padding: spacing($index: 2) 0;
    background-color: transparent;
    @include action-cursor;

    &:hover,
    &:focus {
      &::-webkit-slider-thumb {
        background-color: $button-hover-color;
      }

      &::-moz-range-thumb {
        background-color: $button-hover-color;
      }
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

  .numeric {
    margin-left: spacing($index: 1);
  }
</style>
