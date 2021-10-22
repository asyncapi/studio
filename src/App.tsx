import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AsyncAPIStudio from './studio';
import AsyncAPIMessageWizard from './messagewiz';
import AsyncAPIChannelWizard from './channelswiz';
import SpecProvider from './specContext';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <SpecProvider>
          <Route path="/messagewiz" component={AsyncAPIMessageWizard} />
          <Route path="/channelwiz" component={AsyncAPIChannelWizard} />
        </SpecProvider>
        <Route path="/" component={AsyncAPIStudio} />
      </Switch>
    </Router>
  );
};

export default App;
