import { get } from 'svelte/store';

import { createProjectRepository } from '~/entities/project';
import { activeProject } from '~/entities/project/model/store';
import { createDraft } from '~/features/create-project';

const projectRepository = createProjectRepository();

export default function initializeProject(
  projectId: number,
  defaults: { width: number; height: number } | null,
): Promise<boolean> {
  return new Promise((resolve) => {
    const activeProjectId = get(activeProject)?.id;

    if (projectId > 0) {
      // TODO: check if current project is saved
      if (activeProjectId !== projectId) {
        projectRepository.get(projectId).then((project) => {
          activeProject.set(project);
        });
      }
    } else if (activeProjectId == null && defaults != null) {
      activeProject.set(createDraft(defaults.width, defaults.height));
    }

    resolve(true);
  });
}
