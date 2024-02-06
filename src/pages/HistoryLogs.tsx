import { useEffect, useMemo, useState } from "react";
import { RiLinkM } from "react-icons/ri";
import { useLiveQuery } from "dexie-react-hooks";
import { groupBy } from "lodash";
import styled from "styled-components";

import { ExplorerLink } from "@daohaus/connect";
import { ValidNetwork as ValidNetworkBase } from "@daohaus/keychain-utils";
import { BiColumnLayout, CollapsibleCard, Link, ParMd, ParSm, SingleColumnLayout } from "@daohaus/ui";
import { truncateAddress } from "@daohaus/utils";

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

const EventContainer = styled.div`
  display: flex;
  border-style: dotted;
  border-color: white;
  border-radius: 2%;
  padding: 2rem;
  margin: 1rem;
`;

const ScrollableContainer = styled.div`
  max-height: 500px;
  overflow: scroll;
`;

type AggMemberEvent = {
  newMembers: number;
  proposalId?: string;
  updateMembers: number;
  timestamp: BigInt;
  txHash: string;
};

export const HistoryLogs = () => {
  const [memberEvents, setMemberEvents] = useState<Array<AggMemberEvent>>([]);
  const { daoChain, daoId, registryAddress, replicaChains } = useCurrentRegistry();

  const syncEvents = useLiveQuery(
    () => db.syncActions.reverse().sortBy('timestamp'), // TODO: is sorting working?
    []
  );

  const memberActions = useLiveQuery(
    () => db.memberActions.toArray(), // event data gets sorted later
    []
  );

  const updateEvents = useLiveQuery(
    () => db.activityUpdates.reverse().sortBy('timestamp'),
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

  useEffect(() => {
    if (memberActions?.length) {
      const actionsAggr = groupBy(memberActions, 'txHash');
      const txHashes = Object.keys(actionsAggr);
      const aggregatedMemberEvents = txHashes.map((txHash) => {
        const actions = actionsAggr[txHash];
        const newMemberActions = actions.filter((a) => a.action === 'NewMember');
        const updateMemberActions = actions.filter((a) => a.action === 'UpdateMember');
        return {
          newMembers: newMemberActions.length,
          updateMembers: updateMemberActions.length,
          timestamp: actions[0].timestamp,
          txHash,
          proposalId: actions[0].daoProposalId,
        }
      }).sort((a, b) => b.timestamp > a.timestamp ? 1 : -1);
      setMemberEvents(aggregatedMemberEvents);
    }
  }, [memberActions]);

  return (
    <BiColumnLayout
      title="Member Registry - Activity History"
      left={
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <SingleColumnLayout subtitle="Membership Activity">
            {memberEvents.length ? (
              <ScrollableContainer>
                {memberEvents.map((e, idx) => (
                  <EventContainer key={`member-ev-container-${idx}`}>
                    <div style={{display: 'flex', alignItems: 'center', maxWidth: '12rem'}}>
                      <ParSm>{new Date(Number(e.timestamp) * 1000).toLocaleString().replaceAll(',', '')}</ParSm>
                    </div>
                    <div style={{margin: '0 2rem'}}>
                      {e.newMembers > 0 && (
                        <ParMd>{`${e.newMembers} new members`}</ParMd>
                      )}
                      {e.updateMembers > 0 && (
                        <ParMd>{`${e.updateMembers} updated members`}</ParMd>
                      )}
                      <Link
                        target="_self"
                        href={`#/molochV3/${daoChain}/${daoId}/proposal/${e.proposalId}`}
                        RightIcon={RiLinkM}
                        showExternalIcon={false}
                      >
                        {`DAO Proposal #${e.proposalId}`}
                      </Link>
                      <ExplorerLink
                        address={e.txHash}
                        chainId={daoChain as ValidNetworkBase}
                        type="tx"
                      >
                        View Transaction
                      </ExplorerLink>
                    </div>
                  </EventContainer>
                ))}
              </ScrollableContainer>
            ) : (
              <ParMd>Indexing events...</ParMd>
            )}
          </SingleColumnLayout>
          <SingleColumnLayout subtitle="Registry Updates">
            {updateEvents?.length ? (
              <ScrollableContainer>
                {updateEvents.map((e, idx) => (
                  <EventContainer key={`update-ev-container-${idx}`}>
                    <div style={{maxWidth: '12rem'}}>
                      <ParSm>{new Date(Number(e.timestamp) * 1000).toLocaleString().replaceAll(',', '')}</ParSm>
                    </div>
                    <div style={{margin: '0 2rem'}}>
                      <ParSm>Total Members: {Number(e.totalMembers)}</ParSm>
                      <ExplorerLink
                        address={e.txHash}
                        chainId={daoChain as ValidNetworkBase}
                        type="tx"
                      >
                        View Transaction
                      </ExplorerLink>
                    </div>
                  </EventContainer>
                ))}
              </ScrollableContainer>
            ) : (
              <ParMd>Indexing events...</ParMd>
            )}
          </SingleColumnLayout>
        </div>
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
                <ParSm>{new Date(Number(record.timestamp) * 1000).toLocaleString().replaceAll(',', '')}</ParSm>
                <ParSm>Action: {record.actionId}</ParSm>
              </CollapsibleCard>
            </div>
          ))}
        </SingleColumnLayout>
      }
    />
  );
}
