import React from "react";
import { handleErrorMessage, TXLego } from "@daohaus/utils";
import { useDHConnect } from "@daohaus/connect";
import { useTxBuilder } from "@daohaus/tx-builder";
import { Spinner, useToast, GatedButton, Button } from "@daohaus/ui";

import { ACTION_TX } from "../../legos/tx";

import MEMBER_REGISTRY from "../../abis/memberRegistry.json";
import { TARGETS } from "../../targetDao";
import { useMemberRegistry } from "../../hooks/useRegistry";
import { HAUS_RPC } from "../../pages/Home";
import { useConnextMulti } from "../../hooks/useConnextMulti";

import { formatEther } from 'viem'

export const SyncUpdateAll = ({ onSuccess }: { onSuccess: () => void }) => {
  const daochain = TARGETS.NETWORK_ID;
  const { fireTransaction } = useTxBuilder();
  const { chainId, address } = useDHConnect();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  const { 
    isIdle: isIdleConnext, 
    isLoading: isLoadingConnext, 
    error: errorConnext, 
    data: dataConnext, 
    refetch: refetchConnext } = useConnextMulti({
    originDomain: TARGETS.DOMAIN_ID,
    destinationDomains: TARGETS.REPLICA_CHAIN_ADDRESSES.map(
      (r) => r.DOMAIN_ID || ""
    ),
    chainID: TARGETS.NETWORK_ID || "",
  });

  const totalRelayerFees = dataConnext?.relayerFeesWei.reduce(
    (a: any, b: any) => BigInt(a) + BigInt(b),
    0
  );
  
  console.log('totalRelayerFees', totalRelayerFees)  
  console.log('relayerFeesWei', dataConnext?.relayerFeesWei)


  if (isLoadingConnext || isLoading) return <Spinner />;

  const handleTrigger = () => {
    setIsDataLoading(true);
    fireTransaction({
      tx: {
        id: "SYNCUPDATEALL",
        contract: {
          type: "static",
          contractName: "MEMBER_REGISTRY",
          abi: MEMBER_REGISTRY,
          targetAddress: TARGETS.REGISTRY_ADDRESS,
        },
        method: "syncUpdateAll",
        disablePoll: true,
        overrides: {
          value: { type: "static", value: totalRelayerFees || 0 },
        },
        args: [
          { type: "static", value: data?.membersSorted.map((m) => m.account) as [] },
          { type: "static", value: "0" }, // split distribution fee
          {
            type: "static",
            value: TARGETS.REPLICA_CHAIN_ADDRESSES.map(
              (r) => r.NETWORK_ID || ""
            ),
          },
          { type: "static", value: dataConnext?.relayerFeesWei || [] }
        ],
      },
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({ title: "Trigger Failed", description: errMsg });
          setIsDataLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Trigger Success",
            description: "Please wait for table to update",
          });
          refetch();
          setIsDataLoading(false);

        },
      },
    });
  };

  const isConnectedToDao =
    chainId === daochain
      ? true
      : "You are not connected to the same network as the DAO";

  return (
    <GatedButton
      color="secondary"
      rules={[isConnectedToDao]}
      onClick={handleTrigger}
    >
      {isDataLoading ? <Spinner size="2rem" strokeWidth=".2rem" /> : "Update Seconds and Sync 0xSplit"}
    </GatedButton>
  );
};
