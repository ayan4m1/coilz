import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import './icons.js';

import './index.scss';
import App from './components/App';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

export default App;
