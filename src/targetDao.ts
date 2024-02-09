
import { EthAddress } from '@daohaus/utils';
import { ValidNetwork } from './utils/keychain';

export type ConnextEnv = "testnet" | "mainnet";

export type REGISTRY = {
  NETWORK_LOGO?: string;
  NETWORK_NAME?: string;
  NETWORK_ID: ValidNetwork; // Network Chain ID
  DOMAIN_ID?: string; // Connext Network Domain ID 
  REGISTRY_ADDRESS?: EthAddress; // NetworkRegistry
  DELEGATE?: EthAddress;
  TOTAL_MEMBERS?: string;
  UPDATER?: EthAddress;
  LAST_ACTIVITY_UPDATE?: string;
  SPLIT_ADDRESS?: EthAddress; // 0xSplit
};

export type TARGET = {
  REPLICA_CHAINS: REGISTRY[];
  DAO_ADDRESS: EthAddress;
  SAFE_ADDRESS: EthAddress;
  CHAIN_ID: ValidNetwork;
  REGISTRY_ADDRESS: EthAddress;
  SPLIT_ADDRESS: EthAddress;
  DOMAIN_ID: string;
  NETWORK_LOGO: string;  
  NETWORK_NAME: string;
  START_BLOCK: bigint;
  CONNEXT_ENV: ConnextEnv;
  SHARES_TO_MINT: bigint;
}

export const TARGETS: {
  [key: string]: TARGET
 } = {
  "TEST": {
    REPLICA_CHAINS: [ // what are eligible replica networks
      { // optimism sepolia
        NETWORK_LOGO: "",
        NETWORK_NAME: "Optimism Sepolia",
        NETWORK_ID: "0xaa37dc",
        DOMAIN_ID: "0", // TODO:
      },
      { // arbitrum goerli
        NETWORK_LOGO: "",
        NETWORK_NAME: "Arbitrum Sepolia",
        NETWORK_ID: "0x66eee",
        DOMAIN_ID: "0", // TODO:
      },
    ],
    CONNEXT_ENV: "testnet",
    DAO_ADDRESS: "0x832ec97051ed6a1abdbafa74dace307af59b1ef3",
    SAFE_ADDRESS: "0x79c740401f76b8a7b26baf3e522571add38362d0",
    CHAIN_ID: '0xaa36a7',
    REGISTRY_ADDRESS: "0x7A69DbBFF504FAB98ADe857992BC6d1Ae94Ba0d0",
    SPLIT_ADDRESS: "0xccc8922d223f5bb2e623bf100970913ac85fd17d",
    DOMAIN_ID: "0", // TODO:
    NETWORK_LOGO: "",
    NETWORK_NAME: "Ethereum Sepolia",
    START_BLOCK: BigInt(5249508), // block No where the main registry was deployed
    SHARES_TO_MINT: BigInt(1e18), // shares to mint to new members
  },
  "PRODUCTION": {
    REPLICA_CHAINS: [ // what are eligible replica networks
    ],
    CONNEXT_ENV: "mainnet",
    DAO_ADDRESS: "0x",
    SAFE_ADDRESS: "0x",
    CHAIN_ID: '0x1',
    REGISTRY_ADDRESS: "0x",
    SPLIT_ADDRESS: "0x",
    DOMAIN_ID: "6648936",
    NETWORK_LOGO: "",
    NETWORK_NAME: "Ethereum",
    START_BLOCK: BigInt(0), // block No where the main registry was deployed
    SHARES_TO_MINT: BigInt(100e18), // shares to mint to new members
  },
};
