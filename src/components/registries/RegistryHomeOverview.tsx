
import {
  AddressDisplay,
  H4,
  DataIndicator,
  Tag,
} from "@daohaus/ui";
import {
  ZERO_ADDRESS,
} from "@daohaus/utils";
import { Keychain } from "@daohaus/keychain-utils";
import { REGISTRY, TARGETS } from "../../targetDao";
import { RegistryMenu } from "./RegistryMenu";
import { DataGrid, TagSection, RegistryCardHeader, RegistryOverviewCard } from "./RegistryOverview.styles";

type RegistryProps = {
  target?: REGISTRY;
  owner?: string;
  lastUpdate?: number;
  totalMembers?: number;
  foreignRegistry?: REGISTRY;
};

export const RegistryHomeOverview = ({
  target,
  owner,
  lastUpdate,
  totalMembers,
  foreignRegistry,
}: RegistryProps) => {
  const daochain = TARGETS.NETWORK_ID;
  const registry = target || TARGETS;

  return (
    <RegistryOverviewCard>
      <RegistryCardHeader>
        <div>
          <H4>{registry.NETWORK_NAME}</H4>
          <TagSection>
            <AddressDisplay
              address={
                registry.REGISTRY_ADDRESS?.toString() ||
                foreignRegistry?.REGISTRY_ADDRESS ||
                ZERO_ADDRESS
              }
              truncate
              copy
              explorerNetworkId={daochain as keyof Keychain}
            />

            <Tag tagColor="pink">Home</Tag>
          </TagSection>
        </div>
        <div className="right-section">
          <RegistryMenu home={true} foreignRegistry={foreignRegistry} />
        </div>
      </RegistryCardHeader>
      <DataGrid>
        <>
          <DataIndicator
            label="Owner"
            data={
              owner?.toLowerCase() == TARGETS.SAFE_ADDRESS.toLowerCase()
                ? "DAO"
                : owner?.toString()
            }
          />
          <DataIndicator
            label={`Last Update`}
            data={lastUpdate?.toString() || "NA"}
          />
          <DataIndicator
            label="Total Members"
            data={totalMembers?.toString() || "NA"}
          />
        </>
      </DataGrid>
    </RegistryOverviewCard>
  );
};
