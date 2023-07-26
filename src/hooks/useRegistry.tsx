import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { createContract } from "@daohaus/tx-builder";
import { ValidNetwork, Keychain } from "@daohaus/keychain-utils";

import MemberRegistryAbi from "../abis/memberRegistry.json";

import { Member } from "../types/Member.types";

const fetchMembers = async ({
  registryAddress,
  chainId,
  rpcs,
}: {
  registryAddress: string;
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

    console.log(await MemberRegistryContract.lastActivityUpdate());

    const lastUpdate: number =
      await MemberRegistryContract.lastActivityUpdate();

    const membersSorted: String[] = members
      .map((member: any) => member.account)
      .sort((a: string, b: string) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1
      );

    const percAlloc: any[] = await MemberRegistryContract.calculate(
      membersSorted
    );


    return {
      members: members,
      lastUpdate: 0, // lastUpdate,
      membersSorted: membersSorted,
      percAlloc: percAlloc,
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
  rpcs?: Keychain;
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
