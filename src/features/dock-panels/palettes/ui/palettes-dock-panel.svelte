<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Color } from '@rastrr-editor/core';

  import {
    Palette,
    paletteStore,
    createPaletteRepository,
  } from '~/entities/palette';
  import {
    DockPanel,
    IconButton,
    ContextMenu,
    createContextMenuStore,
  } from '~/shared/ui';
  import {
    PaletteIcon,
    AddIcon,
    CheckIcon,
    CloseIcon,
  } from '~/shared/ui/icons';
  import { generateDefaultName } from '~/shared/lib/strings';
  import { draggable } from '~/shared/lib/actions';

  interface Props {
    mainColor: Writable<Color>;
    secondaryColor: Writable<Color>;
    withBorder?: boolean;
  }

  let { mainColor, secondaryColor, withBorder = false }: Props = $props();

  const { editablePalette } = paletteStore;
  const repository = createPaletteRepository();

  const APPLY_BUTTON_ID = 'palette-apply';
  const CANCEL_BUTTON_ID = 'palette-cancel';
  const contextMenuStore = createContextMenuStore({ paletteId: '' });

  let palettesLoading = $state(repository.get());
  let isAddingPalette = false;

  async function onAddPalette(): Promise<void> {
    isAddingPalette = true;

    const newPalette = await repository.add();
    editablePalette.set(newPalette);

    palettesLoading = repository.get();
  }

  async function onCancel(): Promise<void> {
    if (isAddingPalette) {
      await repository.delete($editablePalette!.id);

      isAddingPalette = false;

      palettesLoading = repository.get();
    }

    editablePalette.set(null);
  }

  async function onApply(): Promise<void> {
    if ($editablePalette!.name.length === 0) {
      await checkoutEditablePaletteName();
    }

    const { id, ...paletteData } = $editablePalette!;
    await repository.update(id, paletteData);

    isAddingPalette = false;
    editablePalette.set(null);

    palettesLoading = repository.get();
  }

  async function checkoutEditablePaletteName(): Promise<void> {
    const currentPalettes = await palettesLoading;
    const palettesNames = currentPalettes.map(({ name }) => name);

    const defaultName = generateDefaultName(palettesNames, 'Без названия');

    editablePalette.update((prevPalette) => ({
      ...prevPalette!,
      name: defaultName,
    }));
  }

  async function onDeletePalette(): Promise<void> {
    await repository.delete($contextMenuStore.paletteId);

    palettesLoading = repository.get();

    contextMenuStore.close();
  }

  async function onRenamePalette(): Promise<void> {
    const palettes = await palettesLoading;

    const paletteToRename = palettes.find(
      ({ id }) => id === $contextMenuStore.paletteId,
    )!;

    editablePalette.set(paletteToRename);

    contextMenuStore.close();
  }

  function dropCallback(prevIndex: number, nextIndex: number) {
    if (prevIndex !== nextIndex) {
      palettesLoading = repository.updatePosition(prevIndex, nextIndex);
    }
  }
</script>

<DockPanel title="Палитра" {withBorder}>
  {#snippet icon()}
    <PaletteIcon />
  {/snippet}

  {#snippet actions()}
    <div class="palette-actions">
      {#if $editablePalette !== null}
        <IconButton id={APPLY_BUTTON_ID} onclick={onApply}>
          <CheckIcon />
        </IconButton>
        <IconButton class="cancel" id={CANCEL_BUTTON_ID} onclick={onCancel}>
          <CloseIcon />
        </IconButton>
      {:else}
        <IconButton onclick={onAddPalette}>
          <AddIcon />
        </IconButton>
      {/if}
    </div>
  {/snippet}

  <div
    class="palettes"
    use:draggable={{
      draggableSelector: '.palette-item',
      callback: dropCallback,
    }}>
    {#await palettesLoading then palettes}
      {#if palettes.length === 0}
        <div class="placeholder">
          Чтобы создать вашу первую палитру, нажмите +
        </div>
      {:else}
        {#each palettes as palette (palette.id)}
          <Palette
            class="palette-item"
            triggers={[`#${APPLY_BUTTON_ID}`, `#${CANCEL_BUTTON_ID}`]}
            {palette}
            {mainColor}
            {secondaryColor}
            oncancel={onCancel}
            onapply={onApply}
            oncontextmenu={contextMenuStore.createOnContextMenu({
              paletteId: palette.id,
            })} />
        {/each}
      {/if}
    {/await}
  </div>
</DockPanel>

<!-- FIXME: infer prop type -->
<ContextMenu store={contextMenuStore as ComponentProps<ContextMenu>['store']}>
  <button class="context-menu-button" onclick={onRenamePalette}>
    Переименовать палитру
  </button>

  <button class="context-menu-button" onclick={onDeletePalette}>
    Удалить палитру
  </button>
</ContextMenu>

<style lang="scss">
  .palette-actions {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > :global(.cancel) {
      margin-left: spacing(2);
    }
  }

  .palettes {
    @include custom-scroll;
    /* 100% - header */
    height: calc(100% - #{spacing(7)});
    padding: spacing(2.5) spacing(2);
    overflow-x: hidden;

    > :global(.palette-item ~ .palette-item) {
      margin-top: spacing(4);
    }

    > :global(.dragging .color-pick),
    > :global(.dragging .color) {
      background-color: #3291ea !important;
    }

    > :global(.dragging),
    > :global(.mirror) {
      opacity: 0.2;
    }
  }

  .placeholder {
    padding: spacing(2.5) spacing(2);
    line-height: 1.25;
    color: $border-color;
  }

  .context-menu-button {
    @include menu-button;
  }
</style>
