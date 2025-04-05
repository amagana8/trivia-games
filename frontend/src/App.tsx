import 'jotai-devtools/styles.css';

import { CssBaseline } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import type { FC } from 'react';

import { router } from './router';

export const App: FC = () => (
  <>
    <CssBaseline />
    <RouterProvider router={router} />
  </>
);
