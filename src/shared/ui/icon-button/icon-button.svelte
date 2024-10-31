<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { children, ...rest }: Props = $props();
  
</script>

<button
  {...rest}
  type="button"
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
    @include reset-button(true);
    @include action-cursor;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: $border-color;

    &:not(:disabled):hover,
    &:not(:disabled):focus-visible {
      color: $body-color;
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      @include default-cursor;
    }

    > :global(svg) {
      transition: color $animation-time;
    }
  }
</style>
