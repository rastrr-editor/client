<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'children'> { 
    label?: string;
    value?: string | number;
    densed?: boolean;
    noBorder?: boolean;
    children?: Snippet<[{props: HTMLInputAttributes}]>;
  }

  let {
    label = '',
    class: className = '',
    type = 'text',
    value = $bindable(''),
    disabled = false,
    densed = false,
    noBorder = false,
    children,
    ...rest
  }: Props = $props();

  const defineInputType = (
    node: HTMLInputElement,
    inputType: HTMLInputAttributes['type']
  ) => {
    node.type = inputType ?? 'text';
  };
</script>

<label class={`root ${className}`} class:disabled>
  {#if label.length > 0}
    <span class="label">{label}</span>
  {/if}

  <div class="wrapper" class:noBorder>
    {#if children}
      {@render children({ props: { ...rest, disabled }, })}
    {:else}
      <input
        {...rest}
        {disabled}
        class:densed
        use:defineInputType={type}
        bind:value
      />
    {/if}
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
