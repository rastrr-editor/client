<script lang="ts">
  import { onMount } from 'svelte';

  import { ToolPanel } from '~/widgets/tool-panel';
  import { location } from '~/shared/lib/router';

  import { registerHotkeys } from '../model/hotkeys';

  import MainPageCanvasContainer from './main-page-canvas-container.svelte';
  import MainPageDockPanel from './main-page-dock-panel.svelte';
  import MainPageHeader from './main-page-header.svelte';

  let showNewProject = $state(false);
  let openProjects = $state(false);
  let openAbout = $state(false);

  let projectId = $derived(getProjectId($location));

  onMount(() => registerHotkeys());

  $effect.pre(() => {
    openProjects = $location === '/projects';
    openAbout = $location === '/about';
  });

  function getProjectId(url: string) {
    const matches = url.match(/projects\/(\d+)/);

    if (matches?.[1] != null) {
      return parseInt(matches[1], 10);
    }

    return 0;
  }
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

{#await import('~/widgets/project-list') then { ProjectList }}
  <ProjectList bind:open={openProjects} />
{/await}

{#await import('~/widgets/about-modal') then { About }}
  <About bind:open={openAbout} />
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
