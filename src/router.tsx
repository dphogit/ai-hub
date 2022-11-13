import { createBrowserRouter } from 'react-router-dom';
import HomePage from './components/pages/home-page';
import EightPuzzlePage from './components/pages/eight-puzzle-page';
import { PageRoutes } from './common/routes';

const router = createBrowserRouter([
  {
    path: PageRoutes.HOME,
    element: <HomePage />,
  },
  {
    path: PageRoutes.EIGHT_PUZZLE,
    element: <EightPuzzlePage />,
  },
]);

export default router;
