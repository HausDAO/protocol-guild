import { FormBuilder } from "@daohaus/form-builder";
import { AppFieldLookup } from "../legos/fieldConfig";

import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const EditMember = () => {

  return (

      <FormBuilder
        form={APP_FORM.EDITMEMBER}
        targetNetwork={TARGETS.NETWORK_ID}
        customFields={AppFieldLookup}
      />

  );
};
