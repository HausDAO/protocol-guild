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
import { HAUS_RPC } from "../pages/Home";
import { useMemberRegistry } from "../hooks/useRegistry";

import { handleErrorMessage } from "@daohaus/utils";

import { useParams } from "react-router-dom";
import { ValidNetwork } from "../utils/createContract";

export const ControllerHomeForm = () => {

  const { errorToast, defaultToast, successToast } = useToast();
  const [isTxLoading, setIsTxLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);


  return (
    <>
      <SingleColumnLayout title="Home 0xSplits Controller">

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
