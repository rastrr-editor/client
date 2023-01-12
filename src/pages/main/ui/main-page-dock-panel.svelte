<script lang="ts">
  import { chooseColorStore } from '~/features/tools/choose-color';
  import { PalettesDockPanel } from '~/features/dock-panels/palettes';
  import { LayersDockPanel } from '~/features/dock-panels/layers';
  import { HistoryDockPanel } from '~/features/dock-panels/history';
  import { viewport } from '../model/store';

  const { mainColor, secondaryColor } = chooseColorStore;
</script>

<aside>
  <PalettesDockPanel {mainColor} {secondaryColor} />

  <LayersDockPanel
    layerList={$viewport?.layers}
    imageSize={$viewport?.options.imageSize} />
  <HistoryDockPanel viewport={$viewport} />
</aside>

<style lang="scss">
  aside {
    height: 100vh;
    border-left: 1px solid $border-color;
    background-color: $bg-extra;
    @include custom-scroll;
    overflow-x: hidden;
  }
</style>
