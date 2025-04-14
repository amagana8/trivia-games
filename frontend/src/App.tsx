import { CssBaseline } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './router';

export const App: React.FC = () => (
  <>
    <CssBaseline />
    <RouterProvider router={router} />
  </>
);
