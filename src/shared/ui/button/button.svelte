<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import type { ButtonType } from './types';

  

  interface Props {
    type?: ButtonType;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { type = 'button', children, ...rest }: Props = $props();
</script>

<button
  {...rest}
  {type}
  onkeyup={bubble('keyup')}
  onkeydown={bubble('keydown')}
  onkeypress={bubble('keypress')}
  onfocus={bubble('focus')}
  onblur={bubble('blur')}
  onclick={bubble('click')}
  onmouseover={bubble('mouseover')}
  onmouseenter={bubble('mouseenter')}
  onmouseleave={bubble('mouseleave')}
>
  {@render children?.()}
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
      @include default-cursor;

      background-color: $button-disabled-bg-color;
      color: $button-disabled-color;
    }
  }
</style>
