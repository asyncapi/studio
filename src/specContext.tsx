import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface Props<T> {
  value?: T;
  children?: ReactNode;
}

export interface MessageProps {
  message: string;
  messageName: string;
}

export interface ChannelProps {
  channelName: string;
  operationType: string;
  protocolType: string;
  channelBindings: any;
}

export interface SpecBuilder {
  messageSpec: MessageProps;
  channelSpec: ChannelProps;
  aggregatedSpec: any;
}

interface specValue {
  spec: SpecBuilder;
  addSpec: (newSpec: SpecBuilder) => void;
}

const SpecContext = createContext<specValue | null>(null);

const SpecProvider = (props: Props<specValue>) => {
  const [spec, setSpec] = useState({} as SpecBuilder);

  const addSpec = useCallback(
    (newSpec) => {
      setSpec(newSpec);
    },
    [spec, setSpec]
  );

  const value = useMemo(() => ({ spec, addSpec }), [spec, addSpec]);

  return (
    <SpecContext.Provider {...props} value={value}>
      {props.children}
    </SpecContext.Provider>
  );
};

export const useSpec = () => {
  const context = useContext(SpecContext);

  if (context === undefined || context === null) {
    throw new Error('useSpec must be inside a SpecProvider');
  }

  return context;
};

export default SpecProvider;
