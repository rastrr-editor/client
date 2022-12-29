<script lang="ts">
  import { Tooltip } from '~/shared/ui';

  export let title: string;
  export let show = false;
  export let trigger: HTMLElement;
  export let placement: 'top' | 'right' = 'top';
</script>

<div class="tool-options">
  <Tooltip bind:open={show} {trigger} {placement} gap={4} active>
    <div class="heading">
      <slot name="icon" />
      <div>{title}</div>
    </div>
    <slot />
  </Tooltip>
</div>

<style lang="scss">
  .tool-options {
    --tooltip-background-color: #{$bg-main};
  }

  .heading {
    display: flex;
    gap: spacing(2);
    margin-bottom: spacing(2);
    align-items: center;

    > div {
      @include typography(h3);
      margin: 0;
    }

    > :global(svg) {
      color: $border-color;
      font-size: 1.25rem;
    }
  }
</style>
