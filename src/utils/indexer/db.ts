import { AbiEvent } from "abitype";
import Dexie, { Table } from "dexie";
import { EthAddress } from "@daohaus/utils";

import { EventHandler } from "./eventHandlers";

export interface ReplicaRegistry {
  address: EthAddress;
  chainId: string;
  domainId: string;
  delegate: EthAddress;
};

export interface SyncAction {
  actionId: string;
  fromChainId: string;
  toChainId: string;
  replicaAddress: EthAddress;
  transferId: string;
  txHash: string;
  submitted: boolean;
  processed: boolean;
  timestamp: BigInt;
  daoProposalId?: string;
};

export interface Member {
  address: EthAddress;
  activityMultiplier: number;
  activeSeconds: number;
};

export interface MemberAction {
  action: string;
  memberAddress: EthAddress;
  timestamp: BigInt;
  txHash: string;
  daoProposalId?: string;
}

export interface ActivityUpdate {
 timestamp: BigInt;
 totalMembers: BigInt;
 txHash: string;
}

export interface Subscription {
  aggregateByTxHash: boolean;
  daoProposal: boolean;
  chainId: number;
  address: EthAddress;
  event: AbiEvent;
  eventHandler: EventHandler;
  fromBlock: bigint;
  lastBlock: bigint;
}

export class NetworkRegistryDB extends Dexie {
  // We just tell the typing system this is the case
  subscriptions!: Table<Subscription>;
  replicas!: Table<ReplicaRegistry>;
  members!: Table<Member>;
  memberActions!: Table<MemberAction>;
  activityUpdates!: Table<ActivityUpdate>;
  syncActions!: Table<SyncAction>;
  keyvals!: Table<any>;

  constructor() {
    super("networkRegistryDb");
    this.version(2).stores({
      subscriptions:
        "[chainId+address+event.name], address, lastBlock, event.name, chainId",
      replicas: "[chainId+address]",
      members: "&address",
      memberActions: "[txHash+action+memberAddress], timestamp",
      activityUpdates: "&txHash",
      syncActions: "[transferId+replicaAddress], replicaAddress, timestamp",
      keyvals: "",
    });
  }
}

export const db = new NetworkRegistryDB();
