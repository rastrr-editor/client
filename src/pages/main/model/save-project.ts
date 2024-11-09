import { get } from 'svelte/store';
import { projectStore, createProjectRepository } from '~/entities/project';

import { viewport as viewportStore } from './store';

const projectRepository = createProjectRepository();

export default async function saveProject(): Promise<boolean> {
  const project = get(projectStore.activeProject);
  const viewport = get(viewportStore);

  const isNewProject = project?.id == null;

  if (project && viewport) {
    const preview = await viewport.toBlob();

    const { name, width, height, hasTransparentBackground } = project;
    const projectMeta = {
      name,
      width,
      height,
      preview,
      hasTransparentBackground,
    };

    const savedProject = await (isNewProject
      ? projectRepository.add(projectMeta, viewport.layers)
      : projectRepository.update(project.id!, projectMeta, viewport.layers));

    if (isNewProject && savedProject) {
      project.id = savedProject.id;
    }

    return savedProject != null;
  }

  return false;
}
