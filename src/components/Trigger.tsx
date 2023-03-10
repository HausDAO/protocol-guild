import React from "react";
import { handleErrorMessage, TXLego } from "@daohaus/utils";
import { useDHConnect } from "@daohaus/connect";
import { useTxBuilder } from "@daohaus/tx-builder";
import { Spinner, useToast } from "@daohaus/ui";

import { ACTION_TX } from "../legos/tx";
import { GatedButton } from "./GatedButton";

export const Trigger = ({
  onSuccess,
  sortedMemberList,
}: {
  onSuccess: () => void;
  sortedMemberList: any;
}) => {
  const daochain = "0x5";
  const { fireTransaction } = useTxBuilder();
  const { chainId, address } = useDHConnect();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTrigger = () => {
    setIsLoading(true);
    fireTransaction({
      // tx: ACTION_TX.MCTRIGGER as TXLego,
      // callerState: {sortedMemberList},
      tx: { ...ACTION_TX.TRIGGER, staticArgs: [sortedMemberList] } as TXLego,
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({ title: "Trigger Failed", description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Trigger Success",
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
    >
      {isLoading ? <Spinner size="2rem" strokeWidth=".2rem" /> : "Update Only"}
    </GatedButton>
  );
};
