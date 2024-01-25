import { CoreFieldLookup } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";
import { ReplicaValidatorField } from "../components/customFields/ReplicaValidatorField";
import { CSTextarea } from "../components/customFields/CSTextarea";
import { OneShareArrayField } from "../components/customFields/OneShareArrayField";
import { EditArrayField } from "../components/customFields/EditArrayField";
import { ReplicaArrayField } from "../components/customFields/ReplicaArrayField";

export const RegistryFields = {
  ...MolochFields,
  cstextarea: CSTextarea,
  editmemberlistener: EditArrayField,
  memberlistener: OneShareArrayField,
  replicalistener: ReplicaArrayField,
  replicaValidatorField: ReplicaValidatorField,
};

export type CustomFieldLego = FieldLegoBase<typeof RegistryFields>;
export type CustomFormLego = FormLegoBase<typeof RegistryFields>;
