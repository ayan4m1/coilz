import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './index.scss';

import Layout from 'components/Layout';
import SuspenseFallback from 'components/SuspenseFallback.js';
import ThemeProvider from 'components/ThemeProvider';

const Home = lazy(() => import('pages/Home'));
const MaterialEditor = lazy(() => import('pages/MaterialEditor'));
const Settings = lazy(() => import('pages/Settings'));
const MixCalculator = lazy(() => import('pages/MixCalculator'));
const BaseCalculator = lazy(() => import('pages/BaseCalculator'));
const CoilCalculator = lazy(() => import('pages/CoilCalculator'));
const ModCalculator = lazy(() => import('pages/ModCalculator'));
const NicCalculator = lazy(() => import('pages/NicCalculator'));
const CostCalculator = lazy(() => import('pages/CostCalculator'));
const WiringCalculator = lazy(() => import('pages/WiringCalculator'));
const SpoolCalculator = lazy(() => import('pages/SpoolCalculator'));
const PowerCalculator = lazy(() => import('pages/PowerCalculator'));

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
            <Route element={<PowerCalculator />} path="/power" />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  </Router>
);
