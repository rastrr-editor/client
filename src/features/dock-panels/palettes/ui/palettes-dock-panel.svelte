<script lang="ts">
  import { DockPanel } from '~/entities/dock-panel';
  import { Palette } from '~/entities/palette';
  import { IconButton, ContextMenu } from '~/shared/ui';
  import {
    PaletteIcon,
    AddIcon,
    CheckIcon,
    CloseIcon,
  } from '~/shared/ui/icons';
  import { generateDefaultName } from '~/shared/lib/strings';

  import { paletteStorage, createPaletteRepository } from '~/entities/palette';

  const { editablePalette } = paletteStorage;
  const repository = createPaletteRepository();

  const paletteContextMenu = {
    open: false,
    top: -9999,
    left: -9999,
    paletteId: '',
  };

  let palettesLoading = repository.get();
  let isAddingPalette = false;

  function createOpenPaletteContextMenu(paletteId: string) {
    return (event: MouseEvent) => {
      paletteContextMenu.open = true;
      paletteContextMenu.top = event.pageY;
      paletteContextMenu.left = event.pageX;
      paletteContextMenu.paletteId = paletteId;
    };
  }

  function closePaletteContextMenu() {
    paletteContextMenu.open = false;
    paletteContextMenu.top = -9999;
    paletteContextMenu.left = -9999;
    paletteContextMenu.paletteId = '';
  }

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
    await repository.delete(paletteContextMenu.paletteId);

    palettesLoading = repository.get();

    closePaletteContextMenu();
  }

  async function onRenamePalette(): Promise<void> {
    const palettes = await palettesLoading;

    const paletteToRename = palettes.find(
      ({ id }) => id === paletteContextMenu.paletteId
    )!;

    editablePalette.set(paletteToRename);

    closePaletteContextMenu();
  }
</script>

<DockPanel title="Палитра">
  <PaletteIcon slot="icon" />

  <div slot="actions" class="palette-actions">
    {#if $editablePalette !== null}
      <IconButton id="palette-apply" on:click={onApply}
        ><CheckIcon /></IconButton
      >
      <IconButton id="palette-cancel" class="cancel" on:click={onCancel}
        ><CloseIcon /></IconButton
      >
    {:else}
      <IconButton aria-label="Add palette" on:click={onAddPalette}
        ><AddIcon /></IconButton
      >
    {/if}
  </div>

  <div class="palettes">
    {#await palettesLoading then palettes}
      {#if palettes.length === 0}
        <div class="placeholder">
          Чтобы создать вашу первую палитру, нажмите +
        </div>
      {:else}
        {#each palettes as palette (palette.id)}
          <Palette
            class="palette-item"
            {palette}
            on:cancel={onCancel}
            on:apply={onApply}
            on:contextmenu={createOpenPaletteContextMenu(palette.id)}
          />
        {/each}
      {/if}
    {/await}
  </div>
</DockPanel>

<ContextMenu
  bind:open={paletteContextMenu.open}
  top={paletteContextMenu.top}
  left={paletteContextMenu.left}
>
  <button class="context-menu-button" on:click={onRenamePalette}
    >Переименовать палитру</button
  >
  <button class="context-menu-button" on:click={onDeletePalette}
    >Удалить палитру</button
  >
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
    max-height: spacing(56);
    padding: spacing(2.5) spacing(2);
    overflow-y: auto;

    :global(.palette-item:not(:last-child)) {
      margin-bottom: spacing(4);
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