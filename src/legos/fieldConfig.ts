import { CoreFieldLookup } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";
import { TestField } from "../components/customFields/fieldTest";
import { CSTextarea } from "../components/customFields/CSTextarea";
import { OneShareArrayField } from "../components/customFields/OneShareArrayField";
import { EditArrayField } from "../components/customFields/EditArrayField";
import { ReplicaArrayField } from "../components/customFields/ReplicaArrayField";

export const AppFieldLookup = {
  ...MolochFields,
  testField: TestField,
  cstextarea: CSTextarea,
  memberlistener: OneShareArrayField,
  replicalistener: ReplicaArrayField,
  editmemberlistener: EditArrayField,
};

export type CustomFieldLego = FieldLegoBase<typeof AppFieldLookup>;
export type CustomFormLego = FormLegoBase<typeof AppFieldLookup>;
