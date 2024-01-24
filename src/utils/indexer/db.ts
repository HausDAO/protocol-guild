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
};

export interface Member {
  address: EthAddress;
  activityMultiplier: number;
  activeSeconds: number;
};

export interface Subscription {
  // chainId: 5 | 1;
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
  syncActions!: Table<SyncAction>;
  keyvals!: Table<any>;

  constructor() {
    super("networkRegistryDb");
    this.version(1).stores({
      // cookieJars: "&address, address, type, chainId", // Primary key and indexed props
      subscriptions:
        "[chainId+address+event.name], address, lastBlock, event.name, chainId",
      replicas: "[chainId+address]",
      members: "&address",
      syncActions: "[transferId+replicaAddress], replicaAddress",
      // ratings: "[assessTag+user], assessTag, user, isGood",
      keyvals: "",
    });
  }
}

export const db = new NetworkRegistryDB();
