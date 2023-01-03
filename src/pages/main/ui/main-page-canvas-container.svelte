<script lang="ts">
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import type { Viewport } from '@rastrr-editor/core';
  import { createProjectRepository, projectStore } from '~/entities/project';
  import { toolStore, type Tool } from '~/entities/tool';
  import { viewport as viewportStore } from '../model/store';
  import { chooseColorStore } from '~/features/tools/choose-color';
  import updateViewport from '../model/updateViewport';

  export let projectId: number = Number.NaN;

  const { toolCursor } = toolStore;
  const projectRepository = createProjectRepository();

  let container: HTMLElement;

  $: cursor = $toolCursor.match(/^url/) ? `${$toolCursor}, auto` : $toolCursor;

  // NOTE: this is WIP - refactor nedeed
  $: {
    // Load project
    if (Number.isFinite(projectId)) {
      projectRepository.get(projectId).then((project) => {
        projectStore.activeProject.set(project ?? null);
      });
    }
  }
  onMount(() => {
    let viewport: Viewport | null = null;
    let activeTool: Tool<any, any> | null = null;
    const unsubsribeViewport = viewportStore.subscribe((value) => {
      viewport = value;
    });
    const unsubsribeActiveTool = toolStore.activeTool.subscribe((value) => {
      activeTool = value;
    });
    const unsubscribeProject = projectStore.activeProject.subscribe(
      (newProject) => {
        updateViewport(container, newProject, viewportStore);
      }
    );

    const onPointerDown = (event: MouseEvent) => {
      if (event.button === 0 && activeTool && viewport) {
        const command = activeTool.createCommand(viewport, {
          triggerEvent: event,
          color: get(chooseColorStore.mainColor),
        });
        command?.execute().then((done) =>
          // TODO: add to history
          console.log(`Command '${command.name}' result: ${done}`)
        );
      }
    };
    container.addEventListener('pointerdown', onPointerDown);
    return () => {
      unsubsribeViewport();
      unsubsribeActiveTool();
      unsubscribeProject();
      container.removeEventListener('pointerdown', onPointerDown);
    };
  });
</script>

<!-- NOTE: max cursor size is 128 x 128, @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#icon_size_limits -->
<main id="canvas-container" style:--cursor={cursor} bind:this={container} />

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
    overflow-x: auto;
    cursor: var(--cursor);
  }
</style>
