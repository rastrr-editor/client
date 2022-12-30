<script lang="ts">
  import SearchIcon from './search-icon.svelte';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    value?: string;
    class?: string;
  }

  let className: string = '';

  export let value: string = '';
  export { className as class };
</script>

<label
  class={`root ${className}`}
  class:disabled={$$restProps.disabled}
  class:filled={value.length > 0}
>
  <SearchIcon />

  <input
    type="search"
    {...$$restProps}
    bind:value
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
    on:keypress
    on:click
    on:mouseenter
    on:mouseover
    on:mouseleave
    on:paste
    on:copy
  />
</label>

<style lang="scss">
  .root {
    display: flex;
    align-items: center;
    color: $border-color;

    &.disabled {
      @include default-cursor;
    }

    &:not(.disabled):hover input {
      border-color: $input-hover-color;
    }

    &:not(.disabled).filled,
    &:not(.disabled):focus-within {
      color: $body-color;

      input {
        border-color: $body-color;
      }
    }
  }

  input {
    width: 100%;
    margin-left: spacing(2);
    padding: spacing(1) 0;
    border: none;
    border-bottom: 1px solid $border-color;
    background-color: transparent;
    font-size: 0.875rem;
    color: $body-color;
    transition: border-color $animation-time;

    &:disabled {
      @include default-cursor;
    }

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $placeholder-color;
    }
  }
</style>
