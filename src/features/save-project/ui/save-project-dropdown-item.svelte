<script lang="ts">
  import type { Viewport } from '@rastrr-editor/core';
  import { DropdownMenuItem } from '~/shared/ui';
  import { saveProject } from '../model';

  let { viewport }: { viewport: Viewport | null } = $props();

  const onSaveProject = () =>
    saveProject(viewport).then(() => console.log('Saved'));
</script>

<DropdownMenuItem onclick={onSaveProject}>Сохранить проект</DropdownMenuItem>
