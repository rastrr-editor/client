import { type ProjectMeta, createProjectRepository } from '~/entities/project';
import type { Project } from '~/shared/api';

import { MAX_PROJECT_SIZE } from '../config';

export default async function createProject(data: FormData): Promise<Project> {
  if (!data.has('name') || !data.has('width') || !data.has('height')) {
    throw new Error('Не заданы обязательные параметры');
  }

  const projectMeta: ProjectMeta = {
    name: data.get('name') as string,
    preview: null,
    width: parseInt(data.get('width') as string, 10),
    height: parseInt(data.get('height') as string, 10),
    hasTransparentBackground: data.has('transparent'),
  };

  if (projectMeta.width * projectMeta.height > MAX_PROJECT_SIZE) {
    throw new Error('Максимальный размер холста 2 Мп');
  }

  const repository = createProjectRepository();
  const project = await repository.add(projectMeta);

  return project;
}
