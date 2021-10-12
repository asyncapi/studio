import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import AsyncAPIStudio from './studio';
import AsyncAPIWizard from './wizard';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route path='/wizard' component={AsyncAPIWizard} />
        <Route path='/' component={AsyncAPIStudio} />
      </Switch>
    </Router>

  );
};

export default App;
