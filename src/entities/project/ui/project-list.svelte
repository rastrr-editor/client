<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { get } from 'svelte/store';
  import { Modal, DotFlashing, Search, ContextMenu } from '~/shared/ui';
  import { createProjectRepository } from '../model';
  import ProjectCard from './project-card.svelte';
  import type { Project } from '~/shared/api';
  import { activeProject } from '../model/store';
  import ProjectSort from './project-sort.svelte';
  import type { ProjectPaginateFilter } from '../model/repository/project-repository';

  export let open: boolean = false;

  // TODO: refactor
  const unexpectedError = 'Не удалось загрузить данные, попробуйте ещё раз!';
  const repository = createProjectRepository();
  const scrollToEndDelta = 10;
  const projectContextMenu = {
    open: false,
    projectId: -1,
    top: -9999,
    left: -9999,
  };

  let content: HTMLDivElement;
  let search = '';
  let sort: ProjectPaginateFilter['sort'] = 'createdAt';
  let searchTimeout: any;
  let page = 1;
  let error = '';
  let pageLoading = false;
  let items: Project[] = [];
  let totalPages: number = 0;
  let center = true;
  let firstLoad: ReturnType<typeof repository.paginate> | Promise<null> =
    Promise.resolve(null);

  $: {
    center = true;
    page = 1;
    firstLoad = open
      ? repository.paginate({ page: 1, name: search, sort })
      : Promise.resolve(null);
    firstLoad.then((result) => {
      if (result && result.total > 0) {
        center = false;
        items = Array.from(result.items);
        totalPages = result.total;
      } else {
        items = [];
      }
    });
  }

  function createOnProjectContextMenu(project: Project) {
    return (e: MouseEvent) => {
      e.preventDefault();
      projectContextMenu.projectId = project.id!;
      projectContextMenu.top = e.pageY;
      projectContextMenu.left = e.pageX;
      projectContextMenu.open = true;
    };
  }

  function closeProjectContextMenu() {
    projectContextMenu.open = false;
    projectContextMenu.top = -9999;
    projectContextMenu.left = -9999;
    projectContextMenu.projectId = -1;
  }

  function deleteProject(projectId: number) {
    if (projectId >= 0) {
      repository
        .delete(projectId)
        .then(() => {
          const index = items.findIndex(({ id }) => id === projectId);
          if (index >= 0) {
            items.splice(index, 1);
            console.log(items);
            // NOTE: it triggers firstLoad
            items = items;
          }
        })
        .catch(() => {
          // TODO: show custom alert somehow
          alert('Не удалось удалить проект!');
        })
        .finally(() => {
          closeProjectContextMenu();
        });
    }
  }

  function loadMore() {
    if (
      !pageLoading &&
      page < totalPages &&
      content.offsetHeight + content.scrollTop >
        content.scrollHeight - scrollToEndDelta
    ) {
      pageLoading = true;
      repository
        .paginate({ page: ++page, name: search, sort })
        .then((result) => {
          console.log(result.items, items);
          error = '';
          items = items.concat(Array.from(result.items));
        })
        .catch(() => {
          error = unexpectedError;
        })
        .finally(() => {
          pageLoading = false;
        });
    }
  }

  function onSearchInput(e: Event) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      search = (e.target as HTMLInputElement).value;
    }, 300);
  }

  function onHide() {
    const project = get(activeProject);
    push(project?.id ? `/projects/${project.id}` : '/');
  }
</script>

<Modal size="large" class="project-list" bind:open on:hide={onHide}>
  <header>
    <h2>Проекты</h2>
    <Search
      class="project-search"
      placeholder="Поиск"
      value={search}
      on:input={onSearchInput} />
    <ProjectSort class="project-sort" bind:sort />
  </header>
  <div bind:this={content} on:scroll={loadMore} class="content" class:center>
    {#await firstLoad}
      <DotFlashing />
    {:then _}
      {#if items.length > 0}
        <div class="list">
          {#each items as project (project.id)}
            <ProjectCard
              {project}
              on:contextmenu={createOnProjectContextMenu(project)}
              showDate={sort === 'updatedAt' ? 'updatedAt' : 'createdAt'} />
          {/each}
        </div>
        {#if pageLoading}
          <div class="loading-more">
            <DotFlashing />
          </div>
        {:else if error}
          <div class="loading-more">
            <p>{error}</p>
          </div>
        {/if}
      {:else}
        <div class="empty">
          {#if search === ''}
            <p>У вас еще нет проектов</p>
            <p>Сохраните свой первый проект и он появится тут</p>
          {:else}
            <p>Ничего не найдено</p>
          {/if}
        </div>
      {/if}
    {:catch}
      <p>{unexpectedError}</p>
    {/await}
  </div>
  <ContextMenu
    bind:open={projectContextMenu.open}
    top={projectContextMenu.top}
    left={projectContextMenu.left}>
    <button
      class="context-menu-button"
      on:click={() => deleteProject(projectContextMenu.projectId)}
      >Удалить</button>
  </ContextMenu>
</Modal>

<style lang="scss">
  :global(.project-list) {
    padding: spacing(2) !important;
    max-width: spacing(230) !important;
  }

  header {
    display: flex;
    align-items: center;
    margin: spacing(1) 0 spacing(3);

    h2 {
      margin: 0;
      margin-left: spacing(3);
    }

    :global(.project-search) {
      margin-left: spacing(16);
      width: spacing(60);

      :global(svg) {
        font-size: 1.1875rem;
      }
    }

    :global(.project-sort) {
      margin-left: auto;
      margin-right: spacing(13);
    }
  }

  .content {
    background-color: $bg-extra;
    height: spacing(134);
    @include custom-scroll;
    overflow-x: hidden;

    &.center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .loading-more {
    padding-top: spacing(14);
    padding-bottom: spacing(22);
    display: flex;
    justify-content: center;
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
    padding: spacing(4);
    gap: spacing(2);
  }

  .context-menu-button {
    @include menu-button;
  }
</style>
