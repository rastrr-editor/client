import { MainPage } from '~/pages/main';

const routes = {
  '/projects/:projectId': MainPage,
  '/projects': MainPage,
  '*': MainPage,
};

export default routes;
