import { useDHConnect } from "@daohaus/connect";
import { FormBuilder } from "@daohaus/form-builder";
import { TXBuilder } from "@daohaus/tx-builder";
import { AppFieldLookup } from "../legos/fieldConfig";

import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const EditMember = () => {
  const { provider } = useDHConnect();

  return (
    <TXBuilder
      provider={provider}
      chainId={TARGETS.DEFAULT_CHAIN}
      daoId={TARGETS.DAO_ADDRESS}
      safeId={TARGETS.SAFE_ADDRESS}
      appState={{}}
    >
      <FormBuilder
        form={APP_FORM.EDITMEMBER}
        targetNetwork={TARGETS.DEFAULT_CHAIN}
        customFields={AppFieldLookup}
      />
    </TXBuilder>
  );
};
