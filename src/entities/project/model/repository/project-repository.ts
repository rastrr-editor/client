import type { LayerList } from '@rastrr-editor/core';
import type { Project } from '~/shared/api';
import type { ProjectMeta } from '../../types';

export type ProjectPaginateFilter = {
  name?: string;
  sort?: Extract<keyof Project, 'name' | 'createdAt' | 'updatedAt'>;
  page?: number;
};

export type ProjectPaginateResult = {
  total: number;
  items: Iterable<Project>;
};

export default interface ProjectRepository {
  add: (meta: ProjectMeta, layers?: LayerList) => Promise<Project>;
  update: (
    id: number,
    meta: Partial<ProjectMeta>,
    layers?: LayerList
  ) => Promise<Project | undefined>;
  delete: (id: number) => Promise<boolean>;
  get: (id: number) => Promise<Project | undefined>;
  paginate: (filter: ProjectPaginateFilter) => Promise<ProjectPaginateResult>;
}
