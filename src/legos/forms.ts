import { FormLego } from "@daohaus/form-builder";
import { FIELD } from "@daohaus/moloch-v3-legos";
import { CustomFormLego } from "./fieldConfig";
import { APP_FIELD } from "./fields";
import { ACTION_TX, APP_TX } from "./tx";

const PROPOSAL_SETTINGS_FIELDS = [FIELD.PROPOSAL_EXPIRY, FIELD.PROP_OFFERING];

export const APP_FORM: Record<string, CustomFormLego> = {
  SIGNAL: {
    id: "SIGNAL",
    title: "Signal Form",
    subtitle: "Signal Proposal",
    description: "Ratify on-chain using a DAO proposal.",
    requiredFields: { title: true, description: true },
    log: true,
    tx: APP_TX.POST_SIGNAL,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      APP_FIELD.TEST_FIELD,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  ACCEPT_CONTROLL: {
    id: "ACCEPTCONTROLL",
    title: "Accept Control",
    subtitle: "0xSplits",
    description: "Accept control of 0xsplits",
    requiredFields: { title: true, description: true },
    log: true,
    tx: APP_TX.ACCEPT_CONTROL,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
    ],
  },
  REPLICA: {
    id: "REPLICA",
    title: "Register Replica",
    subtitle: "foreign chain registries",
    description: "Register a replica for a foreign chain and set 0xsplits controller",
    requiredFields: { title: true, description: true },
    log: true,
    tx: APP_TX.ACCEPT_CONTROL,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      APP_FIELD.REPLICA,
      APP_FIELD.SPLITS,
      APP_FIELD.RELAY_FEE,
      APP_FIELD.CHAINID
    ],
  },
  NEWMEMBER: {
    id: 'NEWMEMBER',
    title: 'New Member/s Form',
    subtitle: 'Creates a proposal to register new member/s',
    description: 'Enter the Member addresses, activity modifiers and startdates',
    requiredFields: { title: true, description: true, members: true, activitymods: true, startdates: true },
    log: true,
    tx: APP_TX.NEW_MEMBER,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {... APP_FIELD.CSTEXTAREA, id:'members', label: 'Members'},
      {... APP_FIELD.CSTEXTAREA, id:'activitymods', label: 'Activity Modifier 0-100'},
      {... APP_FIELD.CSTEXTAREA, id:'startdates', label: 'Start Dates (unix epoch)'},
      APP_FIELD.MEMBERLISTENER,
    ],
  },
  EDITMEMBER: {
    id: 'EDITMEMBER',
    title: 'Edit Member/s Form',
    subtitle: 'Creates a proposal to edit member/s in the regisrty',
    description: 'Enter the Member addresses and new activity modifiers',
    requiredFields: { title: true, description: true, members: true, activitymods: true },
    log: true,
    tx: APP_TX.EDIT_MEMBER,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {... APP_FIELD.CSTEXTAREA, id:'members', label: 'Members'},
      {... APP_FIELD.CSTEXTAREA, id:'activitymods', label: 'Activity Modifier 0-100'},
      APP_FIELD.EDITMEMBERLISTENER,
      // ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
};
