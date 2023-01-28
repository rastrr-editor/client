<script lang="ts">
  import { Viewport, RenderMode, type Command } from '@rastrr-editor/core';
  import { onDestroy } from 'svelte';
  import { DockPanel } from '~/shared/ui';
  import { HistoryIcon } from '~/shared/ui/icons';

  export let viewport: Viewport | null = null;
  export let withBorder = false;

  let historyContainer: HTMLElement;

  $: history = viewport?.history;

  $: historyIndex = viewport?.history.index;

  $: commands = Array.from(viewport?.history ?? []);

  const onResize = () => {
    commands = Array.from(viewport?.history ?? []);
  };

  const onUndoRedo = () => {
    commands = Array.from(viewport?.history ?? []);
    historyIndex = viewport?.history.index;
  };

  const onPush = (index: number, command: Command) => {
    commands.push(command);
    commands = commands;
    requestAnimationFrame(() => {
      const activeNode = historyContainer.querySelector(
        `li:nth-child(${(history?.index ?? 0) + 1})`
      ) as HTMLElement;
      historyContainer.scrollTop = activeNode.offsetTop;
    });
  };

  $: {
    // NOTE: it would be better to implement custom store
    history?.emitter.on('resize', onResize);
    history?.emitter.on('push', onPush);
    history?.emitter.on('undo', onUndoRedo);
    history?.emitter.on('redo', onUndoRedo);
  }

  onDestroy(() => {
    history?.emitter.off('resize', onResize);
    history?.emitter.off('push', onPush);
  });

  function gotoCommand(index: number) {
    if (history?.isLocked) {
      return;
    }
    viewport?.setRenderMode(RenderMode.BATCH);
    history
      ?.goto(index)
      .then((resultingIndex) => {
        if (resultingIndex !== index) {
          // TODO: show custom alert
          alert(
            `Не удалось вернуться к операции: ${index}, текущая операция: ${resultingIndex}`
          );
        }
        commands = commands;
      })
      .finally(() => {
        viewport?.setRenderMode(RenderMode.IMMEDIATE);
      });
  }
</script>

<DockPanel title="История" {withBorder}>
  <HistoryIcon slot="icon" />
  <ul bind:this={historyContainer}>
    {#each commands as command, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:dimmed={index > (historyIndex ?? -1)}
        on:click={() => gotoCommand(index)}>
        {command.name}
      </li>
    {/each}
  </ul>
</DockPanel>

<style lang="scss">
  ul {
    position: relative;
    list-style-type: none;
    margin: spacing(1.5) 0;
    padding: spacing(0.5);
    /* 100% - header - margin - correction for firefox */
    height: calc(100% - #{spacing(7 + 1.5 * 2 + 0.1)});
    @include custom-scroll;
    overflow-x: hidden;

    li {
      position: relative;
      /* TODO: create mixin */
      width: 100%;
      padding: spacing(1);
      border-radius: $border-radius;
      text-align-last: left;
      transition: background-color $animation-time;
      background-color: $bg-main;
      border: 1px solid transparent;
      user-select: none;
      @include typography(body2);
      line-height: 1.2;

      &:hover {
        background-color: #5f7079;
      }

      &.dimmed {
        opacity: 0.5;
      }

      + li {
        margin-top: spacing(0.5);
      }
    }
  }
</style>
