<script lang="ts">
  import { onDestroy } from 'svelte';
  import { link } from 'svelte-spa-router';
  import type { Project } from '~/shared/api';
  import formatDate from '../lib/formatDate';

  export let project: Project;
  export let showDate: Extract<keyof Project, 'createdAt' | 'updatedAt'> =
    'createdAt';

  let imageUrl: string | null = null;

  $: date = project[showDate];

  $: {
    // Clean previous imageUrl
    cleanup();
    // Create new image url from preview
    imageUrl =
      project.preview != null ? URL.createObjectURL(project.preview) : null;
  }

  function cleanup() {
    if (imageUrl != null) {
      URL.revokeObjectURL(imageUrl);
    }
  }

  onDestroy(() => {
    cleanup();
  });
</script>

<a
  class="link-container"
  href={`/projects/${project.id}`}
  use:link
  on:contextmenu>
  <div class="image" class:empty={project.preview == null}>
    {#if imageUrl}
      <img src={imageUrl} alt={project.name} on:load={cleanup} />
    {/if}
  </div>
  <!-- TODO: implement rename -->
  <p>{project.name}</p>
  <p class="date">{date != null ? formatDate(date) : '-/-'}</p>
</a>

<style lang="scss">
  $card-border-radius: 3px;

  img {
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
