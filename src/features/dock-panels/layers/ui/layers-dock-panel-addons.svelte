<script lang="ts">
  import type { LayerList } from '@rastrr-editor/core';
  import { Range } from '~/shared/ui';

  interface Props {
    layerList?: LayerList | null;
    opacity?: number;
  }

  let { layerList = null, opacity = 100 }: Props = $props();

  function setOpacity(e: Event) {
    const opacity = parseInt((e.target as HTMLInputElement).value, 10);
    if (Number.isSafeInteger(opacity)) {
      layerList?.activeLayer?.setOpacity(
        // FIXME: min value should be 0, this is temporary solution
        Math.min(Math.max(0.01, opacity / 100), 1),
      );
    }
  }
</script>

<div class="layer-transparency">
  <span>Непрозрачность</span>
  <Range
    class="transparency-range"
    units="%"
    value={opacity}
    onchange={setOpacity}
    min={1}
    max={100}
    disabled={!layerList} />
</div>

<style lang="scss">
  .layer-transparency {
    display: flex;
    align-items: center;
    margin-top: spacing(3);

    span {
      @include typography(body3);
    }

    :global(.transparency-range) {
      width: spacing(44.5);
      margin-left: auto;
    }
  }
</style>
