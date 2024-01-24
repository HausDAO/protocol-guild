import { useState } from "react";
import styled from "styled-components";

import { FormBuilder } from "@daohaus/form-builder";
import {
  Button,
  Dialog,
  DialogContent,
  Link,
  ParMd,
  SingleColumnLayout,
  useToast,
} from "@daohaus/ui";
import { handleErrorMessage } from "@daohaus/utils";

import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { useConnext } from "../hooks/useConnext";
import { RegistryFields } from "../legos/fieldConfig";
import { APP_FORM } from "../legos/forms";



const DialogActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ControllerReplicaForm = ({
  chainId,
  option,
}: {
  chainId: string | undefined;
  option: string | null;
}) => {
  const { errorToast, defaultToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    connextEnv,
    daoChain,
    daoId,
    domainId,
    replicaChains,
    safeAddress
  } = useCurrentRegistry();

  const destinationDomainId = replicaChains.find(
    (r) => r.NETWORK_ID === chainId
  )?.DOMAIN_ID || "";

  const { isIdle, isLoading, error, data: connextFeeData, refetch } = useConnext({
    network: connextEnv,
    destinationChainIds: [chainId || ""],
    destinationDomains: [destinationDomainId],
    originChainId: daoChain || "",
    originDomain: domainId,
    signerAddress: safeAddress,
  });

  const formLego = option === "Cancel Transfer"
    ? APP_FORM.REPLICA_CANCEL_TRANSFER
    : option === "Transfer Control"
    ? APP_FORM.REPLICA_TRANSFER_CONTROL
    : APP_FORM.REPLICA_ACCEPT_CONTROL;

  return (
    <>
      <SingleColumnLayout>
        <FormBuilder
          form={formLego}
          defaultValues={{
            relayFee: connextFeeData?.relayerFeeWei,
            chainID: chainId,
            domainID: domainId,
          }}
          targetNetwork={daoChain}
          customFields={{ ...RegistryFields }}
          lifeCycleFns={{
            onTxError: (error) => {
              const errMsg = handleErrorMessage({
                error,
              });
              errorToast({ title: "Trigger Failed", description: errMsg });
            },
            onTxSuccess: () => {
              defaultToast({
                title: "Trigger Success",
                description: "Proposal has been submitted",
              });
              setIsSuccess(true);
            },
          }}
        />
      </SingleColumnLayout>
      {isSuccess && (
        <Dialog defaultOpen>
          <DialogContent title="Success">
            <DialogActions>
            <ParMd>Proposal Submitted: The DAO can now vote to execute.</ParMd>
              <Link
                href={`https://admin.daohaus.fun/#/molochv3/${daoChain}/${daoId}`}  
                target="_blank"
              >
                <Button>Go to DAO Admin</Button>
              </Link>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
