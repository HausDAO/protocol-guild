import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  AddressDisplay,
  Card,
  H4,
  Link,
  ParXs,
  Theme,
  Bold,
  DataIndicator,
  widthQuery,
  Tag,
} from "@daohaus/ui";
import { ZERO_ADDRESS, formatValueTo, generateGnosisUiLink } from "@daohaus/utils";
import { Keychain } from "@daohaus/keychain-utils";
import { REGISTRY, TARGET, TARGETS } from "../../targetDao";
import { RegistryMenu } from "./RegistryMenu";

const VaultOverviewCard = styled(Card)`
  background-color: ${({ theme }: { theme: Theme }) => theme.secondary.step3};
  border: none;
  padding: 3rem;
  width: 100%;
`;

const VaultCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  .right-section {
    display: flex;
  }

  .safe-link {
    padding: 0.9rem;
    background-color: ${({ theme }: { theme: Theme }) => theme.secondary.step5};
    border-radius: 4px;
  }
`;

const DataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-content: space-between;
  div {
    padding: 2rem 0;
    width: 19.7rem;

    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

const TagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
`;

type RegistryProps = {
  home: boolean;
  target?: REGISTRY;
  foreignRegistries?: REGISTRY[];
};

export const RegistryOverview = ({ home, target, foreignRegistries }: RegistryProps) => {
  const daochain = TARGETS.NETWORK_ID;
  const registry = target || TARGETS;

  return (
    <VaultOverviewCard>
      <VaultCardHeader>
        <div>
          <H4>{registry.NETWORK_NAME}</H4>
          <TagSection>
            <AddressDisplay
              address={registry.REGISTRY_ADDRESS?.toString() || ZERO_ADDRESS}
              truncate
              copy
              explorerNetworkId={daochain as keyof Keychain}
            />
            {home && <Tag tagColor="pink">Home</Tag>}
          </TagSection>
        </div>
        <div className="right-section">
          <RegistryMenu
            home={home}
            foreignRegistry={foreignRegistries?.find((fr)=>fr.NETWORK_ID === registry.NETWORK_ID)}
          />
        </div>
      </VaultCardHeader>
      <DataGrid>
        {!home && (
          <>
            <DataIndicator label="Registerd" data={"NA"} />
            <DataIndicator label="Status" data={"NA"} />
          </>
        )}
        <DataIndicator label={`Last ${home ? "Update" : "Sync"}`} data={"NA"} />
        <DataIndicator label="Owner" data={"DAO"} />

      </DataGrid>
    </VaultOverviewCard>
  );
};
