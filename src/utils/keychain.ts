import {
    arbitrum,
    mainnet,
    polygon,
    gnosis,
    goerli,
    optimism,
    polygonMumbai,
    Chain,
  } from 'wagmi/chains';
import { HAUS_RPC as RPC_DEFAULT } from "@daohaus/keychain-utils";

export type ValidNetwork =
  | "0x1"
  | "0x5"
  | "0x64"
  | "0xa"
  | "0x89"
  | "0xa4b1"
  | "0x1a4"
  | "0x66eed"
  | "0x13881";

export type AddressKeyChain = {
  "0x1"?: string;
  "0x5"?: string;
  "0x64"?: string;
  "0xa"?: string;
  "0x89"?: string;
  "0xa4b1"?: string;
  "0x1a4"?: string;
  "0x66eed"?: string;
  "0x13881"?: string;
};

export type Keychain<T = string> = { [key in ValidNetwork]?: T };

export const VIEM_CHAINS: Keychain<Chain> = {
  '0x1': mainnet,
  '0x5': goerli,
  '0x64': gnosis,
  '0x89': polygon,
  '0xa': optimism,
  '0xa4b1': arbitrum,
  '0x13881': polygonMumbai,
};

export const HAUS_RPC = {
    ...RPC_DEFAULT,
    "0x1": `https://787b6618b5a34070874c12d7157e6661.eth.rpc.rivet.cloud/`,
    "0x5": `https://787b6618b5a34070874c12d7157e6661.goerli.rpc.rivet.cloud/`,
    "0x64": "https://rpc.gnosischain.com/",
    "0xa": "https://mainnet.optimism.io",
    "0x89": "https://polygon-rpc.com/",
    "0xa4b1": "https://arb1.arbitrum.io/rpc",
    "0xa4ec": "https://forno.celo.org",
    "0x1a4": "https://goerli.optimism.io",
    "0x66eed": "https://rpc.goerli.arbitrum.gateway.fm",
    "0x13881": "https://rpc-mumbai.maticvigil.com",
};
