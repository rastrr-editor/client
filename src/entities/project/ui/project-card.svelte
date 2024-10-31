<!-- @migration-task Error while migrating Svelte code: Cannot use `export let` in runes mode — use `$props()` instead -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { link } from 'svelte-spa-router';
  import type { Project } from '~/shared/api';
  import { clickOutside } from '~/shared/lib/actions';
  import formatDate from '../lib/format-date';

  interface Props {
    project: Project;
    showDate: Extract<keyof Project, 'createdAt' | 'updatedAt'>;
    renameMode: boolean;
    onrenamed: (params: { prev: string; next: string }) => void; 
    oncontextmenu: (e: MouseEvent) => void;
  }

  let {
    project,
    showDate = 'createdAt',
    renameMode = false,
    onrenamed,
    oncontextmenu
  }: Props = $props();
  
  let inputNode: HTMLInputElement | null = $state(null);

  const date = $derived(project[showDate]);
  const imageUrl = $derived.by(() => {
    cleanup();
    return project.preview != null ? URL.createObjectURL(project.preview) : null
  });

  $effect(() => {
    if (inputNode) {
      inputNode.focus();
    }
  });

  onDestroy(() => {
    cleanup();
  });

  function cleanup() {
    if (imageUrl != null) {
      URL.revokeObjectURL(imageUrl);
    }
  }

  function renameProject(e: Event): void {
    const { value } = e.target as HTMLInputElement;
    const prev = project.name;
    if (value) {
      project.name = value;
      renameMode = false;
    }
    onrenamed({ prev, next: project.name });
  }
</script>

<a
  class="link-container"
  href={`/projects/${project.id}`}
  use:clickOutside={{
    callback: () => {
      onrenamed({
        prev: project.name,
        next: inputNode?.value || project.name,
      });
      renameMode = false;
    },
  }}
  use:link
  oncontextmenu={oncontextmenu}>
  <div class="image" class:empty={project.preview == null}>
    {#if imageUrl}
      <img src={imageUrl} alt={project.name} onload={cleanup} />
    {/if}
  </div>
  <p>
    {#if renameMode}
      <input
        bind:this={inputNode}
        type="text"
        value={project.name}
        onchange={renameProject} />
    {:else}
      {project.name}
    {/if}
  </p>
  <p class="date">{date != null ? formatDate(date) : '-/-'}</p>
</a>

<style lang="scss">
  $card-border-radius: 3px;

  input {
    @include invisible-input;
    @include text-cursor;
    color: $body-color;
    line-height: 1.2;
    width: 90%;
  }

  img {
    /* TODO: set contain for rect images */
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: $card-border-radius;
  }

  p {
    text-align: center;
    margin: spacing(2) 0;

    &:first-of-type {
      margin-bottom: spacing(3);
    }
  }

  a {
    display: block;
    padding: spacing(2);
    border-radius: $card-border-radius;

    &:hover,
    &:focus {
      background-color: $bg-main;
    }

    &:focus {
      outline: none;
    }
  }

  .image {
    /* TODO: calculate height to get perfect square */
    height: spacing(48);
    max-width: 100%;

    &.empty {
      border: 1px solid transparent;
      border-radius: $card-border-radius;
      border-color: $border-color;
    }
  }

  .date {
    opacity: 0.5;
  }
</style>
