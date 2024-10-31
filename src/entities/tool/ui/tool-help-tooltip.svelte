<script lang="ts">
  import { Tooltip } from '~/shared/ui';

  interface Props {
    name: string;
    hotkey?: string | null;
    show?: boolean;
    trigger: HTMLElement;
    placement?: 'top' | 'right';
  }

  let {
    name,
    hotkey = null,
    show = $bindable(false),
    trigger,
    placement = 'top'
  }: Props = $props();
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
