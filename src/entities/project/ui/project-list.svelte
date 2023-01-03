<script lang="ts">
  import { Modal } from '~/shared/ui/modal';
  import { DotFlashing } from '~/shared/ui';
  import { createProjectRepository } from '../model';
  import ProjectCard from './project-card.svelte';

  export let open: boolean = false;

  const repository = createProjectRepository();
  const page = 1;
  let center = true;
  let dataLoading: ReturnType<typeof repository.paginate> | Promise<null> =
    Promise.resolve(null);

  $: {
    center = true;
    dataLoading = open ? repository.paginate({ page }) : Promise.resolve(null);
    dataLoading.then((result) => {
      if (result && result.total > 0) {
        center = false;
      }
    });
  }
</script>

<Modal size="large" class="project-list" bind:open>
  <h2>Проекты</h2>
  <div class="content" class:center>
    {#await dataLoading}
      <DotFlashing />
    {:then result}
      {#if result != null && result.total > 0}
        <div class="list">
          {#each Array.from(result.items) as project (project.id)}
            <ProjectCard {project} />
          {/each}
        </div>
      {:else}
        <div class="empty">
          <p>У вас еще нет проектов</p>
          <p>Сохраните свой первый проект и он появится тут</p>
        </div>
      {/if}
    {/await}
  </div>
</Modal>

<style lang="scss">
  :global(.project-list) {
    padding: spacing(2) !important;
    max-width: spacing(230) !important;
  }

  h2 {
    margin: spacing(1) 0 spacing(3);
    margin-left: spacing(4);
  }

  .content {
    /* margin: spacing(-4); */
    background-color: $bg-extra;
    height: spacing(125);
    overflow-y: auto;

    &.center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .empty {
    text-align: center;

    p {
      color: $border-color;
      margin: spacing(2) 0;

      &:first-child {
        @include typography('h2');
      }
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: spacing(6);
    gap: spacing(6);
  }
</style>
