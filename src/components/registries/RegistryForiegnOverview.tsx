
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
  foreignRegistry?: REGISTRY;
};

export const RegistryForiegnOverview = ({
  target,
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

            <Tag tagColor="blue">Foreign</Tag>
          </TagSection>
        </div>
        <div className="right-section">
          <RegistryMenu home={false} foreignRegistry={foreignRegistry} />
        </div>
      </RegistryCardHeader>
      <DataGrid>
        <>
          <DataIndicator
            label="Registerd"
            data={
              foreignRegistry?.REGISTRY_ADDRESS != ZERO_ADDRESS ? "true" : "NA"
            }
          />
          <DataIndicator label="Status" data={"TODO"} />
          <DataIndicator
            label="Total Members"
            data={foreignRegistry?.TOTAL_MEMBERS?.toString()}
          />
          <DataIndicator
            label={`Last Sync`}
            data={foreignRegistry?.LAST_ACTIVITY_UPDATE || "NA"}
          />
        </>
      </DataGrid>
    </RegistryOverviewCard>
  );
};
