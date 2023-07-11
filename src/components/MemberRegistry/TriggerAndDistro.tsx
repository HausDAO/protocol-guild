import React from "react";
import { handleErrorMessage, TXLego } from "@daohaus/utils";
import { useDHConnect } from "@daohaus/connect";
import { useTxBuilder } from "@daohaus/tx-builder";
import { Spinner, useToast, GatedButton } from "@daohaus/ui";

import { ACTION_TX } from "../../legos/tx";
import { TARGETS } from "../../targetDao";

export const TriggerAndDistro = ({
  onSuccess,
  sortedMemberList,
}: {
  onSuccess: () => void;
  sortedMemberList: any;
}) => {
  const daochain = TARGETS.DEFAULT_CHAIN;
  const { fireTransaction } = useTxBuilder();
  const { chainId, address } = useDHConnect();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTrigger = () => {
    setIsLoading(true);
    fireTransaction({
      // tx: ACTION_TX.MCTRIGGER as TXLego,
      // callerState: {sortedMemberList},
      tx: {
        ...ACTION_TX.TRIGGERANDDISTRO,
        staticArgs: [sortedMemberList],
      } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({
            title: "Update and Distribute Failed",
            description: errMsg,
          });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Update and Distribute Success",
            description: "Please wait table to update",
          });
          setIsLoading(false);
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
      // centerAlign
    >
      {isLoading ? (
        <Spinner size="2rem" strokeWidth=".2rem" />
      ) : (
        "Update and Distribute ETH"
      )}
    </GatedButton>
  );
};
