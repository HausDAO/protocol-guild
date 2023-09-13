import React from "react";

import {
  Dialog,
  DialogContent,
  ParLg,
  SingleColumnLayout,
  useToast,
} from "@daohaus/ui";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

import { handleErrorMessage } from "@daohaus/utils";

import { useConnext } from "../hooks/useConnext";
import { ValidNetwork } from "../utils/keychain";

export const ControllerReplicaForm = ({
  chainId,
  option,
}: {
  chainId: string | undefined;
  option: string | null;
}) => {
  const { errorToast, defaultToast, successToast } = useToast();
  const [isTxLoading, setIsTxLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const daochain = TARGETS.NETWORK_ID as ValidNetwork;

  const originDomainID = TARGETS.DOMAIN_ID;

  const domainID = TARGETS.REPLICA_CHAIN_ADDRESSES.find(
    (r) => r.NETWORK_ID === chainId
  )?.DOMAIN_ID;

  const { isIdle, isLoading, error, data, refetch } = useConnext({
    originDomain: originDomainID,
    destinationDomain: domainID || "",
    chainID: chainId || "",
  });

  return (
    <>
      <SingleColumnLayout title="Replica 0xSplits Controller">
        <FormBuilder
          form={
            option === "Cancel Transfer"
              ? APP_FORM.REPLICA_CANCEL_TRANSFER
              : option === "Transfer Control"
              ? APP_FORM.REPLICA_TRANSFER_CONTROL
              : APP_FORM.REPLICA_ACCEPT_CONTROL
          }
          defaultValues={{
            relayFee: data?.relayerFee,
            chainID: chainId,
            domainID: domainID,
          }}
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
