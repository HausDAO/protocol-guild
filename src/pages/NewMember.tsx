import { FormBuilder } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";

import { AppFieldLookup } from "../legos/fieldConfig";

import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const NewMember = () => {


  return (

      <FormBuilder
        form={APP_FORM.NEWMEMBER}
        targetNetwork={TARGETS.DEFAULT_CHAIN}
        customFields={{ ...MolochFields, ...AppFieldLookup }}
      />

  );
};
