<script lang="ts">
  import { createEventDispatcher, onDestroy, afterUpdate } from 'svelte';
  import { link } from 'svelte-spa-router';
  import type { Project } from '~/shared/api';
  import { clickOutside } from '~/shared/lib/actions';
  import formatDate from '../lib/formatDate';

  export let project: Project;
  export let showDate: Extract<keyof Project, 'createdAt' | 'updatedAt'> =
    'createdAt';
  export let renameMode = false;

  const dispatch = createEventDispatcher<{
    renamed: { prev: string; next: string };
  }>();
  let imageUrl: string | null = null;
  let inputNode: HTMLInputElement | null = null;

  $: date = project[showDate];

  $: {
    // Clean previous imageUrl
    cleanup();
    // Create new image url from preview
    imageUrl =
      project.preview != null ? URL.createObjectURL(project.preview) : null;
  }

  afterUpdate(() => {
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
    dispatch('renamed', { prev, next: project.name });
  }
</script>

<a
  class="link-container"
  href={`/projects/${project.id}`}
  use:clickOutside={{
    callback: () => {
      dispatch('renamed', {
        prev: project.name,
        next: inputNode?.value || project.name,
      });
      renameMode = false;
    },
  }}
  use:link
  on:contextmenu>
  <div class="image" class:empty={project.preview == null}>
    {#if imageUrl}
      <img src={imageUrl} alt={project.name} on:load={cleanup} />
    {/if}
  </div>
  <p>
    {#if renameMode}
      <input
        bind:this={inputNode}
        type="text"
        value={project.name}
        on:change={renameProject} />
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
