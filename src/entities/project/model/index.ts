import {
  IndexedDBProjectRepository,
  type ProjectRepository,
} from './repository';

export * as projectStore from './store';
export { IndexedDBProjectRepository, type ProjectRepository };

export function createProjectRepository(): ProjectRepository {
  return new IndexedDBProjectRepository();
}
