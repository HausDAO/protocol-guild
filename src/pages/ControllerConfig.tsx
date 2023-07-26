import React from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const ControllerConfig = () => {

  return (
    <SingleColumnLayout title="0xSplits Controller">
      <ParLg>Current Owner?</ParLg>
      <ParLg>Transfer Control</ParLg>
      <ParLg>Accept Control</ParLg>
      <ParLg>maybe better to fix walletconnect and give instructions for that</ParLg>
      <ParLg>set bridge id</ParLg>


      <FormBuilder
        form={APP_FORM.ACCEPT_CONTROLL}
        targetNetwork={TARGETS.NETWORK_ID}
      />

    </SingleColumnLayout>
  );
};
