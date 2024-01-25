import { AbiFunction, parseAbi, parseAbiItem, parseAbiParameters } from "abitype";
import _ from "lodash";
import {
  getFunctionSelector,
  Log,
  decodeAbiParameters,
  decodeFunctionData,
  PublicClient,
  stringToBytes,
  keccak256,
} from "viem";

import { EthAddress } from "@daohaus/utils";

import {
  db,
} from "./db";
import { APP_ABIS } from "../../legos/abis";


const NetworkRegistryDecodedAbi = APP_ABIS.NETWORK_REGISTRY
  .filter((item) => item.type === "function")
  .map((item) => ({
    ...item,
    selector: getFunctionSelector(item as AbiFunction)
  }));

export type EventHandler =
  "StoreNetworkRegistry" | "StoreMember" | "StoreSyncAction" | "StoreMemberAction" | "StoreRegistryUpdate";

export type EventHandlerType = {
  aggregateByTxHash: boolean;
  event: string;
  handler: EventHandler;
};

export const NETWORK_REGISTRY_EVENTS: Array<EventHandlerType> = [
  {
    aggregateByTxHash: false,
    event: "event NetworkRegistryUpdated(uint32 indexed _chainId, address indexed _registryAddress, uint32 indexed _domainId, address _delegate)",
    handler: "StoreNetworkRegistry" as EventHandler,
  },
  {
    aggregateByTxHash: false,
    event: "event SyncMessageSubmitted(bytes32 indexed _transferId, uint32 indexed _chainId, bytes4 indexed _action, address _registryAddress)",
    handler: "StoreSyncAction" as EventHandler,
  },
  {
    aggregateByTxHash: false,
    event: "event SyncActionPerformed(bytes32 indexed _transferId, uint32 indexed _originDomain, bytes4 indexed _action, bool _success, address _originSender)",
    handler: "StoreSyncAction" as EventHandler, // TODO: own handler
  },
  {
    aggregateByTxHash: false, // TODO:
    event: "event NewMember(address indexed _memberAddress, uint32 _startDate, uint32 _activityMultiplier)",
    handler: "StoreMemberAction" as EventHandler,
  },
  {
    aggregateByTxHash: false, // TODO:
    event: "event UpdateMember(address indexed _memberAddress, uint32 _activityMultiplier, uint32 _startDate, uint32 _secondsActive)",
    handler: "StoreMemberAction" as EventHandler,
  },
  {
    aggregateByTxHash: false,
    event: "event RegistryActivityUpdate(uint32 _timestamp, uint256 _totalMemberUpdates)",
    handler: "StoreRegistryUpdate" as EventHandler,
  },

  // TODO: events
  // event NewUpdaterConfig(address _connext, uint32 _updaterDomain, address _updater)
  // event SplitUpdated(address _splitMain, address _split)

  // event SplitsDistributionUpdated(address _split, bytes32 _splitHash, uint32 _splitDistributorFee)

  // event UpdateMemberSeconds(address indexed _memberAddress, uint32 _secondsActive)
];

type ReplicaRegistryLog = {
  _chainId: string;
  _registryAddress: EthAddress;
  _domainId: string;
  _delegate: EthAddress;
};

type SyncActionSubmittedLog = {
  _transferId: string;
  _chainId: string;
  _action: string;
  _registryAddress: EthAddress;
};

const hasArgs = (obj: unknown): obj is { args: unknown } => {
  return typeof obj === "object" && obj !== null && "args" in obj;
};

const storeNetworkRegistry = async (
  _: string,
  networkRegistryLog: Log,
  publicClient: PublicClient,
  timestamp: BigInt
) => {
  if (!hasArgs(networkRegistryLog)) {
    console.error("Invalid log");
    return;
  }
  
  console.log('storeNetworkRegistry ==>', networkRegistryLog);

  const logArgs = networkRegistryLog.args;

  if (
    typeof logArgs === "object" &&
    logArgs !== null &&
    "_chainId" in logArgs &&
    "_registryAddress" in logArgs &&
    "_domainId" in logArgs &&
    "_delegate" in logArgs
  ) {
    const chainId = await publicClient.getChainId();
    const log = networkRegistryLog.args as ReplicaRegistryLog;
    const decodedReplica = {
      address: log._registryAddress,
      chainId: log._chainId,
      domainId: log._domainId,
      delegate: log._delegate,
    };
    const uid = decodedReplica.chainId + decodedReplica.address;

    try {
      console.log("Storing replica", decodedReplica);
      const id = await db.replicas
        .put(decodedReplica, uid);
        // TODO: use this to index registries on foreign networks
        // .then(async () => {
        //   if (chainId === 5 || chainId === 1) {
        //     await db.subscriptions.add({
        //       chainId,
        //       address: decodedReplica.address as `0x${string}`,
        //       event: parseAbiItem(
        //         "event GiveCookie(address indexed cookieMonster, uint256 amount, string _uid)"
        //       ),
        //       eventHandler: "StoreCookie", // TODO:
        //       fromBlock: networkRegistryLog.blockNumber!,
        //       lastBlock: networkRegistryLog.blockNumber!,
        //     });
        //   }
        // });
  
      console.log(`Stored replica ${decodedReplica} at ${id}`);
    } catch (e) {
      console.error("Failed to store replica", e);
    }
  }

};

