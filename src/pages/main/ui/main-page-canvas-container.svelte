<script lang="ts">
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import type { Viewport } from '@rastrr-editor/core';

  import { chooseColorStore } from '~/features/tools/choose-color';
  import { projectStore } from '~/entities/project';
  import { toolStore, type Tool } from '~/entities/tool';
  import { isMainButtonPressed } from '~/shared/lib/events';

  import { viewport as viewportStore } from '../model/store';
  import updateViewport from '../model/update-viewport';
  import executeCommand from '../model/execute-command';
  import initializeProject from '../model/initialize-project';

  interface Props {
    projectId?: number;
  }

  let { projectId = 0 }: Props = $props();
  let container: HTMLElement | undefined = $state();

  const { toolCursor } = toolStore;

  let cursor = $derived(
    $toolCursor.match(/^url/) ? `${$toolCursor}, auto` : $toolCursor,
  );

  $effect(() => {
    initializeProject(
      projectId,
      container
        ? {
            width: container.clientWidth - 120,
            height: container.clientHeight - 120,
          }
        : null,
    );
  });

  onMount(() => {
    // Use closure to access current instances of the viewport and active tool
    let viewport: Viewport | null = null;
    let activeTool: Tool | null = null;
    let subscriptions: Array<() => void> = [];

    subscriptions.push(viewportStore.subscribe((value) => (viewport = value)));
    subscriptions.push(
      toolStore.activeTool.subscribe((value) => (activeTool = value)),
    );

    subscriptions.push(
      projectStore.activeProject.subscribe(
        // Viewport should be updated when the active project changes
        (newProject) => updateViewport(viewportStore, container, newProject),
      ),
    );

    container?.addEventListener('pointerdown', onPointerDown);

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      container?.removeEventListener('pointerdown', onPointerDown);
    };

    function onPointerDown(event: MouseEvent) {
      if (isMainButtonPressed(event) && viewport && activeTool) {
        executeCommand(viewport, activeTool, {
          triggerEvent: event,
          color: get(chooseColorStore.mainColor),
        });
      }
    }
  });
</script>

<!-- NOTE: max cursor size is 128 x 128, @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#icon_size_limits -->
<main id="canvas-container" style:--cursor={cursor} bind:this={container}>
</main>

<style lang="scss">
  #canvas-container {
    background-color: $bg-canvas;
    height: calc(100vh - 1.75rem);
    overflow-x: auto;
    cursor: var(--cursor);
    @include custom-scroll;
    scrollbar-color: $border-color $bg-canvas;
  }
</style>
