<script lang="ts">
  import type { Viewport } from '@rastrr-editor/core';

  import { projectStore } from '~/entities/project';
  import { DropdownMenu, DropdownMenuItem } from '~/shared/ui';

  import exportImage from '../model/export-image';

  const { activeProject } = projectStore;

  let { viewport }: { viewport: Viewport | null } = $props();
</script>

<DropdownMenu nested>
  <DropdownMenuItem
    disabled={$activeProject == null}
    onclick={() => exportImage(viewport, $activeProject?.name ?? '', 'jpg')}>
    JPEG
  </DropdownMenuItem>
  <DropdownMenuItem
    disabled={$activeProject == null}
    onclick={() => exportImage(viewport, $activeProject?.name ?? '', 'png')}>
    PNG
  </DropdownMenuItem>
</DropdownMenu>
