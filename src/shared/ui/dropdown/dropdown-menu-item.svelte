<script lang="ts">
  interface $$Props
    extends svelte.JSX.HTMLAttributes<HTMLButtonElement & HTMLAnchorElement> {}
</script>

<li>
  <svelte:element
    this={$$restProps.href ? 'a' : 'button'}
    {...$$restProps}
    on:click
  >
    <slot />
  </svelte:element>
</li>

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

  li > * {
    width: 100%;
    padding: spacing(2);
    border-radius: $border-radius;
    text-align-last: left;
    transition: background-color $animation-time;

    &:hover,
    &:focus {
      background-color: $bg-main;
    }

    &:focus {
      outline: none;
    }
  }
</style>
