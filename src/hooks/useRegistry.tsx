import { useDebugValue } from "react";
import { useQuery } from "react-query";

import MemberRegistryAbi from "../abis/memberRegistry.json";

import { Member } from "../types/Member.types";
import { EthAddress, ZERO_ADDRESS } from "@daohaus/utils";
import { REGISTRY, TARGETS } from "../targetDao";
import {
  AddressKeyChain,
  ValidNetwork,
  createViemClient,
} from "../utils/createContract";

type FrFetchShape = {
  domainId: string;
  registryAddress: EthAddress;
  delegate: EthAddress;
};

const fetchMembers = async ({
  registryAddress,
  chainId,
  rpcs,
}: {
  registryAddress: EthAddress;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}) => {

  const client = createViemClient({
    chainId,
    rpcs,
  });

  try {
    const members = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "getMembers",
      args: [],
    })) as Member[];
    const owner = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "owner",
      args: [],
    })) as string;
    const lastUpdate = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "owner",
      args: [],
    })) as number;
    const membersSorted: String[] = members
      .map((member: any) => member.account)
      .sort((a: string, b: string) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1
      );
    const percAlloc = membersSorted.length
      ? ((await client.readContract({
          abi: MemberRegistryAbi,
          address: registryAddress,
          functionName: "calculate",
          args: [membersSorted],
        })) as [])
      : [];

    const regPromises = TARGETS.REPLICA_CHAIN_ADDRESSES.map(
      async (registry) => {

        return await client.readContract({
          abi: MemberRegistryAbi,
          address: TARGETS.REGISTRY_ADDRESS || ZERO_ADDRESS,
          functionName: "networkRegistry",
          args: [registry.NETWORK_ID],
        });

      }
    );
    const foreignRegistries = (await Promise.all(
      regPromises
    )) as FrFetchShape[];
    const hydratedFr = foreignRegistries.map((fr, idx) => ({
      NETWORK_ID: TARGETS.REPLICA_CHAIN_ADDRESSES[idx].NETWORK_ID,
      DOMAIN_ID: fr.domainId,
      REGISTRY_ADDRESS: fr.registryAddress,
      DELEGATE: fr.delegate,
    }));

    console.log("hydratedFr 1", hydratedFr);

    for (let i = 0; i < hydratedFr.length; i++) {
      const registryData = hydratedFr[i];
      if (registryData.REGISTRY_ADDRESS == ZERO_ADDRESS) {
        hydratedFr[i] = Object.assign({}, registryData, {
          TOTAL_MEMBERS: "0",
          UPDATER: ZERO_ADDRESS,
          LAST_ACTIVITY_UPDATE: "0",
          SPLIT_ADDRESS: ZERO_ADDRESS,
        });
        continue;
      }

      const getters = [
        "totalMembers",
        "updater",
        "lastActivityUpdate",
        "split",
      ];
      const registryData2 = await Promise.all(
        getters.map(async (getter) => {
          return (await client.readContract({
            abi: MemberRegistryAbi,
            address: registryAddress,
            functionName: getter,
            args: [],
          })) as Member[];
        })
      );
      hydratedFr[i] = Object.assign(
        {},
        {
          NETWORK_ID: registryData.NETWORK_ID,
          DOMAIN_ID: registryData.DOMAIN_ID,
          REGISTRY_ADDRESS: registryData.REGISTRY_ADDRESS,
          DELEGATE: registryData.DELEGATE,
        },
        {
          TOTAL_MEMBERS: registryData2[0],
          UPDATER: registryData2[1],
          LAST_ACTIVITY_UPDATE: registryData2[2],
          SPLIT_ADDRESS: registryData2[3],
        }
      );
    }

    console.log("hydratedFr 2", hydratedFr);

    return {
      members: members,
      owner: owner,
      lastUpdate: 0, // lastUpdate,
      membersSorted: membersSorted,
      percAlloc: percAlloc,
      foreignRegistries: hydratedFr as REGISTRY[],
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useMemberRegistry = ({
  registryAddress,
  chainId,
  rpcs,
}: {
  registryAddress: EthAddress;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}) => {
  const { data, ...rest } = useQuery(
    ["memberData", { registryAddress }],
    () =>
      fetchMembers({
        registryAddress,
        chainId,
        rpcs,
      }),
    { enabled: !!registryAddress }
  );

  useDebugValue(data ?? "Loading");

  return { data, ...rest };
};
