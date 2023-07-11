import { FormBuilder } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";

import { APP_FORM } from "../legos/forms";
import { TARGETS, TARGET_DAO } from "../targetDao";
import { AppFieldLookup } from "../legos/fieldConfig";

export const FormTest = () => {
  return (
    <FormBuilder
      form={APP_FORM.SIGNAL}
      targetNetwork={TARGETS.DEFAULT_CHAIN}
      customFields={{ ...MolochFields, ...AppFieldLookup }}
    />
  );
};
