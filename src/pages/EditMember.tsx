import { FormBuilder } from "@daohaus/form-builder";

import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { RegistryFields } from "../legos/fieldConfig";
import { APP_FORM } from "../legos/forms";

export const EditMember = () => {
  const { daoChain } = useCurrentRegistry();

  return (
    <FormBuilder
      form={APP_FORM.EDIT_MEMBER}
      targetNetwork={daoChain}
      customFields={RegistryFields}
    />
  );
};
