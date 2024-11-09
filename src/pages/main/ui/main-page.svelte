<script lang="ts">
  import { onMount } from 'svelte';
  import { ToolPanel } from '~/widgets/tool-panel';

  import { openProjects, openAbout } from '../model/store';
  import { registerHotkeys } from '../model/hotkeys';
  import type { MainPageRouterParams } from '../types';

  import MainPageCanvasContainer from './main-page-canvas-container.svelte';
  import MainPageDockPanel from './main-page-dock-panel.svelte';
  import MainPageHeader from './main-page-header.svelte';

  interface Props {
    params?: MainPageRouterParams;
  }

  let { params = {} }: Props = $props();

  let showNewProject = $state(false);

  let projectId = parseInt(params.projectId ?? '0', 10);

  onMount(() => registerHotkeys());
</script>

<div class="root">
  <div>
    <MainPageHeader onCreateNewProject={() => (showNewProject = true)} />
    <MainPageCanvasContainer {projectId} />
    <ToolPanel />
  </div>

  <MainPageDockPanel />
</div>

{#await import('~/features/create-project') then { CreateProject }}
  <CreateProject bind:open={showNewProject} />
{/await}

{#await import('~/entities/project') then { ProjectList }}
  <ProjectList bind:open={$openProjects} />
{/await}

{#await import('~/widgets/about-modal') then { About }}
  <About bind:open={$openAbout} />
{/await}

<style lang="scss">
  .root {
    display: grid;
    grid-template-columns: calc(100% - #{spacing(75)}) spacing(75);

    > div {
      position: relative;
    }
  }
</style>
