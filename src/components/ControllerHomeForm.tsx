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

export const ControllerHomeForm = ({option}: {option: string | null}) => {

  const { errorToast, defaultToast, successToast } = useToast();
  const [isTxLoading, setIsTxLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);


  return (
    <>
      <SingleColumnLayout title="Home 0xSplits Controller">

        <FormBuilder
          form={
            option === "Cancel Transfer" ? APP_FORM.CANCEL_TRANSFER : option === "Transfer Control" ? APP_FORM.TRANSFER_CONTROL : APP_FORM.ACCEPT_CONTROL
          }
          targetNetwork={TARGETS.NETWORK_ID}
          lifeCycleFns={{
            onTxError: (error) => {
              const errMsg = handleErrorMessage({
                error,
              });
              errorToast({ title: "Action Failed", description: errMsg });
              setIsTxLoading(false);
            },
            onTxSuccess: () => {
              defaultToast({
                title: "Action Success",
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
