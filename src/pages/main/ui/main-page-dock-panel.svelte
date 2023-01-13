<script lang="ts">
  import { chooseColorStore } from '~/features/tools/choose-color';
  import { PalettesDockPanel } from '~/features/dock-panels/palettes';
  import { LayersDockPanel } from '~/features/dock-panels/layers';
  import { HistoryDockPanel } from '~/features/dock-panels/history';
  import { viewport } from '../model/store';

  const { mainColor, secondaryColor } = chooseColorStore;

  // TODO: change on panel detach
  const attachedPanels = 3;
</script>

<aside style:--panel-count={attachedPanels}>
  <PalettesDockPanel {mainColor} {secondaryColor} />

  <LayersDockPanel
    withBorder
    layerList={$viewport?.layers}
    imageSize={$viewport?.options.imageSize} />

  <HistoryDockPanel withBorder viewport={$viewport} />
</aside>

<style lang="scss">
  aside {
    display: grid;
    grid-template-rows: repeat(
      var(--panel-count, 3),
      minmax(#{spacing(50)}, calc(100% / var(--panel-count, 3)))
    );
    height: 100vh;
    border-left: 1px solid $border-color;
    background-color: $bg-extra;
    @include custom-scroll;
    overflow-x: hidden;
  }
</style>
