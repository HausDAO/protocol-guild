import { FieldLego, CoreFieldLookup } from "@daohaus/form-builder";
import { CustomFieldLego } from "./fieldConfig";

export const APP_FIELD: Record<string, CustomFieldLego> = {
  TITLE: {
    id: "title",
    type: "input",
    label: "Proposal Title",
    placeholder: "Enter title",
  },
  DESCRIPTION: {
    id: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter description",
  },
  LINK: {
    id: "link",
    type: "input",
    label: "Link",
    placeholder: "http://",
    expectType: "url",
  },
  ARRAY: {
    id: 'array',
    type: 'textarea',
    label: 'array input',
    placeholder: 'array items seperated by new lines',
    rules: {setValueAs: (value: string) => {return value.split(/\r?\n/)}}
  },
  CSTEXTAREA: {
    id: 'cstextarea',
    type: 'cstextarea',
    label: 'array input',
    placeholder: 'array items seperated by new lines',
    itemNoun: {
      singular: "item",
      plural: "items",
    }
  },
  MEMBERLISTENER: {
    id: 'memberlistener',
    type: 'memberlistener',
  },
  EDITMEMBERLISTENER: {
    id: 'editmemberlistener',
    type: 'editmemberlistener',
  },
  REPLICALISTENER: {
    id: 'replicalistener',
    type: 'replicalistener',
  },
  RECIPIENT: {
    id: 'recipient',
    type: 'input',
    label: 'Recipient',
    placeholder: '0x...',
    expectType: 'ethAddress',
  },
  REPLICA: {
    id: 'replica',
    type: 'replicaValidatorField',
    label: 'Replica',
    placeholder: '0x...',
    expectType: 'ethAddress',
  },
  SPLITS: {
    id: 'splits',
    type: 'input',
    label: 'Splits',
    placeholder: '0x...',
    expectType: 'ethAddress',
  },
  CHAINID: {
    id: 'chainID',
    type: 'input',
    label: 'Chain ID',
    placeholder: '0x...',
    disabled: true,
  },
  RELAY_FEE: {
    id: 'relayFee',
    type: 'toWeiInput',
    label: 'Connext Relay Fee',
    disabled: true,
  },
  DELEGATE: {
    id: 'delegate',
    type: 'input',
    label: 'Delegate',
    disabled: true,
    expectType: 'ethAddress',
  },
  DOMAIN_ID: {
    id: 'domainID',
    type: 'input',
    label: 'Connext Domain ID',
    disabled: true,
  },
  TO_WEI: {
    id: 'shouldOverwrite',
    type: 'toWeiInput',
    label: 'Should Overwrite',
  },
  STARTDATE: {
    id: 'startdate',
    type: 'timePicker',
    label: 'Start Date (Unix Epoch in seconds)',
  },
  ACTIVITYMODIFIER: {
    id: 'activitymodifier',
    type: 'input',
    label: 'Activity Modifier',
    placeholder: '(1: fulltime, .5: halftime, 0: notime)',
  },
};
