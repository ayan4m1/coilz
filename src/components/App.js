import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from 'components/Layout';

const Home = lazy(() =>
  import(/* webpackChunkName: "core" */ 'components/Home')
);
const Materials = lazy(() =>
  import(/* webpackChunkName: "core" */ 'components/Materials')
);
const Settings = lazy(() =>
  import(/* webpackChunkName: "core" */ 'components/Settings')
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

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/coils" element={<CoilCalculator />} />
          <Route path="/nicotine" element={<NicCalculator />} />
          <Route path="/mod" element={<ModCalculator />} />
          <Route path="/base" element={<BaseCalculator />} />
          <Route path="/cost" element={<CostCalculator />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
