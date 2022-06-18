import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import './icons.js';
import './index.scss';

import Layout from 'components/Layout';
import SuspenseFallback from 'components/SuspenseFallback.js';

const Home = lazy(() =>
  import(/* webpackChunkName: "core" */ 'components/Home')
);
const MaterialEditor = lazy(() =>
  import(/* webpackChunkName: "material" */ 'components/MaterialEditor')
);
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings" */ 'components/Settings')
);
const BaseCalculator = lazy(() =>
  import(/* webpackChunkName: "base" */ 'components/BaseCalculator')
);
const CoilCalculator = lazy(() =>
  import(/* webpackChunkName: "coil" */ 'components/CoilCalculator')
);
const ModCalculator = lazy(() =>
  import(/* webpackChunkName: "mod" */ 'components/ModCalculator')
);
const NicCalculator = lazy(() =>
  import(/* webpackChunkName: "nic" */ 'components/NicCalculator')
);
const CostCalculator = lazy(() =>
  import(/* webpackChunkName: "cost" */ 'components/CostCalculator')
);
const WiringCalculator = lazy(() =>
  import(/* webpackChunkName: "wiring" */ 'components/WiringCalculator')
);
const SpoolCalculator = lazy(() =>
  import(/* webpackChunkName: "spool" */ 'components/SpoolCalculator')
);

ReactDOM.render(
  <Router>
    <Layout>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route element={<Home />} index />
          <Route element={<MaterialEditor />} path="/materials" />
          <Route element={<Settings />} path="/settings" />
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
  </Router>,
  document.getElementById('root')
);
