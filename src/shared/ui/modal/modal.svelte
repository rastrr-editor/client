<script lang="ts">
  import { IconButton } from '~/shared/ui';
  import { CloseIcon } from '~/shared/ui/icons';
  import focusTrap from './modal.utils';

  export let open: boolean = false;

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
      class="modal"
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #17181ab8;
    backdrop-filter: blur(2px);
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 510px;
    padding: spacing(12);
    border: 1px solid $modal-border-color;
    border-radius: $border-radius;
    background-color: $bg-main;
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style>
