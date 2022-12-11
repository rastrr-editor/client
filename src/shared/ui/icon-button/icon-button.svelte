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
    width: 24px;
    height: 24px;
    font-size: 1rem;
    color: $border-color;

    &:hover,
    &:focus {
      color: $body-color;
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      color: $border-color;
    }
  }
</style>
