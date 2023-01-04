import {
  type ProjectMeta,
  projectStore,
  createProjectRepository,
} from '~/entities/project';

export default async function createProject(data: FormData): Promise<void> {
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
  const repository = createProjectRepository();
  const project = await repository.add(projectMeta);

  // TODO: check if current active project is saved and perform necessary actions
  projectStore.activeProject.set(project);
}
