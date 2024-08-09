import { AsyncAPIStudio } from './studio';

import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { driverObj } from './helpers/driver';

export const App: FunctionComponent = () => {
  useEffect(() => {
    const alreadyVisitedSession = sessionStorage.getItem('alreadyVisited');
    const alreadyVisitedLocal = localStorage.getItem('alreadyVisited');
    if (!alreadyVisitedSession && !alreadyVisitedLocal) {
      sessionStorage.setItem('alreadyVisited', 'true');
      localStorage.setItem('alreadyVisited', 'true');
      driverObj.drive();
    }
  }, []);

  return <AsyncAPIStudio />;
};
