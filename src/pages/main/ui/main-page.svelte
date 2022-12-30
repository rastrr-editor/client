<script lang="ts">
  import { CreateProject } from '~/features/create-project';
  import { ToolPanel } from '~/widgets/tool-panel';
  import MainPageCanvasContainer from './main-page-canvas-container.svelte';
  import MainPageDockPanel from './main-page-dock-panel.svelte';
  import MainPageHeader from './main-page-header.svelte';

  let showNewProject = false;
</script>

<div class="root">
  <div>
    <MainPageHeader on:createNewProject={() => (showNewProject = true)} />
    <MainPageCanvasContainer />
    <ToolPanel />
  </div>
  <MainPageDockPanel />
</div>
<CreateProject bind:open={showNewProject} />

<style lang="scss">
  .root {
    display: flex;

    > div {
      position: relative;
      flex: 8;
    }
  }
</style>
