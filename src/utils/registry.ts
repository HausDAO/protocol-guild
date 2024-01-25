import { PublicClient } from "viem";
import { EthAddress, ZERO_ADDRESS } from "@daohaus/utils";

import { createViemClient } from "./createContract";
import { APP_ABIS } from "../legos/abis";
import { REGISTRY } from "../targetDao";
import { Member } from "../types/Member.types";
import { AddressKeyChain, ValidNetwork } from "../utils/keychain";

type FetchRegistryProps = {
  client: PublicClient;
  registryAddress: EthAddress;
  replicaChains?: Array<REGISTRY>;
}

export type ReplicaData = {
  NETWORK_ID: ValidNetwork;
  NETWORK_NAME?: string;
  DOMAIN_ID: string;
  REGISTRY_ADDRESS: EthAddress;
  DELEGATE: EthAddress;
  ACTIVE: boolean;
};

export type RegistryProperties = {
  lastActivityUpdate: number;
  owner: EthAddress;
  replicaRegistries: Array<ReplicaData>;
  splitAddress: EthAddress;
  totalMembers: number;
  updaterAddress: EthAddress;
};

export type RegistryData = {
  lastActivityUpdate: number;
  members: Array<Member>;
  membersSorted: Array<Member>;
  owner: EthAddress
  percAllocations: Array<unknown>;
  totalMembers: number;
  replicaRegistries: Array<REGISTRY>;
};

export type RegistryState = {
  pendingSplitControlTransfer?: boolean;
  splitSetupOk?: boolean;
  warningMsg: string;
};

export const fetchReplicaRegistries = async ({
  client,
  registryAddress,
  replicaChains,
}: FetchRegistryProps): Promise<Array<ReplicaData>> => {
  return Promise.all(
    replicaChains?.map(
      async (registry: REGISTRY) => {
        const replicaRegistry = await client.readContract({
          abi: APP_ABIS.NETWORK_REGISTRY,
          address: registryAddress,
          functionName: "replicaRegistry",
          args: [registry.NETWORK_ID],
        }) as Array<any>;
        const replicaAddress = replicaRegistry[1] as EthAddress;
        const hydratedRegistryData = {
          NETWORK_ID: registry.NETWORK_ID,
          NETWORK_NAME: registry.NETWORK_NAME,
          DOMAIN_ID: replicaRegistry[0] as string,
          REGISTRY_ADDRESS: replicaAddress,
          DELEGATE: replicaRegistry[2] as EthAddress,
        };
        const replicaState = await checkRegistryState({ hydratedRegistryData });
        return {
          ...hydratedRegistryData,
          ACTIVE: !replicaState.warningMsg
        };
      }
    ) || []
  );
};

export const fetchRegistryProperties = async ({
  client,
  registryAddress,
  replicaChains,
}: FetchRegistryProps): Promise<RegistryProperties> => {
  const getters = [
    "isMainRegistry",
    "lastActivityUpdate",
    "owner",
    "split",
    "totalMembers",
    "updater",
  ];
  const [
    isMainRegistry,
    lastActivityUpdate,
    owner,
    splitAddress,
    totalMembers,
    updaterAddress,
  ] = await Promise.all(
    getters.map(async (functionName) => (
      await client.readContract({
        abi: APP_ABIS.NETWORK_REGISTRY,
        address: registryAddress,
        functionName,
        args: [],
      })
    ))
  );
  const replicaRegistries = (isMainRegistry as boolean)
    ? await fetchReplicaRegistries({ client, registryAddress, replicaChains })
    : [];

  return {
    lastActivityUpdate: lastActivityUpdate as number,
    owner: owner as EthAddress,
    replicaRegistries,
    splitAddress: splitAddress as EthAddress,
    totalMembers: totalMembers as number,
    updaterAddress: updaterAddress as EthAddress,
  };
};

export const fetchRegistryMembers = async ({
  registryAddress,
  client,
}: FetchRegistryProps) => {
  // TODO: getMembersPaginated(fromIndex, toIndex)
  const members = (await client.readContract({
    abi: APP_ABIS.NETWORK_REGISTRY,
    address: registryAddress,
    functionName: "getMembers",
    args: [],
  })) as Member[];

  const membersSorted: Member[] = members
    .sort((a: Member, b: Member) =>
      a.account.toLowerCase() > b.account.toLowerCase() ? 1 : -1
    );
  
  const percAllocations = membersSorted.length
    ? ((await client.readContract({
        abi: APP_ABIS.NETWORK_REGISTRY,
        address: registryAddress,
        functionName: "calculate",
        args: [membersSorted.map((m) => m.account)],
      })) as [])
    : [];

  membersSorted.forEach((m, idx) => {
    // 10000 is the multiplier for the contract
    m.percAlloc = percAllocations[1][idx]/10000; // TODO? isn't 1e6?
  });

  return {
    members: membersSorted,
    percAllocations,
  };
};

