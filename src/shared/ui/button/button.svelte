<script lang="ts">
  import type { ButtonType } from './button.types';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {
    type?: ButtonType;
    disabled?: boolean | undefined;
  }

  export let type: ButtonType = 'button';
  export let disabled: boolean | undefined = undefined;
</script>

<button
  {...$$restProps}
  {type}
  {disabled}
  on:keyup
  on:keydown
  on:keypress
  on:focus
  on:blur
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
>
  <slot />
</button>

<style lang="scss">
  button {
    @include reset-button($resetFont: false);
    @include action-cursor;
    min-width: 190px;
    padding: spacing(3) spacing(5);
    border-radius: $border-radius;
    background-color: $body-color;
    font-size: 1rem;
    font-weight: 500;
    color: $bg-extra;
    transition: background-color $animation-time;

    &:hover,
    &:focus {
      background-color: $button-hover-color;
    }

    &:focus {
      outline: none;
    }

    &:active {
      background-color: $button-active-color;
    }

    &:disabled {
      color: $button-disabled-color;
      cursor: url('~/shared/ui/icons/cursor-default.svg'), auto;

      &,
      &:hover {
        background-color: $button-disabled-bg-color;
      }
    }
  }
</style>
