import React from "react";

import {
  AddressDisplay,
  Dialog,
  DialogContent,
  ParLg,
  SingleColumnLayout,
  useToast,
} from "@daohaus/ui";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "./Home";
import { useMemberRegistry } from "../hooks/useRegistry";
import { AddressKeyChain, ValidNetwork } from "../utils/createContract";
import { Keychain } from "@daohaus/keychain-utils";
import { handleErrorMessage } from "@daohaus/utils";
import { useTxBuilder } from "@daohaus/tx-builder";

export const ControllerConfig = () => {
  const { fireTransaction } = useTxBuilder();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isTxLoading, setIsTxLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const daochain = TARGETS.NETWORK_ID as ValidNetwork;
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  if (isLoading) return <ParLg>Loading...</ParLg>;

  return (
    <>
      <SingleColumnLayout title="0xSplits Controller">
        <ParLg>
          Registry Owner:{" "}
          {data?.owner.toLowerCase() == TARGETS.SAFE_ADDRESS.toLowerCase() &&
            "DAO"}
        </ParLg>
        <AddressDisplay
          address={data?.owner as string}
          truncate
          copy
          explorerNetworkId={daochain as keyof Keychain}
        />
        <ParLg>TODO: Split transfer status</ParLg>
        <ParLg>TODO: Transfer Control</ParLg>
        <ParLg>TODO: Cancel transfer</ParLg>
        <ParLg>TODO: manage control on foreignRegistries</ParLg>
        <ParLg>TODO: add success dialog and direct to DAO</ParLg>


        <FormBuilder
          form={APP_FORM.ACCEPT_CONTROLL}
          targetNetwork={TARGETS.NETWORK_ID}
          lifeCycleFns={{
            onTxError: (error) => {
              const errMsg = handleErrorMessage({
                error,
              });
              errorToast({ title: "Trigger Failed", description: errMsg });
              setIsTxLoading(false);
            },
            onTxSuccess: () => {
              defaultToast({
                title: "Trigger Success",
                description: "Proposal has been submitted",
              });
              setIsTxLoading(false);
              setIsSuccess(true);
            },
          }}
        />
      </SingleColumnLayout>
      {isSuccess && (
        <Dialog>
          <DialogContent title="Success">
            <ParLg>Success!</ParLg>
            <ParLg>Go to DAO and vote on proposal</ParLg>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
