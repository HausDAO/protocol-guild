import { NestedArray, POSTER_TAGS, TXLegoBase, ValidArgType } from "@daohaus/utils";
import { buildMultiCallTX } from "@daohaus/tx-builder";
import { APP_CONTRACT } from "./contract";
import { CONTRACT } from "@daohaus/moloch-v3-legos";

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

const nestInArray = (arg: ValidArgType | ValidArgType[]): NestedArray => {
  return {
    type: 'nestedArray',
    args: Array.isArray(arg) ? arg : [arg],
  };
};

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
  REPLICA_REGISTER: buildMultiCallTX({
    id: "REPLICA_REGISTER",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "updateNetworkRegistry",
        args: [
          '.formValues.chainID',
          '.formValues.replicaData', // TODO: this needs to be a tuple (uint32 domainId; address registryAddress; address delegate;)
        ],
      },
    ],

  }),
  BATCH_REPLICA_CLAIM: buildMultiCallTX({
    id: "BATCH_REPLICA_CLAIM",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "updateNetworkRegistry",
        args: [
          '.formValues.chainID',
          '.formValues.replicaData', // this needs to be a tuple (uint32 domainId; address registryAddress; address delegate;)
        ],
      },
      {
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "acceptNetworkSplitControl",
        args: [
          nestInArray('.formValues.chainID'),
          nestInArray('.formValues.relayFee'),
        ],
        value: '.formValues.relayFee',      
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "acceptSplitControl",
        args: [],
      },
    ],
  }),
  REPLICA_ACCEPT_CONTROL: buildMultiCallTX({
    id: "REPLICA_ACCEPT_CONTROL",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "acceptNetworkSplitControl",
        args: [
          nestInArray('.formValues.chainID'),
          nestInArray('.formValues.relayFee'),
        ],
        value: '.formValues.relayFee',      
      },
    ],
  }),
  TRANSFER_CONTROL: buildMultiCallTX({
    id: "TRANSFER_CONTROL",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "transferSplitControl",
        args: [".formValues.newOwner"],
      },
    ],
  }),
  REPLICA_TRANSFER_CONTROL: buildMultiCallTX({
    id: "REPLICA_TRANSFER_CONTROL",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "transferNetworkSplitControl",
        args: [
          nestInArray('.formValues.chainID'),
          nestInArray('.formValues.newOwners'),
          nestInArray('.formValues.relayFee'),
        ],
        value: '.formValues.relayFee',      
      },
    ],
  }),
  CANCEL_TRANSFER: buildMultiCallTX({
    id: "CANCEL_TRANSFER",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "cancelSplitControlTransfer",
        args: [],
      },
    ],
  }),
  REPLICA_CANCEL_TRANSFER: buildMultiCallTX({
    id: "REPLICA_CANCEL_TRANSFER",
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
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "cancelNetworkSplitControlTransfer",
        args: [
          nestInArray('.formValues.chainID'),
          nestInArray('.formValues.relayFee'),
        ],
        value: '.formValues.relayFee',      
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
        proposalType: { type: 'static', value: ProposalTypeIds.MultiCall },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.CURRENT_DAO,
        method: 'mintShares',
        args: [
          '.formValues.members', 
          '.formValues.shares',
        ],
      },
      {
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: 'syncBatchNewMembers',
        args: [
          '.formValues.members',
          '.formValues.activitymods',
          '.formValues.startdates',
          { type: 'static', value: [] }, // TODO: chainIds
          { type: 'static', value: [] }, // TODO: relayerFees
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
        proposalType: { type: 'static', value: ProposalTypeIds.MultiCall },
      },
    },
    actions: [
      {
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: 'syncBatchUpdateMembersActivity',
        args: [
          '.formValues.members',
          '.formValues.activitymods',
          { type: 'static', value: [] }, // TODO: chainIds
          { type: 'static', value: [] }, // TODO: relayerFees
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