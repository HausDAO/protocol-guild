import React from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";
import { TXBuilder } from "@daohaus/tx-builder";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";
import { useDHConnect } from "@daohaus/connect";

export const ControllerConfig = () => {
  const { provider } = useDHConnect();

  return (
    <SingleColumnLayout title="0xSplits Controller">
      <ParLg>Current Owner?</ParLg>
      <ParLg>Transfer Control</ParLg>
      <ParLg>Accept Control</ParLg>
      <ParLg>maybe better to fix walletconnect and give instructions for that</ParLg>

      <TXBuilder
      provider={provider}
      chainId={TARGETS.DEFAULT_CHAIN}
      daoId={TARGETS.DAO_ADDRESS}
      safeId={TARGETS.SAFE_ADDRESS}
      appState={{}}
    >
      <FormBuilder
        form={APP_FORM.ACCEPT_CONTROLL}
        targetNetwork={TARGETS.DEFAULT_CHAIN}
      />
    </TXBuilder>
    </SingleColumnLayout>
  );
};
