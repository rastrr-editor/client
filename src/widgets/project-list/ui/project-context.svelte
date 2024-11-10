<script lang="ts">
  import { ContextMenu } from '~/shared/ui';
  import type { ContextMenuStore } from '~/shared/ui/context-menu';
  import { cast } from '~/shared/lib/ts';

  import * as actions from '../model/actions.svelte';

  interface Props {
    contextMenuStore: ContextMenuStore<{ projectId: number }>;
  }

  let { contextMenuStore }: Props = $props();
</script>

<ContextMenu store={cast(contextMenuStore)}>
  <button
    class="context-menu-button"
    onclick={() => (
      actions.enableRenameMode($contextMenuStore.projectId),
      contextMenuStore.close()
    )}>Переименовать</button>
  <button
    class="context-menu-button"
    onclick={() =>
      actions
        .deleteProject($contextMenuStore.projectId)
        .finally(() => contextMenuStore.close())}>Удалить</button>
</ContextMenu>

<style lang="scss">
  .context-menu-button {
    @include menu-button;
  }
</style>
