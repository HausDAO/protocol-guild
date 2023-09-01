import { ethers } from "ethers";
import { HttpTransport, http, PublicClient, createPublicClient } from "viem";
import { ABI } from "@daohaus/utils";

import { AddressKeyChain, HAUS_RPC, ValidNetwork, VIEM_CHAINS } from "./keychain";

export const createContract = ({
  address,
  abi,
  chainId,
  rpcs = HAUS_RPC,
}: {
  address: string;
  abi: ABI;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}) => {
  const rpcUrl = rpcs[chainId];
  const ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(address, abi, ethersProvider);
};

//**************** viem *********** */

export const createTransport = ({
  chainId,
  rpcs = HAUS_RPC,
}: {
  chainId: ValidNetwork;
  rpcs: AddressKeyChain;
}): HttpTransport => {
  const rpc = rpcs[chainId];
  if (!rpc) return http();
  return http(rpc);
};

export const createViemClient = ({
  chainId,
  rpcs = HAUS_RPC,
}: {
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}): PublicClient => {
  const transport = createTransport({ chainId, rpcs });
  return createPublicClient({
    chain: VIEM_CHAINS[chainId],
    transport,
  });
};
