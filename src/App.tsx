import { useState } from 'react';
import { DHConnectProvider } from '@daohaus/connect';

import { Routes } from './Routes';
import { CurrentRegistryProvider } from './hooks/context/RegistryContext';
import { useTargets } from './hooks/useTargets';

export const App = () => {
  const [daoChainId, setDaoChainId] = useState<string | undefined>();
  const target = useTargets();
  return (
    <DHConnectProvider daoChainId={daoChainId}>
      <CurrentRegistryProvider targetRegistry={target}>
        <Routes setDaoChainId={setDaoChainId} />
      </CurrentRegistryProvider>
    </DHConnectProvider>
  );
};
