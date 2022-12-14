<script lang="ts">
  import type { TextFieldType } from './types';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    label?: string;
    class?: string;
    type?: TextFieldType;
    value?: string | number;
    disabled?: boolean;
    densed?: boolean;
    noBorder?: boolean;
  }

  let className: string = '';

  export { className as class };
  export let label: string = '';
  export let type: TextFieldType = 'text';
  export let value: string | number = '';
  export let disabled: boolean = false;
  export let densed: boolean = false;
  export let noBorder: boolean = false;

  const defineInputType = (
    node: HTMLInputElement,
    inputType: TextFieldType
  ) => {
    node.type = inputType;
  };
</script>

<label class={`root ${className}`} class:disabled>
  {#if label.length > 0}
    <span class="label">{label}</span>
  {/if}

  <div class="wrapper" class:noBorder>
    <slot props={{ ...$$restProps, disabled }}>
      <input
        {...$$restProps}
        {disabled}
        class:densed
        use:defineInputType={type}
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
        on:copy />
    </slot>
  </div>
</label>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    cursor: inherit;
  }

  .label {
    @include typography;

    margin-bottom: spacing(2);
  }

  .wrapper {
    display: flex;
    align-items: center;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: $bg-extra;
    transition: border-color $animation-time;

    &:hover {
      border-color: $input-hover-color;
    }

    &:focus-within {
      border-color: $input-active-color;
    }
  }

  input {
    @include style-input-field;
  }

  .disabled {
    opacity: 0.5;

    .wrapper:hover {
      border-color: $border-color;
    }

    .wrapper.noBorder {
      border-color: transparent;
    }
  }

  .densed {
    padding: spacing(1);
  }

  .noBorder {
    border-color: transparent;
  }
</style>
