<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import SearchIcon from './search-icon.svelte';

  


  interface Props {
    value?: string;
    class?: string;
    [key: string]: any
  }

  let { value = $bindable(''), class = '', ...rest }: Props = $props();
  
</script>

<label
  class={`root ${className}`}
  class:disabled={rest.disabled}
  class:filled={value.length > 0}
>
  <SearchIcon />

  <input
    type="search"
    {...rest}
    bind:value
    oninput={bubble('input')}
    onchange={bubble('change')}
    onfocus={bubble('focus')}
    onblur={bubble('blur')}
    onkeydown={bubble('keydown')}
    onkeyup={bubble('keyup')}
    onkeypress={bubble('keypress')}
    onclick={bubble('click')}
    onmouseenter={bubble('mouseenter')}
    onmouseover={bubble('mouseover')}
    onmouseleave={bubble('mouseleave')}
    onpaste={bubble('paste')}
    oncopy={bubble('copy')}
  />
</label>

<style lang="scss">
  .root {
    display: flex;
    align-items: center;
    color: $border-color;

    > :global(svg) {
      transition: color $animation-time;
    }

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
