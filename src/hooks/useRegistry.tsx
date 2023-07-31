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
    const totalembers = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "totalMembers",
      args: [],
    })) as number;
    const owner = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "owner",
      args: [],
    })) as string;
    const lastUpdate = (await client.readContract({
      abi: MemberRegistryAbi,
      address: registryAddress,
      functionName: "lastActivityUpdate",
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
    )) as [];
    const hydratedFr: REGISTRY[] = foreignRegistries.map((fr, idx) => {
      const obj = {
        NETWORK_ID: TARGETS.REPLICA_CHAIN_ADDRESSES[idx].NETWORK_ID,
        DOMAIN_ID: fr[0] as string,
        REGISTRY_ADDRESS: fr[1] as EthAddress,
        DELEGATE: fr[2] as EthAddress,
      }
      return obj;
  });


    for (let i = 0; i < hydratedFr.length; i++) {
      const registryData = hydratedFr[i];
      // if this is zero address, skip
      if (registryData.REGISTRY_ADDRESS == ZERO_ADDRESS) {
        hydratedFr[i] = Object.assign({}, registryData, {
          TOTAL_MEMBERS: "0",
          UPDATER: ZERO_ADDRESS,
          LAST_ACTIVITY_UPDATE: "0",
          SPLIT_ADDRESS: ZERO_ADDRESS,
        });
        continue;
      }
      if (!registryData.REGISTRY_ADDRESS) {
        continue;
      }


      
      const frClient = createViemClient({
        chainId: registryData.NETWORK_ID,
        rpcs,
      });

      const getters = [
        "totalMembers",
        "updater",
        "lastActivityUpdate",
        "split",
      ];
      const registryData2 = await Promise.all(
        getters.map(async (getter) => {
          return (await frClient.readContract({
            abi: MemberRegistryAbi,
            address: registryData.REGISTRY_ADDRESS as EthAddress,
            functionName: getter,
            args: [],
          }));
        })
      ) as string[];
      
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
          UPDATER: registryData2[1] as EthAddress,
          LAST_ACTIVITY_UPDATE: registryData2[2],
          SPLIT_ADDRESS: registryData2[3] as EthAddress,
        }
      );
    }


    return {
      members: members,
      owner: owner,
      lastUpdate: lastUpdate,
      totalMembers: totalembers,
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
