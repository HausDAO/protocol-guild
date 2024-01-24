import { Link as RouterLink } from 'react-router-dom';
import styled from "styled-components";

import {
  Button,
  Card,
  Divider,
  ParLg,
  SingleColumnLayout,
  widthQuery,
} from "@daohaus/ui";

import { HomeRegistryOverview } from "../components/registries/HomeRegistryOverview";
import { ForeignRegistryOverview } from "../components/registries/ForeignRegistryOverview";
import { useCurrentRegistry } from '../hooks/context/RegistryContext';
import { useNetworkRegistry } from "../hooks/useRegistry";
import { REGISTRY } from "../targetDao";
import { HAUS_RPC, ValidNetwork } from "../utils/keychain";

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 2rem;
`;

const RegistryContainer = styled(Card)`
  padding: 3rem;
  width: 100%;
  border: none;
  margin-bottom: 3rem;
  @media ${widthQuery.lg} {
    max-width: 100%;
    min-width: 0;
  }
`;

const CardDivider = styled(Divider)`
  margin: 0 0 3rem 0;
`;

export function Registries() {
  const mainRegistry = useCurrentRegistry();
  const { daoChain, registryAddress, replicaChains } = mainRegistry;
  const { isIdle, isLoading, error, data, refetch } = useNetworkRegistry({
    registryAddress,
    replicaChains,
    chainId: daoChain as ValidNetwork,
    rpcs: HAUS_RPC,
  });

  if (isLoading || !data) return <ParLg>Loading...</ParLg>;

  return (
    <SingleColumnLayout title="Registries">
      <ControlsContainer>
        <RouterLink to="/settings">
          <Button>Settings</Button>
        </RouterLink>
      </ControlsContainer>
      <RegistryContainer>
        <HomeRegistryOverview
          target={mainRegistry}
          owner={data?.owner}
          lastUpdate={data?.lastActivityUpdate}
          totalMembers={data?.totalMembers}
        />
      </RegistryContainer>
      <CardDivider />
      {replicaChains.map((replicaRegistry: REGISTRY) => (
        <RegistryContainer key={replicaRegistry.NETWORK_ID}>
          <ForeignRegistryOverview
            target={replicaRegistry}
            data={data?.replicaRegistries?.find(
              (r) => r.NETWORK_ID === replicaRegistry.NETWORK_ID
            )}
          />
        </RegistryContainer>
      ))}
    </SingleColumnLayout>
  );
}
