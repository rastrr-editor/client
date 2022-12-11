<script lang="ts">
  import SearchIcon from './search-icon.svelte';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    value?: string;
  }

  export let value: string = '';
</script>

<label class="container" class:filled={value.length > 0}>
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
  .container {
    display: flex;
    align-items: center;
    color: $border-color;

    &:hover input {
      border-color: $input-hover-color;
    }

    &.filled,
    &:focus-within {
      color: $body-color;

      input {
        border-color: $body-color;
      }
    }
  }

  input {
    margin-left: spacing(2);
    padding: spacing(1) 0;
    border: none;
    border-bottom: 1px solid $border-color;
    background-color: transparent;
    font-size: 0.875rem;
    color: $body-color;
    transition: border-color $animation-time;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $placeholder-color;
    }
  }
</style>
