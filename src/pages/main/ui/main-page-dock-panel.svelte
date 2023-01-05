<script lang="ts">
  import { chooseColorStore } from '~/features/tools/choose-color';
  import { PalettesDockPanel } from '~/features/dock-panels/palettes';
  import { LayersDockPanel } from '~/features/dock-panels/layers';
  import { viewport } from '../model/store';

  const { mainColor, secondaryColor } = chooseColorStore;
</script>

<aside>
  <PalettesDockPanel {mainColor} {secondaryColor} />

  <LayersDockPanel
    layerList={$viewport?.layers}
    canvasSize={$viewport?.options.canvasSize} />
</aside>

<style lang="scss">
  aside {
    flex: 2;
    min-width: spacing(75);
    border-left: 1px solid $border-color;
    background-color: $bg-extra;
  }
</style>
