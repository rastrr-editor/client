<script lang="ts">
  import { LayersDockPanel } from '~/features/dock-panels/layers';
  import { viewport } from '../model/store';
</script>

<aside>
  <LayersDockPanel viewport={$viewport} />
</aside>

<style lang="scss">
  aside {
    border-left: 1px solid $border-color;
    background-color: $bg-extra;
  }
</style>
