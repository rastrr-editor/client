<script lang="ts">
  import { IconButton } from '~/shared/ui';
  import { CloseIcon } from '~/shared/ui/icons';
  import focusTrap from './utils';

  import type { ModalSize } from './types';

  export let open: boolean = false;
  export let densed: boolean = false;
  export let size: ModalSize = 'medium';

  const hide = () => {
    open = false;
  };

  function keyboardEventHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') hide();
  }
</script>

{#if open}
  <div
    class="backdrop"
    aria-modal="true"
    role="dialog"
    tabindex="-1"
    use:focusTrap
    on:keydown|preventDefault={keyboardEventHandler}
    on:click={hide}
  >
    <div
      class={`modal ${[size]}`}
      class:densed
      on:click|stopPropagation
      on:keydown|stopPropagation={keyboardEventHandler}
    >
      <div class="close-button">
        <IconButton aria-label="Close modal" on:click={hide}>
          <CloseIcon />
        </IconButton>
      </div>

      <div class="modal-content">
        <slot />
      </div>
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
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .densed {
    padding: spacing(3);
  }

  .small {
    max-width: 410px;
  }

  .medium {
    max-width: 500px;
  }

  .large {
    max-width: 800px;
  }

  .extra {
    max-width: 1140px;
  }
</style>
