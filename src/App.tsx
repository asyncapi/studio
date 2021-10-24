import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AsyncAPIStudio from './studio';
import AsyncAPIMessageWizard from './messagewiz';
import AsyncAPIChannelWizard from './channelswiz';
import SpecProvider from './specContext';
import AsyncAPIInfoWizard from './infowiz';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AsyncAPIStudio} />
        <SpecProvider>
          <Route exact path="/infowiz" component={AsyncAPIInfoWizard} />
          <Route exact path="/messagewiz" component={AsyncAPIMessageWizard} />
          <Route exact path="/channelwiz" component={AsyncAPIChannelWizard} />
        </SpecProvider>
      </Switch>
    </Router>
  );
};

export default App;
