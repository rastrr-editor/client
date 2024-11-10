import type { Project } from '~/shared/api';
import { persistent } from '~/shared/lib/persistent-store';
import type { ProjectPaginateFilter } from '~/entities/project';

export const list = $state({
  search: '',
  page: 1,
  items: [] as Project[],
  totalPages: 0,
  loading: false,
});

export const edit = $state({
  renamingProjectId: -1,
});

export const sortBy = persistent<
  Exclude<ProjectPaginateFilter['sort'], undefined>
>('project-sort', 'createdAt');
