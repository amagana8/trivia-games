import { CssBaseline } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import type { FC } from 'react';
import { router } from './router';
import 'jotai-devtools/styles.css';

export const App: FC = () => (
  <>
    <CssBaseline />
    <RouterProvider router={router} />
  </>
);
