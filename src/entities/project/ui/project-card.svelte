<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { Project } from '~/shared/api';
  import formatDate from '../lib/formatDate';

  export let project: Project;
  export let showDate: Extract<keyof Project, 'createdAt' | 'updatedAt'> =
    'createdAt';

  $: date = project[showDate];
</script>

<div>
  <a class="link-container" href={`/projects/${project.id}`} use:link>
    <div class="image" class:empty={project.preview == null}>
      {#if project.preview}
        <img src={URL.createObjectURL(project.preview)} alt={project.name} />
      {/if}
    </div>
  </a>
  <p>{project.name}</p>
  <p class="date">{date != null ? formatDate(date) : '-/-'}</p>
</div>

<style lang="scss">
  img {
    object-fit: contain;
    width: 100%;
  }

  div {
    text-align: center;
  }

  p {
    margin: spacing(2) 0;

    &:first-of-type {
      margin-bottom: spacing(3);
    }
  }

  a {
    @include action-cursor;
  }

  .image {
    /* TODO: calculate height to get perfect square */
    height: spacing(49);
    max-width: 100%;
    border: 1px solid transparent;
    border-radius: 3px;

    &.empty {
      border-color: $border-color;
    }
  }

  .date {
    opacity: 0.5;
  }
</style>
