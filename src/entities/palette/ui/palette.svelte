<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { Color } from '@rastrr-editor/core';

  import { AddOutlinedIcon } from '~/shared/ui/icons';
  import { ContextMenu } from '~/shared/ui';
  import { clickOutside } from '~/shared/lib/actions';
  import { editablePalette } from '../model/store';
  import type { Palette } from '../model/repository';

  let className: string = '';

  export let palette: Palette;
  export let triggers: string[];
  export let mainColor: Writable<Color>;
  export let secondaryColor: Writable<Color>;
  export { className as class };

  const dispatch = createEventDispatcher();

  const colorContextMenu = {
    open: false,
    top: -9999,
    left: -9999,
    color: '',
  };

  let isEditable: boolean = false;
  let nameInput: HTMLInputElement;

  $: isEditable = $editablePalette?.id === palette.id;

  function createOpenColorContextMenu(color: string) {
    return function (event: MouseEvent): void {
      colorContextMenu.open = true;
      colorContextMenu.top = event.pageY;
      colorContextMenu.left = event.pageX;
      colorContextMenu.color = color;
    };
  }

  function closeColorContextMenu() {
    colorContextMenu.open = false;
    colorContextMenu.top = -9999;
    colorContextMenu.left = -9999;
    colorContextMenu.color = '';
  }

  function onChangeName(event: Event): void {
    const { value } = event.target as HTMLInputElement;

    editablePalette.update((prevPalette) => ({ ...prevPalette!, name: value }));
  }

  function onNameInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.code === 'Enter') {
      dispatch('apply');
    }

    if (event.key === 'Escape' || event.code === 'Escape') {
      dispatch('cancel');
    }
  }

  function onAddColor(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    if (value) {
      const updatedPalette = { ...palette, colors: [...palette.colors, value] };

      editablePalette.set(updatedPalette);

      dispatch('apply');
    }
  }

  function onDeleteColor(): void {
    const updatedPaletteColors = palette.colors.filter(
      (color) => color !== colorContextMenu.color
    );
    const updatedPalette = { ...palette, colors: updatedPaletteColors };

    editablePalette.set(updatedPalette);

    dispatch('apply');

    closeColorContextMenu();
  }

  function onSetColorAsSecondary(): void {
    secondaryColor.set(Color.from(colorContextMenu.color, 'hex'));

    closeColorContextMenu();
  }

  afterUpdate(() => {
    if (isEditable) {
      nameInput.focus();
    }
  });
</script>

<div class={className} on:contextmenu|preventDefault>
  {#if isEditable}
    <input
      class="name-input"
      placeholder="Введите название"
      value={palette.name}
      bind:this={nameInput}
      use:clickOutside={{
        excludeSelectors: triggers,
        callback: () => dispatch('cancel'),
      }}
      on:input={onChangeName}
      on:keydown={onNameInputKeydown} />
  {:else}
    <span class="name">{palette.name}</span>
  {/if}

  <div class="colors-set">
    <!-- FIXME color is not guaranteed to be unique as a key -->
    {#each palette.colors as color (color)}
      <button
        class="color"
        class:disabled={$editablePalette !== null}
        style:background-color={color}
        disabled={$editablePalette !== null}
        on:click={() => mainColor.set(Color.from(color, 'hex'))}
        on:contextmenu|preventDefault|stopPropagation={createOpenColorContextMenu(
          color
        )} />
    {/each}

    <div class="color-pick">
      <AddOutlinedIcon />

      <input
        type="color"
        class:disabled={$editablePalette !== null}
        disabled={$editablePalette !== null}
        on:change={onAddColor} />
    </div>
  </div>
</div>

<ContextMenu
  bind:open={colorContextMenu.open}
  top={colorContextMenu.top}
  left={colorContextMenu.left}>
  <button class="context-menu-button" on:click={onSetColorAsSecondary}>
    Установить цвет вспомогательным
  </button>

  <button class="context-menu-button" on:click={onDeleteColor}>
    Удалить цвет из палитры
  </button>
</ContextMenu>

<style lang="scss">
  .name-input {
    @include typography(body2);

    width: 100%;
    padding: spacing(0) spacing(1);
    border: none;
    border-radius: $border-radius;
    background-color: $bg-main;
    color: $placeholder-color;

    &::placeholder {
      color: $placeholder-color;
    }

    &:focus {
      outline: none;
    }
  }

  .name {
    @include typography(body2);

    user-select: none;
  }

  .colors-set {
    display: flex;
    flex-wrap: wrap;
    gap: spacing(1) spacing(0.5);
    margin-top: spacing(1.5);
  }

  .color {
    @include action-cursor;

    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid transparent;
    border-radius: $border-radius;
    transition: border-color $animation-time;

    &:not(:disabled):hover,
    &:not(:disabled):focus-visible {
      border-color: $body-color;
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      @include default-cursor;
    }
  }

  .color-pick {
    position: relative;
    display: flex;

    > :global(svg) {
      font-size: 1.5rem;
      color: $border-color;
      transition: color $animation-time;
    }

    &:not(:has(> :disabled)):hover,
    &:not(:has(> :disabled)):focus-within {
      > :global(svg) {
        color: $body-color;
      }
    }

    > input {
      @include action-cursor;

      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      opacity: 0;

      &:disabled {
        @include default-cursor;
      }
    }
  }

  .context-menu-button {
    @include menu-button;
  }

  .disabled {
    pointer-events: none;
  }
</style>
