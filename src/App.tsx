import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AsyncAPIStudio from './studio';
import AsyncAPIMessageWizard from './messagewiz';
import AsyncAPIChannelWizard from './channelswiz';

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route path="/messagewiz" component={AsyncAPIMessageWizard} />
        <Route path="/channelwiz" component={AsyncAPIChannelWizard} />
        <Route path="/" component={AsyncAPIStudio} />
      </Switch>
    </Router>
  );
};

export default App;
