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
  TEST_FIELD: {
    id: "testField",
    type: "testField",
    label: "Test Field",
    placeholder: "Enter something",
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
  RECIPIENT: {
    id: 'recipient',
    type: 'input',
    label: 'Recipient',
    placeholder: '0x...',
    expectType: 'ethAddress',
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
