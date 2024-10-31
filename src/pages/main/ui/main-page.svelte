<script lang="ts">
  import ProjectList from '~/entities/project/ui/project-list.svelte';
  import { CreateProject } from '~/features/create-project';
  import { ToolPanel } from '~/widgets/tool-panel';
  import { About } from '~/widgets/about-modal';
  import { openProjects, openAbout } from '../model/store';
  import type { MainPageRouterParams } from '../types';
  import MainPageCanvasContainer from './main-page-canvas-container.svelte';
  import MainPageDockPanel from './main-page-dock-panel.svelte';
  import MainPageHeader from './main-page-header.svelte';

  interface Props {
    params?: MainPageRouterParams;
  }

  let { params = {} }: Props = $props();

  let showNewProject = $state(false);
</script>

<div class="root">
  <div>
    <MainPageHeader oncreateNewProject={() => (showNewProject = true)} />
    <MainPageCanvasContainer projectId={parseInt(params.projectId ?? '', 10)} />
    <ToolPanel />
  </div>

  <MainPageDockPanel />
</div>

<CreateProject bind:open={showNewProject} />

<ProjectList bind:open={$openProjects} />

<About bind:open={$openAbout} />

<style lang="scss">
  .root {
    display: grid;
    grid-template-columns: calc(100% - #{spacing(75)}) spacing(75);

    > div {
      position: relative;
    }
  }
</style>
