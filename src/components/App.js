import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Calculator from 'components/Calculator';
import Home from 'components/Home';
import Layout from 'components/Layout';
import Materials from 'components/Materials';
import Settings from 'components/Settings';
import Nicotine from 'components/Nicotine';
import MechCalculator from 'components/MechCalculator';

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/calculator" component={Calculator} />
        <Route exact path="/materials" component={Materials} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/nicotine" component={Nicotine} />
        <Route exact path="/mech" component={MechCalculator} />
      </Switch>
    </Layout>
  );
}
