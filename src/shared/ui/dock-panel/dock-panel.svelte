<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    withBorder?: boolean;
    icon?: Snippet;
    actions?: Snippet;
    addons?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    withBorder = false,
    icon,
    actions,
    addons,
    children
  }: Props = $props();
</script>

<section>
  <div class="header" class:withBorder>
    <div class="row">
      {@render icon?.()}
      <h3>{title}</h3>
      {@render actions?.()}
    </div>

    {@render addons?.()}
  </div>

  {@render children?.()}
</section>

<style lang="scss">
  .header {
    padding: spacing(1) spacing(2.5) spacing(1) spacing(2);
    background-color: $bg-main;

    &.withBorder {
      border-top: 1px solid $border-color;
    }
  }

  .row {
    display: flex;
    align-items: center;

    > :global(svg) {
      font-size: 1.25rem;
      color: $border-color;
    }

    h3 {
      display: inline-block;
      margin: 0 spacing(2);
    }
  }
</style>
