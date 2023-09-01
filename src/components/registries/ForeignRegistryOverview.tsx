import { AddressDisplay, H4, DataIndicator, Tag } from "@daohaus/ui";
import { ZERO_ADDRESS, formatShortDateTimeFromSeconds } from "@daohaus/utils";
import { Keychain } from "@daohaus/keychain-utils";
import { REGISTRY, TARGETS } from "../../targetDao";
import { RegistryMenu } from "./RegistryMenu";
import {
  DataGrid,
  TagSection,
  RegistryCardHeader,
  RegistryOverviewCard,
} from "./RegistryOverview.styles";
import { RiCheckboxCircleFill } from "react-icons/ri";

type RegistryProps = {
  target?: REGISTRY;
  foreignRegistry?: REGISTRY;
};

export const ForeignRegistryOverview = ({
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
              explorerNetworkId={
                (foreignRegistry?.NETWORK_ID as keyof Keychain) ||
                (daochain as keyof Keychain)
              }
            />

            <Tag tagColor="blue">Foreign</Tag>
            {foreignRegistry?.REGISTRY_ADDRESS != ZERO_ADDRESS ? (
              <Tag tagColor="green">
                {/* registered? */}
                <RiCheckboxCircleFill />
              </Tag>
            ) : (
              <Tag tagColor="red">
                <RiCheckboxCircleFill />
              </Tag>
            )}
          </TagSection>
        </div>
        <div className="right-section">
          <RegistryMenu home={false} foreignRegistry={foreignRegistry} />
        </div>
      </RegistryCardHeader>
      <DataGrid>
        <>
          <DataIndicator
            label="Total Members"
            data={foreignRegistry?.TOTAL_MEMBERS?.toString()}
          />
          <DataIndicator label="Status" data={"..."} />

          <DataIndicator
            label={`Last Sync`}
            size="sm"
            data={formatShortDateTimeFromSeconds(foreignRegistry?.LAST_ACTIVITY_UPDATE) || "NA"}
          />
        </>
      </DataGrid>
    </RegistryOverviewCard>
  );
};
