<script lang="ts">
  import { get } from 'svelte/store';

  import {
    Modal,
    DotFlashing,
    Search,
    createContextMenuStore,
  } from '~/shared/ui';

  import { push } from '~/shared/lib/router';
  import { ProjectCard, projectStore } from '~/entities/project';

  import { edit, list, sortBy } from '../model/store.svelte';
  import * as actions from '../model/actions.svelte';
  import ProjectSort from './project-sort.svelte';
  import ProjectContext from './project-context.svelte';
  import { unexpectedError } from '../config';

  interface Props {
    open?: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  const { activeProject } = projectStore;
  const contextMenuStore = createContextMenuStore({ projectId: -1 });

  let content: HTMLElement | undefined = $state();
  let error = $state('');
  let center = $state(true);

  let firstLoad: ReturnType<typeof actions.paginate> | Promise<null> = $derived(
    open ? actions.paginate(1, list.search, $sortBy) : Promise.resolve(null),
  );

  $effect.pre(() => {
    center = true;
    list.page = 1;

    firstLoad.then((result) => {
      if (result && result.total > 0) {
        center = false;
        list.items = Array.from(result.items);
        list.totalPages = result.total;
      } else {
        list.items = [];
      }
    });
  });

  let searchTimeout: number;

  function onSearchInput(e: Event) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      list.search = (e.target as HTMLInputElement).value;
    }, 300);
  }

  function onHide() {
    const project = get(activeProject);
    push(project?.id ? `/projects/${project.id}` : '/');
  }
</script>

<Modal size="large" class="project-list" bind:open onhide={onHide}>
  <header>
    <h2>Проекты</h2>
    <Search
      class="project-search"
      placeholder="Поиск"
      value={list.search}
      oninput={onSearchInput} />
    <ProjectSort class="project-sort" />
  </header>
  <div
    bind:this={content}
    onscroll={() =>
      actions
        .loadMore(content)
        .then(() => (error = ''))
        .catch((err) => (error = err))}
    class="content"
    class:center>
    {#await firstLoad}
      <DotFlashing />
    {:then}
      {#if list.items.length > 0}
        <div class="list">
          {#each list.items as project (project.id)}
            <ProjectCard
              {project}
              renameMode={edit.renamingProjectId === project.id}
              oncontextmenu={contextMenuStore.createOnContextMenu({
                projectId: project.id ?? -1,
              })}
              onrenamed={actions.renameProject}
              showDate={$sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt'} />
          {/each}
        </div>

        {#if list.loading}
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
          {#if list.search === ''}
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

  <ProjectContext {contextMenuStore} />
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
</style>
