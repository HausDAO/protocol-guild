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

export const Trigger = ({ onSuccess }: { onSuccess: () => void }) => {
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

  const handleTrigger = () => {
    setIsDataLoading(true);
    fireTransaction({
      tx: {
        id: "TRIGGER",
        contract: {
          type: "static",
          contractName: "MEMBER_REGISTRY",
          // @ts-ignore
          abi: MEMBER_REGISTRY,
          targetAddress: TARGETS.REGISTRY_ADDRESS,
        },
        method: "updateAll",
        disablePoll: true,
        args: [
          { type: "static", value: data?.membersSorted.map((m) => m.account) as [] },
          { type: "static", value: "0" }, // split distribution fee
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
      {isDataLoading ? <Spinner size="2rem" strokeWidth=".2rem" /> : "Update Home"}
    </GatedButton>
  );
};
