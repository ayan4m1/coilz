import { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from 'components/Layout';
import { Suspense } from 'react';

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
  import(/* webpackChunkName: "calc" */ 'components/BaseCalculator')
);
const CoilCalculator = lazy(() =>
  import(/* webpackChunkName: "calc" */ 'components/CoilCalculator')
);
const MechCalculator = lazy(() =>
  import(/* webpackChunkName: "calc" */ 'components/MechCalculator')
);
const NicCalculator = lazy(() =>
  import(/* webpackChunkName: "calc" */ 'components/NicCalculator')
);
const CostCalculator = lazy(() =>
  import(/* webpackChunkName: "calc" */ 'components/CostCalculator')
);

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/materials" component={Materials} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/coils" component={CoilCalculator} />
          <Route exact path="/nicotine" component={NicCalculator} />
          <Route exact path="/mech" component={MechCalculator} />
          <Route exact path="/base" component={BaseCalculator} />
          <Route exact path="/cost" component={CostCalculator} />
        </Switch>
      </Suspense>
    </Layout>
  );
}
