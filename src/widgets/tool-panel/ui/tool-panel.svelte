<script lang="ts">
  import ChooseColor from '~/features/tools/choose-color/ui/choose-color.svelte';

  export let position: 'bottom' | 'left' = 'bottom';

  $: bottom = position === 'bottom';
  $: left = position === 'left';
</script>

<div class:bottom class:left>
  <button><img src="/icons/cursor-default.svg" alt="Move" /></button>
  <ChooseColor />
</div>

<style lang="scss">
  $border-radius: 8px;

  div {
    position: fixed;
    border: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: spacing(4);
    background-color: $bg-main;
  }

  .bottom {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    padding: spacing(2) spacing(4);
  }

  .left {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    padding: spacing(4) spacing(2);
    flex-direction: column;
  }

  button {
    @include reset-button(false);
    @include action-cursor;
  }
</style>
