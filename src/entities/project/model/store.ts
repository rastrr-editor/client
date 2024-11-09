import { writable } from 'svelte/store';
import type { Project } from '~/shared/api';
import { persistent } from '~/shared/lib/persistent-store';
import type { ProjectPaginateFilter } from './repository/project-repository';

export const activeProject = writable<Project | undefined>();
export const sortBy = persistent<
  Exclude<ProjectPaginateFilter['sort'], undefined>
>('project-sort', 'createdAt');
