import { ethers } from 'ethers';
import { ABI } from '@daohaus/utils';
import { HAUS_RPC } from '../pages/Home';

export type ValidNetwork = "0x1" | "0x5" | "0x64" | "0xa" | "0x89" | "0xa4b1" | "0x1a4" | "0x66eed";
export type AddressKeyChain = {
    "0x1"?: string | undefined;
    "0x5"?: string | undefined;
    "0x64"?: string | undefined;
    "0xa"?: string | undefined;
    "0x89"?: string | undefined;
    "0xa4b1"?: string | undefined;
    "0x1a4"?: string | undefined;
    "0x66eed"?: string | undefined;
}

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