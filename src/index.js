import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import './index.scss';

import Layout from 'components/Layout';
import SuspenseFallback from 'components/SuspenseFallback.js';
import ThemeProvider from 'components/ThemeProvider';
import ErrorBoundary from 'components/ErrorBoundary';

const createRouteForPage = (pathOrIndex, pageName) => {
  const result = {};

  if (typeof pathOrIndex === 'boolean') {
    result.index = pathOrIndex;
  } else if (typeof pathOrIndex === 'string') {
    result.path = pathOrIndex;
  }

  result.lazy = async () => ({
    Component: (await import(`pages/${pageName}`)).default
  });

  return result;
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
const root = createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider>
    <Suspense fallback={<SuspenseFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  </ThemeProvider>
);
