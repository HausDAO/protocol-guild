import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { createContract } from "@daohaus/tx-builder";
import { ValidNetwork, Keychain, HAUS_RPC } from "@daohaus/keychain-utils";
import { nowInSeconds } from "@daohaus/utils";

import MemberRegistryAbi from "../abis/memberRegistry.json";

import { Member } from "../types/Member.types";

const fetchMembers = async ({
  registryAddress,
  userAddress,
  chainId,
  rpcs,
}: {
  registryAddress: string;
  userAddress: string;
  chainId: ValidNetwork;
  rpcs?: Keychain;
}) => {
  const MemberRegistryContract = createContract({
    address: registryAddress,
    abi: MemberRegistryAbi,
    chainId,
    rpcs,
  });

  try {
    const members: Member[] = await MemberRegistryContract.getMembers();
    const lastUpdate: number = await MemberRegistryContract.lastUpdate();


    return {
      members: members,
      lastUpdate: lastUpdate,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useMemberRegistry = ({
  registryAddress,
  userAddress,
  chainId,
  rpcs,
}: {
  registryAddress: string;
  userAddress: string | undefined | null;
  chainId: ValidNetwork;
  rpcs?: Keychain;
}) => {
  const { data, ...rest } = useQuery(
    ["memberData", { userAddress }],
    () =>
      fetchMembers({
        registryAddress,
        userAddress: userAddress as string,
        chainId,
        rpcs,
      }),
    { enabled: !!userAddress }
  );
  useDebugValue(data ?? "Loading");

  return { data, ...rest };
};
