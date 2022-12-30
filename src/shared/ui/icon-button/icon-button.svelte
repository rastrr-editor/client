<script lang="ts">
  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {}
</script>

<button
  {...$$restProps}
  type="button"
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
  }
</style>
