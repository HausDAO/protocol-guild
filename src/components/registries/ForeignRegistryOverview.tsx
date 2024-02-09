import { useEffect, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";

import { Keychain } from "@daohaus/keychain-utils";
import { AddressDisplay, H4, DataIndicator, Tag } from "@daohaus/ui";
import { ZERO_ADDRESS, formatShortDateTimeFromSeconds } from "@daohaus/utils";

import { RegistryMenu } from "./RegistryMenu";
import {
  DataGrid,
  TagSection,
  RegistryCardHeader,
  RegistryOverviewCard,
} from "./RegistryOverview.styles";
import { REGISTRY } from "../../targetDao";
import { RegistryState, checkRegistryState } from "../../utils/registry";

type RegistryProps = {
  target: REGISTRY;
  data?: REGISTRY;
};

export const ForeignRegistryOverview = ({
  target,
  data,
}: RegistryProps) => {
  const [replicaState , setReplicaState] = useState<RegistryState>();
  const registry = target;
  const updated = !!Number(data?.LAST_ACTIVITY_UPDATE);

  useEffect(() => {
    const checkReplicaPendingState = async () => {
      if (data && data?.REGISTRY_ADDRESS != ZERO_ADDRESS) {
        setReplicaState(
          await checkRegistryState({ hydratedRegistryData: data })
        );
      }
    };
    checkReplicaPendingState();
  }, []);

  return (
    <RegistryOverviewCard>
      <RegistryCardHeader>
        <div>
          <H4>{registry.NETWORK_NAME}</H4>
          <TagSection>
            <AddressDisplay
              address={
                data?.REGISTRY_ADDRESS ||
                registry.REGISTRY_ADDRESS?.toString() ||
                ZERO_ADDRESS
              }
              truncate
              copy
              explorerNetworkId={
                (data?.NETWORK_ID as keyof Keychain) ||
                (registry?.NETWORK_ID as keyof Keychain)
              }
            />

            <Tag tagColor="blue">Replica</Tag>
            {data?.REGISTRY_ADDRESS != ZERO_ADDRESS ? (
              <Tag tagColor={replicaState?.warningMsg ? "yellow" : "green"}>
                <RiCheckboxCircleFill />
              </Tag>
            ) : (
              <Tag tagColor="red">
                <RiCheckboxCircleFill />
              </Tag>
            )}
            {replicaState?.warningMsg && (
              <Tag tagColor="yellow">{replicaState?.warningMsg}</Tag>
            )}
            {!data?.DOMAIN_ID && (
              <Tag tagColor="red">Not yet Supported</Tag>
            )}
          </TagSection>
        </div>
        {Number(data?.DOMAIN_ID) > 0 && (
          <div className="right-section">
            <RegistryMenu foreignRegistry={data} />
          </div>
        )}
      </RegistryCardHeader>
      <DataGrid>
        <>
          <DataIndicator
            label="Total Members"
            data={data?.TOTAL_MEMBERS?.toString()}
          />
          <DataIndicator label="Status" data={"..."} />

          <DataIndicator
            label={`Last Sync`}
            size={updated ? "sm" : "lg"}
            data={updated
              ? formatShortDateTimeFromSeconds(data?.LAST_ACTIVITY_UPDATE)
              : "..."}
          />
        </>
      </DataGrid>
    </RegistryOverviewCard>
  );
};
