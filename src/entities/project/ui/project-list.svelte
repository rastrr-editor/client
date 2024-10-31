<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { get } from 'svelte/store';
  import {
    Modal,
    DotFlashing,
    Search,
    ContextMenu,
    createContextMenuStore,
  } from '~/shared/ui';
  import { createProjectRepository } from '../model';
  import ProjectCard from './project-card.svelte';
  import type { Project } from '~/shared/api';
  import { activeProject, sortBy } from '../model/store';
  import ProjectSort from './project-sort.svelte';

  interface Props {
    open?: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  // TODO: refactor
  const unexpectedError = 'Не удалось загрузить данные, попробуйте ещё раз!';
  const repository = createProjectRepository();
  const scrollToEndDelta = 10;
  const contextMenuStore = createContextMenuStore({ projectId: -1 });

  let content: HTMLDivElement | undefined = $state();
  let search = $state('');
  let searchTimeout: any;
  let page = $state(1);
  let error = $state('');
  let pageLoading = $state(false);
  let items: Project[] = $state([]);
  let totalPages: number = $state(0);
  let center = $state(true);
  let firstLoad: ReturnType<typeof repository.paginate> | Promise<null> =
    $state(Promise.resolve(null));
  let renameModeEnableForId = $state(-1);

  $effect.pre(() => {
    center = true;
    page = 1;
    firstLoad = open
      ? repository.paginate({ page: 1, name: search, sort: $sortBy })
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
  });

  function enableRenameMode(projectId: number) {
    renameModeEnableForId = projectId;
    contextMenuStore.close();
  }

  function renameProject(params: { prev: string; next: string }) {
    const { prev, next } = params;
    if (renameModeEnableForId >= 0) {
      if (prev !== next) {
        repository.update(renameModeEnableForId, { name: next }).catch(() => {
          // TODO: show custom error
          alert('Не удалось переименовать проект');
        });
      }
      renameModeEnableForId = -1;
    }
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
          contextMenuStore.close();
        });
    }
  }

  function loadMore() {
    if (
      !pageLoading &&
      page < totalPages &&
      content != null &&
      content.offsetHeight + content.scrollTop >
        content.scrollHeight - scrollToEndDelta
    ) {
      pageLoading = true;
      repository
        .paginate({ page: ++page, name: search, sort: $sortBy })
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
    <ProjectSort class="project-sort" />
  </header>
  <div bind:this={content} onscroll={loadMore} class="content" class:center>
    {#await firstLoad}
      <DotFlashing />
    {:then _}
      {#if items.length > 0}
        <div class="list">
          {#each items as project (project.id)}
            <ProjectCard
              {project}
              renameMode={renameModeEnableForId === project.id}
              oncontextmenu={contextMenuStore.createOnContextMenu({
                projectId: project.id ?? -1,
              })}
              onrenamed={renameProject}
              showDate={$sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt'} />
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
  <ContextMenu store={contextMenuStore}>
    <button
      class="context-menu-button"
      onclick={() => enableRenameMode($contextMenuStore.projectId)}
      >Переименовать</button>
    <button
      class="context-menu-button"
      onclick={() => deleteProject($contextMenuStore.projectId)}
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
