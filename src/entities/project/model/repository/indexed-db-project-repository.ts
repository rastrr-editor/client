import type { LayerData, LayerList } from '@rastrr-editor/core';
import { db, RastrrDexie, type Project } from '~/shared/api';
import { delay } from '~/shared/lib/decorators';
import type { ProjectMeta } from '../../types';
import type {
  ProjectPaginateFilter,
  ProjectPaginateResult,
} from './project-repository';
import type ProjectRepository from './project-repository';

// TODO: move to core
function makeLayerDataArrayFromLayerList(layers?: LayerList): LayerData[] {
  return Array.from(layers != null ? layers : [], (layer) => ({
    name: layer.name,
    locked: layer.locked,
    id: layer.id,
    width: layer.width,
    height: layer.height,
    opacity: layer.opacity,
    visible: layer.visible,
    offset: layer.offset,
    data: layer.data,
  }));
}

export default class IndexedDBProjectRepository implements ProjectRepository {
  readonly db: RastrrDexie = db;
  readonly itemsPerPage = 8;

  async add(meta: ProjectMeta, layers?: LayerList): Promise<Project> {
    const project: Project = {
      ...meta,
      layers: makeLayerDataArrayFromLayerList(layers),
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
    meta: Project | ProjectMeta,
    layers?: LayerList
  ): Promise<Project> {
    const project: Partial<Project> = {
      ...meta,
      layers: makeLayerDataArrayFromLayerList(layers),
      updatedAt: new Date(),
    };
    const newId = await db.projects.update(id, {
      ...project,
      normalizedName: meta.name.toLowerCase(),
    });
    // FIXME: this is bad
    return this.get(newId) as Promise<Project>;
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
    const searchEnabled = filter.name != null && filter.name.length > 0;
    const sort = filter.sort === 'name' ? 'normalizedName' : filter.sort;
    // Search by name
    if (searchEnabled) {
      collection = table
        .where('normalizedName')
        .startsWith(filter.name!.toLowerCase());
    } else if (sort != null) {
      // Otherwise apply sort
      collection = table.orderBy(sort);
    }
    // Get total item count
    const totalItems = await (collection != null ? collection : table).count();
    // Get collection for the page
    collection = (collection != null ? collection : table)
      .offset(this.itemsPerPage * (page - 1))
      .limit(this.itemsPerPage);
    // Reverse order for updatedAt
    if (filter.sort === 'updatedAt') {
      collection = collection.reverse();
    }
    // Get collection items
    let items: Iterable<Project>;
    // NOTE: Due to dexie.js API limitatios we can't apply sort and search
    // to the table simultaneously so we have to apply sort afterwards to the collection
    if (searchEnabled && sort != null) {
      items = await collection.sortBy(sort);
    } else {
      items = await collection.toArray();
    }
    return {
      total: Math.ceil(totalItems / this.itemsPerPage),
      items,
    };
  }
}
