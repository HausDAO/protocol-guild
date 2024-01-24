import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import styled from "styled-components";

import { BiColumnLayout, CollapsibleCard, ParMd, ParSm, SingleColumnLayout } from "@daohaus/ui";
import { truncateAddress, ZERO_ADDRESS } from "@daohaus/utils";

import { RegistryDisplay } from "../components/molecules/RegistryDisplay";
import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { useNetworkRegistry } from "../hooks/useRegistry";
import { db, SyncAction } from "../utils/indexer";
import { HAUS_RPC, ValidNetwork } from "../utils/keychain";

const SyncActionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SyncActionItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 50%;
  padding: 1rem 0;
  justify-content: space-between;
`;

export const HistoryLogs = () => {

  const { daoChain, registryAddress, replicaChains } = useCurrentRegistry();

  const syncEvents = useLiveQuery(
    () => db.syncActions.toArray(),
    []
  );

  const replicaNames = useMemo(() => {
    const addressToName: {[key: string]: string} = replicaChains
      .reduce((json, r) => {
        json[r.NETWORK_ID as string] = r.NETWORK_NAME;
        return json;
      }, Object.assign({}));
    return addressToName;
  }, [replicaChains]);

  const { isIdle, isLoading, error, data } = useNetworkRegistry({
    registryAddress,
    chainId: daoChain as ValidNetwork,
    rpcs: HAUS_RPC,
  });

  // const [replicaRegistries, setReplicaRegistries] = useState<Array<REGISTRY>>();
  const [crossChainEvents, setCrossChainEvents] = useState<Array<SyncAction & { networkName: string }>>();

  useEffect(() => {
    if (data && syncEvents) {
      // setReplicaRegistries(data?.replicaRegistries);
      setCrossChainEvents(
        syncEvents.map((event) => {
          return {
            ...event,
            networkName: ''
          };
        })
      );
    }
  }, [data, syncEvents]);

  return (
    <BiColumnLayout
      title="Member Registry - Activity History"
      left={
        <SingleColumnLayout subtitle="Membership Activity">
          <ParMd>WIP...</ParMd>
        </SingleColumnLayout>
      }
      right={
        <SingleColumnLayout subtitle="Cross-chain Activity">
          {!syncEvents?.length && <ParMd style={{ marginBottom: "1rem" }}>Indexing events...</ParMd>}
          {syncEvents?.map((record, idx) => (
            <div style={{ marginBottom: '2rem' }} key={`event-container-${idx}`}>
              <CollapsibleCard key={`event-card-${idx}`}
                triggerLabel="More"
                collapsibleContent={(
                  <SyncActionContainer>
                    <SyncActionItem>
                      <ParMd>Replica</ParMd>
                      <ParSm>{replicaNames[record.toChainId] || truncateAddress(record.replicaAddress)}</ParSm>
                    </SyncActionItem>
                    <SyncActionItem>
                      <ParMd>Tx Hash</ParMd>
                      <RegistryDisplay
                        address={record.replicaAddress}
                        explorerNetworkId={record.fromChainId as ValidNetwork}
                        truncate
                        txHash={record.txHash}
                      />
                    </SyncActionItem>
                    <SyncActionItem>
                      <ParMd>Connext Tx</ParMd>
                      <RegistryDisplay
                        address={record.replicaAddress}
                        connextExplorer
                        explorerNetworkId={record.fromChainId as ValidNetwork}
                        truncate
                        txHash={record.transferId}
                      />
                    </SyncActionItem>
                    <SyncActionItem>
                      <ParMd>Status</ParMd>
                      <ParSm>TODO</ParSm>
                    </SyncActionItem>
                  </SyncActionContainer>
                )}
                width="100%"
              >
                <ParSm>{new Date(Number(record.timestamp) * 1000).toLocaleDateString()}</ParSm>
                <ParSm>Action: {record.actionId}</ParSm>
              </CollapsibleCard>
            </div>
          ))}
        </SingleColumnLayout>
      }
    />
  );
}
