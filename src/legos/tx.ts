import { POSTER_TAGS, TXLegoBase } from "@daohaus/utils";
import { buildMultiCallTX } from "@daohaus/tx-builder";
import { APP_CONTRACT } from "./contract";
import { CONTRACT } from "@daohaus/moloch-v3-legos";
import { TARGETS } from "../targetDao";

export enum ProposalTypeIds {
  Signal = "SIGNAL",
  IssueSharesLoot = "ISSUE",
  AddShaman = "ADD_SHAMAN",
  TransferErc20 = "TRANSFER_ERC20",
  TransferNetworkToken = "TRANSFER_NETWORK_TOKEN",
  UpdateGovSettings = "UPDATE_GOV_SETTINGS",
  UpdateTokenSettings = "TOKEN_SETTINGS",
  TokensForShares = "TOKENS_FOR_SHARES",
  GuildKick = "GUILDKICK",
  WalletConnect = "WALLETCONNECT",
  NewMember = 'NEWMEMBER',
  EditMember = 'EDITMEMBER',  
  MultiCall = 'MULTICALL',

}

export const APP_TX = {
  POST_SIGNAL: buildMultiCallTX({
    id: "POST_SIGNAL",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: { type: "static", value: ProposalTypeIds.Signal },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.POSTER,
        method: "post",
        args: [
          {
            type: "JSONDetails",
            jsonSchema: {
              title: `.formValues.title`,
              description: `.formValues.description`,
              contentURI: `.formValues.link`,
              contentURIType: { type: "static", value: "url" },
              proposalType: { type: "static", value: ProposalTypeIds.Signal },
            },
          },
          { type: "static", value: POSTER_TAGS.signalProposal },
        ],
      },
    ],
  }),
  REPLICA: buildMultiCallTX({
    id: "REPLICA",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: { type: "static", value: ProposalTypeIds.MultiCall },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: "updateNetworkRegistry",
        args: [
          '.formValues.chainid',
          '.formValues.replica',
        ],
      },
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: "updateNetworkSplit",
        args: [
          '.formValues.chainid',
          '.formValues.splits',
          '.formValues.splits',
          '.formVaules.relay_fee'
        ],
      },
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: "acceptNetworkSplitControl",
        args: [
          '.formValues.chainid',
          '.formValues.replica',
        ],
      },
    ],
  }),
  ACCEPT_CONTROL: buildMultiCallTX({
    id: "ACCEPT_CONTROL",
    JSONDetails: {
      type: "JSONDetails",
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: "static", value: "url" },
        proposalType: { type: "static", value: ProposalTypeIds.MultiCall },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: "acceptSplitControl",
        args: [],
      },
    ],
  }),
  NEW_MEMBER: buildMultiCallTX({
    id: 'NEW_MEMBER',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.NewMember },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.CURRENT_DAO,
        method: 'mintShares',
        args: [
          '.formValues.members', 
          '.formValues.shares',
        ]
      },
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: 'batchNewMember',
        args: [
          '.formValues.members',
          '.formValues.activitymods',
          '.formValues.startdates',
          //{ type: 'static', value: POSTER_TAGS.signalProposal }, //hardcoded
        ],
      },
    ],
  }),
  EDIT_MEMBER: buildMultiCallTX({
    id: 'EDIT_MEMBER',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.EditMember },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.MEMBER_REGISTRY,
        method: 'batchUpdateMember',
        args: [
          '.formValues.members',
          '.formValues.activitymods',
          //{ type: 'static', value: POSTER_TAGS.signalProposal }, //hardcoded
        ],
      },
    ],
  })
};

export const ACTION_TX: Record<string, TXLegoBase> = {
  UPDATE_SECONDS: {
    id: 'UPDATE_SECONDS',
    contract: CONTRACT.MEMBER_REGISTRY,
    method: 'updateSecondsActive',
  },
  TRIGGER: {
    id: 'TRIGGER',
    contract: CONTRACT.MEMBER_REGISTRY,
    method: 'updateAll',
    args: ['.sortedMemberList',]
  },
  
  MCTRIGGER: {
    id: 'MCTRIGGER',
    contract: CONTRACT.MULTICALL,
    method: 'multiSend',
    args: [
      {
        type: 'multicall',
        actions: [
          {
            contract: CONTRACT.MEMBER_REGISTRY,
            method: 'updateSecondsActive',
            operations: {type: 'static', value: '0x00'},
            args: []
          },
          // {
          //   contract: CONTRACT.MEMBER_REGISTRY,
          //   method: 'updateSplits',
          //   operations: {type: 'static', value: 1},
          //   args: ['.sortedMemberList',]
          // }
        ]
      }
    ]
  },
};