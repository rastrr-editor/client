<script lang="ts">
  import { Viewport, RenderMode, type Command } from '@rastrr-editor/core';
  import { onDestroy } from 'svelte';
  import { DockPanel } from '~/shared/ui';
  import { HistoryIcon } from '~/shared/ui/icons';

  export let viewport: Viewport | null = null;

  let historyContainer: HTMLElement;

  $: history = viewport?.history;

  $: commands = Array.from(viewport?.history ?? []);

  const onResize = () => {
    commands = Array.from(viewport?.history ?? []);
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

<DockPanel title="История">
  <HistoryIcon slot="icon" />
  <ul bind:this={historyContainer}>
    {#each commands as command, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class:dimmed={index > (history?.index ?? -1)}
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
    /* FIXME: this is temporary */
    height: calc(25vh - #{spacing(7)});
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
