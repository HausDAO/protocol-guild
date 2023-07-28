import { useState } from "react";
import styled from "styled-components";

import {
  Card,
  Divider,
  ParLg,
  SingleColumnLayout,
  widthQuery,
} from "@daohaus/ui";
import { RegistryOverview } from "../components/registries/RegistryOverview";
import { REGISTRY, TARGETS } from "../targetDao";
import { useMemberRegistry } from "../hooks/useRegistry";
import { HAUS_RPC } from "./Home";


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

  console.log("data menu", data);
  
  if (isLoading) return <ParLg>Loading...</ParLg>;
  return (
    <SingleColumnLayout title="Registries">
      <RegistryContainer>
        <RegistryOverview home={true} />
      </RegistryContainer>
      <CardDivider />
      {TARGETS.REPLICA_CHAIN_ADDRESSES.map((registry: REGISTRY) => (
        <RegistryContainer key={registry.NETWORK_ID}>
          <RegistryOverview home={false} target={registry} owner={data?.owner} foreignRegistries={data?.foreignRegistries}  />
        </RegistryContainer>
      ))}
    </SingleColumnLayout>
  );
}
