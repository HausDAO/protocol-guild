import { useDHConnect } from "@daohaus/connect";
import { FormBuilder } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";
import { TXBuilder } from "@daohaus/tx-builder";
import { AppFieldLookup } from "../legos/fieldConfig";

import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

export const NewMember = () => {
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
        form={APP_FORM.NEWMEMBER}
        targetNetwork={TARGETS.DEFAULT_CHAIN}
        customFields={{ ...MolochFields, ...AppFieldLookup }}
      />
    </TXBuilder>
  );
};