const storeSyncAction = async (
  _: string,
  syncActionLog: Log,
  publicClient: PublicClient,
  timestamp: BigInt
) => {
  if (!hasArgs(syncActionLog)) {
    console.error("Invalid log");
    return;
  }

  console.log('storeSyncAction', syncActionLog);

  const logArgs = syncActionLog.args;

  if (
    typeof logArgs === "object" &&
    logArgs !== null &&
    "_transferId" in logArgs &&
    "_chainId" in logArgs &&
    "_action" in logArgs && 
    "_registryAddress" in logArgs
  ) {
    const chainId = await publicClient.getChainId();
    const log = syncActionLog.args as SyncActionSubmittedLog;
    const matchingFunction = NetworkRegistryDecodedAbi.find((item) => item.selector === log._action);
    const decodedSyncAction = {
      actionId: matchingFunction?.name || log._action,
      fromChainId: `0x${Number(chainId).toString(16)}`,
      toChainId: `0x${Number(log._chainId).toString(16)}`,
      replicaAddress: log._registryAddress,
      transferId: log._transferId,
      txHash: syncActionLog.transactionHash!,
      submitted: true,
      processed: false,
      timestamp,
    };

    const uid =
      decodedSyncAction.transferId + decodedSyncAction.replicaAddress;

    try {
      console.log("Storing syncAction", decodedSyncAction);
      const id = await db.syncActions
        .put(decodedSyncAction, uid);
  
      console.log(`Stored sync action at ${id}`);
    } catch (e) {
      console.error("Failed to store sync action", e);
    }
  }


};

const storeMember = async (
  eventName: string,
  memberLog: Log,
  publicClient: PublicClient,
  timestamp: BigInt
) => {
  if (!hasArgs(storeMember)) {
    console.error("Invalid log");
    return;
  }

  console.log('storeMember', storeMember);
};

const storeMemberUpdateActions = async (
  eventName: string,
  memberActionLog: Log,
  _: PublicClient,
  timestamp: BigInt
) => {
  if (!hasArgs(memberActionLog)) {
    console.error("Invalid log");
    return;
  }

  console.log('storeMemberUpdateActions', memberActionLog);

  const logArgs = memberActionLog.args;

  if (
    typeof logArgs === "object" &&
    logArgs !== null &&
    "_memberAddress" in logArgs &&
    "_startDate" in logArgs &&
    "_activityMultiplier" in logArgs
  ) {
    const decodedMemberAction = {
      action: eventName,
      memberAddress: logArgs._memberAddress as EthAddress,
      timestamp,
      txHash: memberActionLog.transactionHash as string,
    }
    const uid = decodedMemberAction.txHash + decodedMemberAction.action + decodedMemberAction.memberAddress;
    try {
      console.log("Storing memberAction", uid, decodedMemberAction);
      const id = await db.memberActions
        .put(decodedMemberAction, uid);
  
      console.log(`Stored member action at ${id}`);
    } catch (e) {
      console.error("Failed to store member action", e);
    }
  }
};

const storeRegistryUpdate = async (
  eventName: string,
  activityUpdateLog: Log,
  _: PublicClient,
  timestamp: BigInt
) => {
  if (!hasArgs(activityUpdateLog)) {
    console.error("Invalid log");
    return;
  }

  console.log('storeRegistryUpdate', activityUpdateLog);

  const logArgs = activityUpdateLog.args;

  if (
    typeof logArgs === "object" &&
    logArgs !== null &&
    "_timestamp" in logArgs &&
    "_totalMemberUpdates" in logArgs
  ) {
    const decodedActivityUpdate = {
      timestamp: BigInt(logArgs._timestamp as string),
      totalMembers: BigInt(logArgs._totalMemberUpdates as string),
      txHash: activityUpdateLog.transactionHash as string,
    };
    const uid = decodedActivityUpdate.txHash;
    try {
      console.log("Storing activityUpdate", decodedActivityUpdate);
      const id = await db.activityUpdates
        .put(decodedActivityUpdate, uid);
  
      console.log(`Stored activity update at ${id}`);
    } catch (e) {
      console.error("Failed to store activity update", e);
    }
  }
};

export const getEventHandler = (handler: EventHandler) => {
  switch (handler) {
    case "StoreNetworkRegistry":
      return storeNetworkRegistry;
    case "StoreMember":
      return storeMember;
    case "StoreSyncAction":
      return storeSyncAction;
    case "StoreMemberAction":
      return storeMemberUpdateActions;
    case "StoreRegistryUpdate":
      return storeRegistryUpdate;
    default:
      console.error(`No event handler found for ${handler}`);
      return undefined;
  }
};
