<script lang="ts">
  export let title: string;
  export let withBorder = false;
</script>

<section>
  <div class="header" class:withBorder>
    <div class="row">
      <slot name="icon" />
      <h3>{title}</h3>
      <slot name="actions" />
    </div>

    <slot name="addons" />
  </div>

  <slot />
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
