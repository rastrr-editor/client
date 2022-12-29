<script lang="ts">
  import { Tooltip } from '~/shared/ui';

  export let name: string;
  export let hotkey: string | null = null;
  export let show = false;
  export let trigger: HTMLElement;
  export let placement: 'top' | 'right' = 'top';
</script>

<Tooltip bind:disabled={show} {trigger} {placement} gap={4}>
  <div>
    {name}
    <!-- TODO: uncomment when hotkeys will be implemented -->
    <!-- {#if hotkey}
      ({hotkey})
    {/if} -->
  </div>
</Tooltip>

<style>
  div {
    white-space: nowrap;
  }
</style>
