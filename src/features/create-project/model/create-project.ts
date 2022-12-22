import { type Project, projectStore } from '~/entities/project';

export default async function createProject(data: FormData): Promise<void> {
  if (!data.has('name') || !data.has('width') || !data.has('height')) {
    throw new Error('Не заданы обязательные параметры');
  }
  const project: Project = {
    name: data.get('name') as string,
    preview: null,
    width: parseInt(data.get('width') as string, 10),
    height: parseInt(data.get('height') as string, 10),
    isTransparent: data.has('transparent'),
  };
  // TODO: check if current active project is saved and perform necessary actions
  projectStore.activeProject.set(project);
}
