<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    value?: string | number;
    group?: (string | number)[];
  }

  let {
    value = '',
    group = [],
    checked = false,
    disabled = false,
    children,
    ...rest
  }: Props = $props();

  function initiateCheckedState(
    _: HTMLElement,
    valuesGroup: (string | number)[],
  ): void {
    checked = checked || valuesGroup.includes(value);
  }

  function handleChange(event: Event): void {
    const target = <HTMLInputElement>event.target;
    const isValueInGroup = group.includes(value);

    if (target.checked && !isValueInGroup) {
      group = [...group, value];
    } else if (!target.checked && isValueInGroup) {
      group = group.filter((groupValue) => groupValue !== value);
    }
  }
</script>

<label class:disabled>
  <input
    {...rest}
    type="checkbox"
    {value}
    {disabled}
    use:initiateCheckedState={group}
    bind:checked
    onchange={(e) => {
      handleChange(e);
      rest.onchange?.(e);
    }} />
  {@render children?.()}
</label>

<style lang="scss">
  label {
    @include typography;
    @include action-cursor;

    display: flex;
    align-items: center;
    user-select: none;
  }

  input {
    width: 24px;
    height: 24px;
    margin: 0;
    margin-right: spacing(2);
    border: 1px solid $border-color;
    border-radius: $border-radius;
    appearance: none;
    -webkit-appearance: none;
    background-color: $bg-extra;
    transition: border-color $animation-time;
    cursor: inherit;

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      display: block;
      background: url('./checkbox-icon.svg') no-repeat center;
      opacity: 0;
      transition: opacity $animation-time;
    }

    &:checked::after {
      opacity: 1;
    }

    &:not(:disabled):hover,
    &:not(:disabled):focus {
      border-color: $input-hover-color;
    }

    &:focus {
      outline: none;
    }
  }

  .disabled {
    opacity: 0.5;

    &,
    &:active {
      @include default-cursor;
    }
  }
</style>
