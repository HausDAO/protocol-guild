import { ethers } from "ethers";
import { ABI } from "@daohaus/utils";

import { HAUS_RPC } from "../pages/Home";
import { HttpTransport, http, PublicClient, createPublicClient } from "viem";

import {
  arbitrum,
  mainnet,
  polygon,
  gnosis,
  goerli,
  optimism,
  Chain,
} from 'wagmi/chains';

export type ValidNetwork =
  | "0x1"
  | "0x5"
  | "0x64"
  | "0xa"
  | "0x89"
  | "0xa4b1"
  | "0x1a4"
  | "0x66eed";
export type AddressKeyChain = {
  "0x1"?: string | undefined;
  "0x5"?: string | undefined;
  "0x64"?: string | undefined;
  "0xa"?: string | undefined;
  "0x89"?: string | undefined;
  "0xa4b1"?: string | undefined;
  "0x1a4"?: string | undefined;
  "0x66eed"?: string | undefined;
};
export type Keychain<T = string> = { [key in ValidNetwork]?: T };
export const VIEM_CHAINS: Keychain<Chain> = {
  '0x1': mainnet,
  '0x5': goerli,
  '0x64': gnosis,
  '0x89': polygon,
  '0xa': optimism,
  '0xa4b1': arbitrum,
};

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
