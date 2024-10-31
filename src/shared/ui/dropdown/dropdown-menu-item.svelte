<script lang="ts">
  import { createBubbler, handlers, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  

  interface Props {
    nested?: boolean;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { nested = false, children, ...rest }: Props = $props();

  function preventNestedPropagation(event: Event): void {
    if (nested) {
      event.stopImmediatePropagation();
    }
  }

  function preventNestedFocus(event: Event): void {
    if (nested) {
      event.preventDefault();
    }
  }
</script>

<svelte:element this={nested ? 'div' : 'li'} class="list-item" class:nested>
  <svelte:element
    this={rest.href ? 'a' : 'button'}
    {...rest}
    onmousedown={preventNestedFocus}
    onclick={handlers(preventNestedPropagation, bubble('click'))}
    oncontextmenu={preventDefault(bubble('contextmenu'))}
    onkeydown={bubble('keydown')}
    onkeyup={bubble('keyup')}
    onkeypress={bubble('keypress')}
  >
    {@render children?.()}
  </svelte:element>
</svelte:element>

<style lang="scss">
  button {
    @include reset-button(false);
    @include action-cursor;
  }

  a {
    display: inline-block;
    text-decoration: none;
    color: $body-color;
  }

  .list-item {
    position: relative;
    transition: background-color $animation-time;

    > * {
      width: 100%;
      padding: spacing(2);
      border-radius: $border-radius;
      text-align: left;

      &:focus {
        outline: none;
      }
    }

    &:hover,
    &:focus-within {
      background-color: $bg-main;
    }

    &.nested {
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: block;
        width: 8px;
        height: 8px;
        border: 4px solid transparent;
        border-left-color: rgba(217, 217, 217, 0.3);
      }

      &:has(+ :focus-within),
      &:has(+ :hover) {
        background-color: $bg-main;
      }
    }
  }
</style>
