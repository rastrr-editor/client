<script lang="ts">
  import MainPageHeader from './main-page-header.svelte';

  let showNewProject = false;
</script>

<MainPageHeader on:createNewProject={() => (showNewProject = true)} />
<main id="canvas-container" />

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
  }
</style>
