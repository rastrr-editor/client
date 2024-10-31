<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  type="button"
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
