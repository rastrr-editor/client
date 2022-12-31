<script lang="ts">
  import { Tooltip, IconButton } from '~/shared/ui';
  import { CloseIcon } from '~/shared/ui/icons';
  import { focusTrap } from '~/shared/lib/actions';

  export let title: string;
  export let show = false;
  export let trigger: HTMLElement;
  export let placement: 'top' | 'right' = 'top';
</script>

<div use:focusTrap={show} class="tool-options">
  <Tooltip bind:open={show} {trigger} {placement} gap={4} active>
    <div class="header">
      <slot name="icon" />
      <div>{title}</div>
      <IconButton
        aria-label="Close tooltip"
        class="close-button"
        on:click={() => (show = false)}><CloseIcon /></IconButton
      >
    </div>

    <slot />
  </Tooltip>
</div>

<style lang="scss">
  .tool-options {
    --tooltip-background-color: #{$bg-main};
  }

  .header {
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

    > :global(.close-button) {
      margin-left: auto;
      font-size: 1.5rem;
    }
  }
</style>
