import { get } from 'svelte/store';
import {
  createProjectRepository,
  type ProjectPaginateFilter,
} from '~/entities/project';

import { sortBy, list, edit } from './store.svelte';
import { scrollToEndDelta, unexpectedError } from '../config';

const repository = createProjectRepository();

export function paginate(
  page: number,
  search: string,
  sort: ProjectPaginateFilter['sort'],
) {
  return repository.paginate({ page, name: search, sort });
}

export async function loadMore(
  content: HTMLElement | undefined,
): Promise<void> {
  if (
    !list.loading &&
    list.page < list.totalPages &&
    content != null &&
    content.offsetHeight + content.scrollTop >
      content.scrollHeight - scrollToEndDelta
  ) {
    list.loading = true;

    try {
      const result = await repository.paginate({
        page: ++list.page,
        name: list.search,
        sort: get(sortBy),
      });

      list.items = list.items.concat(Array.from(result.items));
    } catch {
      throw unexpectedError;
    } finally {
      list.loading = false;
    }
  }
}

export function enableRenameMode(projectId: number) {
  edit.renamingProjectId = projectId;
}

export function renameProject(params: { prev: string; next: string }) {
  const { prev, next } = params;

  if (edit.renamingProjectId >= 0) {
    if (prev !== next) {
      repository.update(edit.renamingProjectId, { name: next }).catch(() => {
        // TODO: show custom error
        alert('Не удалось переименовать проект');
      });
    }

    edit.renamingProjectId = -1;
  }
}

export async function deleteProject(projectId: number): Promise<void> {
  if (projectId >= 0) {
    try {
      await repository.delete(projectId);

      const index = list.items.findIndex(({ id }) => id === projectId);
      if (index >= 0) {
        list.items.splice(index, 1);
      }
    } catch {
      // TODO: show custom alert somehow
      alert('Не удалось удалить проект!');
    }
  }

  return Promise.resolve();
}
