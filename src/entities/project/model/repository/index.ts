import type ProjectRepository from './project-repository';
import IndexedDBProjectRepository from './indexed-db-project-repository';

export { type ProjectRepository, IndexedDBProjectRepository };

export function createProjectRepository(): ProjectRepository {
  return new IndexedDBProjectRepository();
}
