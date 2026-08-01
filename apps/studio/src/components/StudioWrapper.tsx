'use client'
import { StrictMode, useEffect, useState, useRef } from 'react';
import { Provider as ModalsProvider } from '@ebay/nice-modal-react';

import { createServices, Services, ServicesProvider } from '@/services';

import { AsyncAPIStudio } from './CodeEditor';
import Preloader from './Preloader';
import { driverObj } from '@/helpers/driver';

function configureMonacoEnvironment() {
  if (typeof window !== 'undefined') {
    window.MonacoEnvironment = {
      getWorker(_, label) {
        switch (label) {
        case 'editorWorkerService':
          return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
        case 'json':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
          );
        case 'yaml':
        case 'yml':
          return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
        default:
          throw new Error(`Unknown worker label: ${label}`);
        }
      },
    };
  }
}

export default function StudioWrapper() {
  const [services, setServices] = useState<Services>();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const fetchData = async () => {
      // Configure Monaco environment BEFORE creating services
      configureMonacoEnvironment();
      const servicess = await createServices();
      setServices(servicess);
      const alreadyVisitedSession = sessionStorage.getItem('alreadyVisited');
      const alreadyVisitedLocal = localStorage.getItem('alreadyVisited');
      if (!alreadyVisitedSession && !alreadyVisitedLocal) {
        sessionStorage.setItem('alreadyVisited', 'true');
        localStorage.setItem('alreadyVisited', 'true');
        driverObj.drive();
      }
    };

    fetchData();
  }, []);

  if (!services) return <Preloader />
  return (
    <StrictMode>
      <ServicesProvider value={services}>
        <ModalsProvider>
          <AsyncAPIStudio />
        </ModalsProvider>
      </ServicesProvider>
    </StrictMode>
  );
}
