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
import { RegistryFields } from "../legos/fieldConfig";
import { APP_FORM } from "../legos/forms";

const DialogActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ControllerHomeForm = ({option}: {option: string | null}) => {
  const { errorToast, defaultToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const { daoChain, daoId } = useCurrentRegistry();

  const formLego = option === "Cancel Transfer"
    ? APP_FORM.CANCEL_TRANSFER
    : option === "Transfer Control"
      ? APP_FORM.TRANSFER_CONTROL
      : APP_FORM.ACCEPT_CONTROL;

  return (
    <>
      <SingleColumnLayout>
        <FormBuilder
          form={formLego}
          targetNetwork={daoChain}
          customFields={{ ...RegistryFields }}
          defaultValues={{
            title: `0xSplit: ${option}`,
            description: `Main registry`,
          }}
          lifeCycleFns={{
            onTxError: (error) => {
              const errMsg = handleErrorMessage({
                error,
              });
              errorToast({ title: "Action Failed", description: errMsg });
            },
            onTxSuccess: () => {
              defaultToast({
                title: "Action Success",
                description: "A Proposal has been submitted to the DAO",
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
