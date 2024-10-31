<script lang="ts">
  import { Tooltip, IconButton } from '~/shared/ui';
  import { CloseIcon } from '~/shared/ui/icons';
  import { focusTrap } from '~/shared/lib/actions';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    show?: boolean;
    trigger: HTMLElement;
    placement?: 'top' | 'right';
    icon?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    show = $bindable(false),
    trigger,
    placement = 'top',
    icon,
    children
  }: Props = $props();
</script>

<div use:focusTrap={show} class="tool-options">
  <Tooltip bind:open={show} {trigger} {placement} gap={4} active>
    <div class="header">
      {@render icon?.()}
      <div>{title}</div>
      <IconButton
        aria-label="Close tooltip"
        class="close-button"
        on:click={() => (show = false)}><CloseIcon /></IconButton
      >
    </div>

    {@render children?.()}
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
