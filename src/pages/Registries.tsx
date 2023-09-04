import styled from "styled-components";
import {
  Card,
  Divider,
  ParLg,
  SingleColumnLayout,
  widthQuery,
} from "@daohaus/ui";

import { HomeRegistryOverview } from "../components/registries/HomeRegistryOverview";
import { ForeignRegistryOverview } from "../components/registries/ForeignRegistryOverview";
import { useMemberRegistry } from "../hooks/useRegistry";
import { REGISTRY, TARGETS } from "../targetDao";
import { HAUS_RPC } from "../utils/keychain";

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
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  

  if (isLoading) return <ParLg>Loading...</ParLg>;
  return (
    <SingleColumnLayout title="Registries">
      <RegistryContainer>
        <HomeRegistryOverview
          owner={data?.owner}
          lastUpdate={data?.lastUpdate}
          totalMembers={data?.totalMembers}
        />
      </RegistryContainer>
      <CardDivider />
      {TARGETS.REPLICA_CHAIN_ADDRESSES.map((registry: REGISTRY) => (
        <RegistryContainer key={registry.NETWORK_ID}>
          <ForeignRegistryOverview
            target={registry}
            foreignRegistry={data?.foreignRegistries?.find(
              (fr) => fr.NETWORK_ID === registry.NETWORK_ID
            )}
          />
        </RegistryContainer>
      ))}
    </SingleColumnLayout>
  );
}
