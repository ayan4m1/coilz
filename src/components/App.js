import { Switch, Route } from 'react-router-dom';

import Home from 'components/Home';
import Layout from 'components/Layout';
import Materials from 'components/Materials';
import Settings from 'components/Settings';
import BaseCalculator from 'components/BaseCalculator';
import CoilCalculator from 'components/CoilCalculator';
import MechCalculator from 'components/MechCalculator';
import NicCalculator from 'components/NicCalculator';

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/materials" component={Materials} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/coils" component={CoilCalculator} />
        <Route exact path="/nicotine" component={NicCalculator} />
        <Route exact path="/mech" component={MechCalculator} />
        <Route exact path="/base" component={BaseCalculator} />
      </Switch>
    </Layout>
  );
}
