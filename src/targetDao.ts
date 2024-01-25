
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
      { // optimism goerli
        NETWORK_LOGO: "",
        NETWORK_NAME: "Optimism Goerli",
        NETWORK_ID: "0x1a4",
        DOMAIN_ID: "1735356532" // Connext domain id
      },
      { // arbitrum goerli
        NETWORK_LOGO: "",
        NETWORK_NAME: "Arbitrum Goerli",
        NETWORK_ID: "0x66eed",
        DOMAIN_ID: "1734439522"
      },
      { // polygon mumbai
        NETWORK_LOGO: "",
        NETWORK_NAME: "Polygon Mumbai",
        NETWORK_ID: "0x13881",
        DOMAIN_ID: "9991"
      },
    ],
    CONNEXT_ENV: "testnet",
    DAO_ADDRESS: "0xbfb34e1e13d68922cb86769f4abcdab9bd68e5ff",
    SAFE_ADDRESS: "0x7201030e136734e92560427b1346af2219d12074",
    CHAIN_ID: '0x5',
    REGISTRY_ADDRESS: "0x9eF64c547477b2263ed56821ce6Be79564824F44",
    SPLIT_ADDRESS: "0xe650e123237920d5f620579fb42670145361a0a9",
    DOMAIN_ID: "1735353714",
    NETWORK_LOGO: "",
    NETWORK_NAME: "Ethereum Goerli",
    START_BLOCK: BigInt(10426416), // block No where the main registry was deployed
    SHARES_TO_MINT: BigInt(100e18), // shares to mint to new members
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
