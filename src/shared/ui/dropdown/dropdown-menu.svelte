<script lang="ts">
  import { BASE_SPACING } from '~/shared/config';

  interface Props {
    nested?: boolean;
    children?: import('svelte').Snippet;
  }

  let { nested = false, children }: Props = $props();

  function getMenuPlacement(): string {
    return nested
      ? `top: 0; left: 100%; padding-left: ${BASE_SPACING * 2}px`
      : 'top: 100%; left: 0';
  }
</script>

<div class="wrapper" style={getMenuPlacement()}>
  <ul>
    {@render children?.()}
  </ul>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    z-index: 100;
  }

  ul {
    padding: spacing(0.5);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-extra;
    white-space: nowrap;
    list-style-type: none;
  }
</style>
