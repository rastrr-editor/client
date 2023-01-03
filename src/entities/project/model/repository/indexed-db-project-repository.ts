import type { LayerList } from '@rastrr-editor/core';
import { db, RastrrDexie, type Project } from '~/shared/api';
import { delay } from '~/shared/lib/decorators';
import type { ProjectMeta } from '../../types';
import type {
  ProjectPaginateFilter,
  ProjectPaginateResult,
} from './project-repository';
import type ProjectRepository from './project-repository';

export default class IndexedDBProjectRepository implements ProjectRepository {
  readonly db: RastrrDexie = db;
  readonly itemsPerPage = 8;

  async add(meta: ProjectMeta, layers?: LayerList): Promise<Project> {
    const project: Project = {
      ...meta,
      layers: Array.from(layers != null ? layers : [], (layer) => ({
        name: layer.name,
        locked: layer.locked,
        id: layer.id,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity,
        visible: layer.visible,
        offset: layer.offset,
        data: layer.data,
      })),
      createdAt: new Date(),
      updatedAt: null,
    };
    const id = await db.projects.add({
      ...project,
      normalizedName: project.name.toLowerCase(),
    });
    project.id = id;
    return project;
  }

  async update(
    id: number,
    meta: ProjectMeta,
    layers?: LayerList
  ): Promise<Project> {
    throw new Error('Not implemented');
  }

  async delete(id: number): Promise<boolean> {
    if ((await db.projects.get(id)) != null) {
      await db.projects.delete(id);
      return true;
    }
    return false;
  }

  async get(id: number): Promise<Project | undefined> {
    return db.projects.get(id);
  }

  @delay(300)
  async paginate(
    filter: ProjectPaginateFilter
  ): Promise<ProjectPaginateResult> {
    const { page = 1 } = filter;
    const table = db.projects;
    let collection: ReturnType<typeof table.toCollection> | null = null;
    // Search by name
    if (filter.name != null) {
      collection = table
        .where('normalizedName')
        .startsWith(filter.name.toLowerCase());
      // Otherwise apply sort
    } else if (filter.sort != null) {
      collection = table.orderBy(filter.sort);
    }
    // Get total item count
    const totalItems = await (collection != null ? collection : table).count();
    // Get collection for the page
    collection = (collection != null ? collection : table)
      .offset(this.itemsPerPage * (page - 1))
      .limit(this.itemsPerPage);
    // Get collection items
    let items: Iterable<Project>;
    // NOTE: Due to dexie.js API limitatios we can't apply sort and search
    // to the table simultaneously so we have to apply sort afterwards to the collection
    if (filter.name != null && filter.sort != null) {
      items = await collection.sortBy(filter.sort);
    } else {
      items = await collection.toArray();
    }
    return {
      total: Math.ceil(totalItems / this.itemsPerPage),
      items,
    };
  }
}
