<script lang="ts">
  import type { ButtonType } from './button.types';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {
    type?: ButtonType;
  }

  export let type: ButtonType = 'button';
</script>

<button
  {...$$restProps}
  {type}
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
    @include reset-button(false);
    @include action-cursor;
    @include typography(button);

    min-width: 190px;
    padding: spacing(3) spacing(5);
    border-radius: $border-radius;
    background-color: $body-color;
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
      background-color: $button-disabled-bg-color;
      color: $button-disabled-color;
      cursor: url('/icons/cursor-default.svg'), auto;
    }
  }
</style>
