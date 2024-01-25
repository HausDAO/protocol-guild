import React, { ReactNode, useContext, useEffect, useState } from 'react';

import { ValidNetwork as ValidNetworkBase } from '@daohaus/keychain-utils';
import { EthAddress, createViemClient } from '@daohaus/utils';

import { ConnextEnv, REGISTRY, TARGET } from '../../targetDao';
import { HAUS_RPC, ValidNetwork } from '../../utils/keychain';
import { ReplicaData, fetchReplicaRegistries } from '../../utils/registry';


export type Registry = {
  connextEnv: ConnextEnv;
  replicaChains: REGISTRY[];
  replicaRegistries: ReplicaData[];
  daoId: EthAddress;
  safeAddress: EthAddress;
  daoChain?: ValidNetwork;
  registryAddress: EthAddress;
  splitAddress: EthAddress;
  domainId: string;
  networkLogo: string;  
  networkName: string;
  startBlock: bigint;
  sharesToMint: bigint;
};

export const RegistryContext = React.createContext<Registry>({
  connextEnv: 'testnet',
  daoId: '0x',
  daoChain: undefined,
  domainId: '',
  networkLogo: '',
  networkName: '',
  registryAddress: '0x',
  replicaChains: [],
  replicaRegistries: [],
  safeAddress: '0x',
  splitAddress: '0x',
  startBlock: BigInt(0),
  sharesToMint: BigInt(0),
});

type CurrentContextProps = {
  children: ReactNode;
  targetRegistry: TARGET;
};

export const CurrentRegistryProvider = ({
  children,
  targetRegistry,
}: CurrentContextProps) => {
  const [replicaRegistries, setReplicaRegistries] = useState<Array<ReplicaData>>([]);

  useEffect(() => {
    const fetchReplicas = async () => {
      const client = createViemClient({
        chainId: targetRegistry.CHAIN_ID as ValidNetworkBase,
        rpcs: HAUS_RPC
      });
      const replicas = await fetchReplicaRegistries({
        client,
        registryAddress: targetRegistry.REGISTRY_ADDRESS,
        replicaChains: targetRegistry.REPLICA_CHAINS,
      });
      setReplicaRegistries(replicas.filter(r => r.ACTIVE));
    };
    fetchReplicas();
  }, [targetRegistry]);

  return (
    <RegistryContext.Provider
      value={{
        connextEnv: targetRegistry.CONNEXT_ENV,
        daoId: targetRegistry.DAO_ADDRESS,
        daoChain: targetRegistry.CHAIN_ID,
        domainId: targetRegistry.DOMAIN_ID,
        networkLogo: targetRegistry.NETWORK_LOGO,
        networkName: targetRegistry.NETWORK_NAME,
        registryAddress: targetRegistry.REGISTRY_ADDRESS,
        replicaChains: targetRegistry.REPLICA_CHAINS,
        replicaRegistries,
        safeAddress: targetRegistry.SAFE_ADDRESS,
        splitAddress: targetRegistry.SPLIT_ADDRESS,
        startBlock: targetRegistry.START_BLOCK,
        sharesToMint: targetRegistry.SHARES_TO_MINT,
      }}
    >
      {children}
    </RegistryContext.Provider>
  );
};

export const useCurrentRegistry = () => useContext(RegistryContext);
