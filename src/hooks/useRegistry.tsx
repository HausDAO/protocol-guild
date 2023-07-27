import { useDebugValue } from "react";
import { useQuery } from "react-query";

import MemberRegistryAbi from "../abis/memberRegistry.json";

import { Member } from "../types/Member.types";
import { EthAddress, ZERO_ADDRESS } from "@daohaus/utils";
import { REGISTRY, TARGETS } from "../targetDao";
import { AddressKeyChain, ValidNetwork, createContract } from "../utils/createContract";

const fetchMembers = async ({
  registryAddress,
  chainId,
  rpcs,
}: {
  registryAddress: string;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}) => {
  const MemberRegistryContract = createContract({
    address: registryAddress,
    abi: MemberRegistryAbi,
    chainId,
    rpcs,
  });

  try {
    const members: Member[] = await MemberRegistryContract.getMembers();

    const lastUpdate: number =
      await MemberRegistryContract.lastActivityUpdate();

    const membersSorted: String[] = members
      .map((member: any) => member.account)
      .sort((a: string, b: string) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1
      );

    console.log("membersSorted", membersSorted);

    const percAlloc: any[] = await MemberRegistryContract.calculate(
      membersSorted
    );

    console.log("percAlloc", percAlloc);

    const regPromises = TARGETS.REPLICA_CHAIN_ADDRESSES.map(
      async (registry) => {
        return await MemberRegistryContract.networkRegistry(
          registry.NETWORK_ID
        );
      }
    );
    const foreignRegistries = await Promise.all(regPromises);
    const hydratedFr = foreignRegistries.map((fr, idx) =>
      Object.assign({}, fr, {
        networkId: TARGETS.REPLICA_CHAIN_ADDRESSES[idx].NETWORK_ID,
      })
    );

    console.log("hydratedFr", hydratedFr);

    for (let i = 0; i < hydratedFr.length; i++) {
      const registryData = hydratedFr[i];
      if (registryData.registryAddress == ZERO_ADDRESS) {
        hydratedFr[i] = Object.assign({}, registryData, {
          TOTAL_MEMBERS: "0",
          UPDATER: ZERO_ADDRESS,
          LAST_ACTIVITY_UPDATE: "0",
          SPLIT_ADDRESS: ZERO_ADDRESS,
        });
        continue;
      };
      const ForeignMemberRegistryContract = createContract({
        address: registryData.registryAddress,
        abi: MemberRegistryAbi,
        chainId: registryData.networkId,
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
          return await ForeignMemberRegistryContract[getter]();
        })
      );
      hydratedFr[i] = Object.assign({}, {
        NETWORK_ID: registryData.networkId,
        DOMAIN_ID: registryData.domainId,
        REGISTRY_ADDRESS: registryData.registryAddress,
        DELEGATE: registryData.delegate,
      }, {
        TOTAL_MEMBERS: registryData2[0],
        UPDATER: registryData2[1],
        LAST_ACTIVITY_UPDATE: registryData2[2],
        SPLIT_ADDRESS: registryData2[3],
      });
    }

    console.log("hydratedFr", hydratedFr);

    return {
      members: members,
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
  registryAddress: string;
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