export const fetchRegistryData = async ({
  registryAddress,
  replicaChains,
  chainId,
  rpcs,
}: {
  registryAddress?: EthAddress;
  replicaChains?: Array<REGISTRY>;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}): Promise<RegistryData | undefined> => {
  if (!registryAddress || !replicaChains) return;

  const client = createViemClient({
    chainId,
    rpcs,
  });

  try {
    // pull home chain data from contract
    const {
      lastActivityUpdate,
      owner,
      replicaRegistries,
      totalMembers,
    } = await fetchRegistryProperties({ client, registryAddress, replicaChains });

    const {
      members,
      percAllocations,
    } = await fetchRegistryMembers({ client, registryAddress });

    const hidratedReplicaRegistries = replicaRegistries?.length ? await Promise.all(
      replicaRegistries.map(async (replica) => {
        if (replica.REGISTRY_ADDRESS === ZERO_ADDRESS) {
          return Object.assign({}, replica, {
            TOTAL_MEMBERS: "0",
            UPDATER: ZERO_ADDRESS as EthAddress,
            LAST_ACTIVITY_UPDATE: "0",
            SPLIT_ADDRESS: ZERO_ADDRESS as EthAddress,
          });
        }
        const frClient = createViemClient({
          chainId: replica.NETWORK_ID,
          rpcs,
        });

        const {
          lastActivityUpdate,
          splitAddress,
          totalMembers,
          updaterAddress,
        } = await fetchRegistryProperties({
          client: frClient,
          registryAddress: replica.REGISTRY_ADDRESS,
        });

        return Object.assign({}, replica, {
          TOTAL_MEMBERS: totalMembers.toString(),
          UPDATER: updaterAddress,
          LAST_ACTIVITY_UPDATE: lastActivityUpdate.toString(),
          SPLIT_ADDRESS: splitAddress,
        });
      })
    ) : [];

    return {
      lastActivityUpdate,
      members,
      membersSorted: members,
      owner,
      percAllocations,
      totalMembers: totalMembers,
      replicaRegistries: hidratedReplicaRegistries as Array<REGISTRY>,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const checkRegistryState = async ({
  hydratedRegistryData,
}: {
  hydratedRegistryData: REGISTRY,
}): Promise<RegistryState> => {
  if (!hydratedRegistryData.REGISTRY_ADDRESS || hydratedRegistryData.REGISTRY_ADDRESS === ZERO_ADDRESS) {
    return {
      warningMsg: "Not registered",
    };
  }

  const client = createViemClient({ chainId: hydratedRegistryData.NETWORK_ID });

  const splitMainAddress = hydratedRegistryData.REGISTRY_ADDRESS && (await client.readContract({
    abi: APP_ABIS.NETWORK_REGISTRY,
    address: hydratedRegistryData.REGISTRY_ADDRESS,
    functionName: "splitMain",
  }) as EthAddress);

  const splitAddress = hydratedRegistryData.SPLIT_ADDRESS || (await client.readContract({
    abi: APP_ABIS.NETWORK_REGISTRY,
    address: hydratedRegistryData.REGISTRY_ADDRESS,
    functionName: "split",
  }) as EthAddress);

  const controllerAddress = splitMainAddress && (await client.readContract({
    abi: APP_ABIS.ISPLIT_MAIN,
    address: splitMainAddress,
    functionName: "getController",
    args: [splitAddress]
  }) as EthAddress);

  const newPotentialControllerAddress = splitMainAddress && (await client.readContract({
    abi: APP_ABIS.ISPLIT_MAIN,
    address: splitMainAddress,
    functionName: "getNewPotentialController",
    args: [splitAddress]
  }) as EthAddress);

  let warningMsg = "";
  const registryAddress = hydratedRegistryData.REGISTRY_ADDRESS?.toLocaleLowerCase();

  const splitSetupOk =
    controllerAddress?.toLocaleLowerCase() === registryAddress;
  
  const pendingSplitControlTransfer =
    newPotentialControllerAddress?.toLocaleLowerCase() === registryAddress;
  
  if (!splitSetupOk) warningMsg = "Pending 0xSplit control";
  if (!splitSetupOk && !pendingSplitControlTransfer) warningMsg = "Does not own 0xSplit";

  return {
    pendingSplitControlTransfer,
    splitSetupOk,
    warningMsg,
  };
};
