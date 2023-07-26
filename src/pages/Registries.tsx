import { useState } from "react";
import styled from "styled-components";

import {
  Card,
  Divider,
  SingleColumnLayout,
  widthQuery,
} from "@daohaus/ui";
import { RegistryOverview } from "../components/registries/RegistryOverview";
import { REGISRTY_ADDRESS, TARGETS } from "../targetDao";


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
  
  return (
    <SingleColumnLayout title="Registries">
      <RegistryContainer>
        <RegistryOverview home={true} />
      </RegistryContainer>
      <CardDivider />
      {TARGETS.REPLICA_CHAIN_ADDRESSES.map((registry: REGISRTY_ADDRESS) => (
        <RegistryContainer key={registry.REGISRTY_ADDRESS}>
          <RegistryOverview home={false} target={registry} />
        </RegistryContainer>
      ))}
    </SingleColumnLayout>
  );
}
