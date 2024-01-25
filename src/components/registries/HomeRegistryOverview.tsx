import { useEffect, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";

import { Keychain } from "@daohaus/keychain-utils";
import { AddressDisplay, H4, DataIndicator, Tag } from "@daohaus/ui";
import { formatShortDateTimeFromSeconds, truncateAddress } from "@daohaus/utils";

import { RegistryMenu } from "./RegistryMenu";
import {
  DataGrid,
  TagSection,
  RegistryCardHeader,
  RegistryOverviewCard,
} from "./RegistryOverview.styles";
import { Registry } from "../../hooks/context/RegistryContext";
import { RegistryState, checkRegistryState } from "../../utils/registry";
import { REGISTRY } from "../../targetDao";


type RegistryProps = {
  target: Registry;
  owner?: string;
  lastUpdate?: number;
  totalMembers?: number;
};

export const HomeRegistryOverview = ({
  target,
  owner,
  lastUpdate,
  totalMembers,
}: RegistryProps) => {
  const [registryState , setRegistryState] = useState<RegistryState>();
  const { daoChain, networkName, registryAddress, safeAddress } = target;
  const isDAO =
    owner?.toLowerCase() === safeAddress.toLowerCase();
  
  useEffect(() => {
    const checkRegistryPendingState = async () => {
      if (daoChain && registryAddress) {
        const hydratedRegistryData: REGISTRY = {
          NETWORK_ID: daoChain,
          REGISTRY_ADDRESS: registryAddress,
        };
        setRegistryState(
          await checkRegistryState({ hydratedRegistryData })
        );
      }
    };
    checkRegistryPendingState();
  }, [daoChain, registryAddress]);

  console.log('Registry state', registryState);

  return (
    <RegistryOverviewCard>
      <RegistryCardHeader>
        <div>
          <H4>{networkName}</H4>
          <TagSection>
            <AddressDisplay
              address={registryAddress}
              truncate
              copy
              explorerNetworkId={daoChain as keyof Keychain}
            />

            <Tag tagColor="pink">Home</Tag>
            <Tag tagColor={registryState?.warningMsg ? "yellow" : "green"}>
              <RiCheckboxCircleFill />
            </Tag>
            {registryState?.warningMsg && (
              <Tag tagColor="yellow">{registryState?.warningMsg}</Tag>
            )}
          </TagSection>
        </div>
        <div className="right-section">
          <RegistryMenu homeRegistry={target} />
        </div>
      </RegistryCardHeader>
      <DataGrid>
        <>
          <DataIndicator
            label="Total Members"
            data={totalMembers?.toString() || "NA"}
          />
          <DataIndicator
            label="Owner"
            size={!isDAO ? "sm" : "lg"}
            data={isDAO
              ? "DAO"
              : truncateAddress(owner?.toString() || '')
            }
          />
          <DataIndicator
            size={lastUpdate ? "sm" : "lg"}
            label={`Last Update`}
            data={lastUpdate
              ? formatShortDateTimeFromSeconds(lastUpdate.toString())
              : "..."}
          />
        </>
      </DataGrid>
    </RegistryOverviewCard>
  );
};
