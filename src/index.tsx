import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  type RouteObject,
  RouterProvider,
  createHashRouter
} from 'react-router-dom';

import './index.scss';

import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeProvider from './components/ThemeProvider';
import SuspenseFallback from './components/SuspenseFallback';

const createRouteForPage = (
  pathOrIndex: true | string,
  pageName: string
): RouteObject => {
  const lazy = async () => ({
    Component: (
      await import(/* webpackChunkName: "[request]" */ `./pages/${pageName}`)
    ).default
  });

  return pathOrIndex === true
    ? { index: true, lazy }
    : { path: pathOrIndex, lazy };
};

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      createRouteForPage(true, 'Home'),
      createRouteForPage('materials', 'MaterialEditor'),
      createRouteForPage('settings', 'Settings'),
      createRouteForPage('mix', 'MixCalculator'),
      createRouteForPage('coils', 'CoilCalculator'),
      createRouteForPage('nicotine', 'NicCalculator'),
      createRouteForPage('mod', 'ModCalculator'),
      createRouteForPage('base', 'BaseCalculator'),
      createRouteForPage('cost', 'CostCalculator'),
      createRouteForPage('wiring', 'WiringCalculator'),
      createRouteForPage('spool', 'SpoolCalculator')
    ]
  }
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <ThemeProvider>
      <Suspense fallback={<SuspenseFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}
