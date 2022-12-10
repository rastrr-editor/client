<script lang="ts">
  import type { TextFieldType } from './text-input.types';

  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLInputElement> {
    label?: string;
    type?: TextFieldType;
    value?: string | number;
    disabled?: boolean | undefined;
    densed?: boolean | undefined;
    noBorder?: boolean | undefined;
  }

  export let label: string = '';
  export let type: TextFieldType = 'text';
  export let value: string | number = '';
  export let disabled: boolean | undefined = undefined;
  export let densed: boolean | undefined = undefined;
  export let noBorder: boolean | undefined = undefined;

  const defineInputType = (
    node: HTMLInputElement,
    inputType: TextFieldType
  ) => {
    node.type = inputType;
  };
</script>

<label class="container" class:disabled>
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
        on:copy
      />
    </slot>
  </div>
</label>

<style lang="scss">
  .container {
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

    .wrapper {
      border-color: $border-color;
    }
  }

  .densed {
    padding: spacing(1);
  }

  .noBorder {
    border-color: transparent;
  }
</style>
