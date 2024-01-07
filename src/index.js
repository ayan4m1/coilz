import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './index.scss';

import Layout from 'components/Layout';
import SuspenseFallback from 'components/SuspenseFallback.js';
import ThemeProvider from 'components/ThemeProvider';

const Home = lazy(() => import(/* webpackChunkName: "core" */ 'pages/Home'));
const MaterialEditor = lazy(
  () => import(/* webpackChunkName: "material" */ 'pages/MaterialEditor')
);
const Settings = lazy(
  () => import(/* webpackChunkName: "settings" */ 'pages/Settings')
);
const MixCalculator = lazy(
  () => import(/* webpackChunkName: "mix" */ 'pages/MixCalculator')
);
const BaseCalculator = lazy(
  () => import(/* webpackChunkName: "base" */ 'pages/BaseCalculator')
);
const CoilCalculator = lazy(
  () => import(/* webpackChunkName: "coil" */ 'pages/CoilCalculator')
);
const ModCalculator = lazy(
  () => import(/* webpackChunkName: "mod" */ 'pages/ModCalculator')
);
const NicCalculator = lazy(
  () => import(/* webpackChunkName: "nic" */ 'pages/NicCalculator')
);
const CostCalculator = lazy(
  () => import(/* webpackChunkName: "cost" */ 'pages/CostCalculator')
);
const WiringCalculator = lazy(
  () => import(/* webpackChunkName: "wiring" */ 'pages/WiringCalculator')
);
const SpoolCalculator = lazy(
  () => import(/* webpackChunkName: "spool" */ 'pages/SpoolCalculator')
);

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <ThemeProvider>
      <Layout>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route element={<Home />} index />
            <Route element={<MaterialEditor />} path="/materials" />
            <Route element={<Settings />} path="/settings" />
            <Route element={<MixCalculator />} path="/mix" />
            <Route element={<CoilCalculator />} path="/coils" />
            <Route element={<NicCalculator />} path="/nicotine" />
            <Route element={<ModCalculator />} path="/mod" />
            <Route element={<BaseCalculator />} path="/base" />
            <Route element={<CostCalculator />} path="/cost" />
            <Route element={<WiringCalculator />} path="/wiring" />
            <Route element={<SpoolCalculator />} path="/spool" />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  </Router>
);
