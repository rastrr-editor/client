<script lang="ts">
  import { type Snippet } from 'svelte';
  import { IconButton } from '~/shared/ui';
  import { CloseIcon } from '~/shared/ui/icons';
  import { focusTrap } from '~/shared/lib/actions';
  import type { ModalSize } from './types';

  interface Props {
    onhide?: () => void;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    open?: boolean;
    densed?: boolean;
    size?: ModalSize;
    children?: Snippet;
  }

  let {
    class: className = '',
    open = $bindable(false),
    densed = false,
    size = 'medium',
    children,
    onhide,
    onclick,
  }: Props = $props();

  function hide(): void {
    open = false;

    onhide?.();
  }

  function keyboardEventHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.code === 'Escape') {
      hide();
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="backdrop"
    aria-modal="true"
    role="dialog"
    tabindex="-1"
    use:focusTrap={open}
    onkeydown={(e: KeyboardEvent) => {
      e.preventDefault();
      keyboardEventHandler(e);
    }}
    onclick={hide}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={`modal ${[size]} ${className}`}
      class:densed
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        onclick?.(e);
      }}
      onkeydown={(e: KeyboardEvent) => {
        e.stopPropagation();
        keyboardEventHandler(e);
      }}>
      <IconButton aria-label="Close modal" class="close-button" onclick={hide}>
        <CloseIcon />
      </IconButton>

      {@render children?.()}
    </div>
  </div>
{/if}

<style lang="scss">
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: $modal-backdrop-color;
    backdrop-filter: blur(2px);
  }

  .modal {
    position: relative;
    width: 100%;
    padding: spacing(10);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-main;

    :global(.close-button) {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 1.5rem;
    }
  }

  .densed {
    padding: spacing(3);
  }

  .small {
    max-width: 410px;
  }

  .medium {
    max-width: 610px;
  }

  .large {
    max-width: 800px;
  }

  .extra {
    max-width: 1140px;
  }
</style>
