import React from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const ReplicaConfig = () => {

  return (
    <SingleColumnLayout title="Replicants">
      <ParLg>Current Networks</ParLg>
      <ParLg>Add new</ParLg>
      <ParLg>Accept/transfer splits Control</ParLg>
      <ParLg>Documentation for current owner to deploy and transfer</ParLg>


      <FormBuilder
        form={APP_FORM.REPLICA}
        targetNetwork={TARGETS.DEFAULT_CHAIN}
      />

    </SingleColumnLayout>
  );
};
