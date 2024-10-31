<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { NumberInput } from '~/shared/ui/input/';

  interface Props extends HTMLInputAttributes {
    label?: string;
    units?: string;
    value?: number;
  }

  let {
    label = '',
    class: className = '',
    units = '',
    value = $bindable(0),
    onchange,
    ...rest
  }: Props = $props();
</script>

<label class={`root ${className}`}>
  {#if label.length > 0}
    <span class="label">{label}</span>
  {/if}

  <div class="wrapper">
    <input {...rest} type="range" bind:value />

    <div class="numeric">
      <NumberInput
        {...rest}
        {units}
        max={rest.max ?? 100}
        bind:value
        onchange={(e) => {
          // FIXME: on change is triggered only when focus is lost
          console.log(e);
          onchange?.(e);
        }}
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
