import { MainPage } from '~/pages/main';

const routes = {
  '/projects/:projectId': MainPage,
  '*': MainPage,
};

export default routes;
