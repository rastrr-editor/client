<script lang="ts">
  import { CreateProject } from '~/features/create-project';
  import MainPageHeader from './main-page-header.svelte';

  let showNewProject = false;
</script>

<MainPageHeader on:createNewProject={() => (showNewProject = true)} />
<main id="canvas-container" />
<CreateProject bind:open={showNewProject} />

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
  }
</style>
