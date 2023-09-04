
import { EthAddress } from '@daohaus/utils';
import { ValidNetwork } from './utils/keychain';


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
  REPLICA_CHAIN_ADDRESSES: REGISTRY[];
  DAO_ADDRESS: EthAddress;
  SAFE_ADDRESS: EthAddress;
  NETWORK_ID: ValidNetwork;
  REGISTRY_ADDRESS: EthAddress;
  SPLIT_ADDRESS: EthAddress;
  DOMAIN_ID: string;
  NETWORK_LOGO: string;  
  NETWORK_NAME: string;
}

export const TARGETS: TARGET = {
  REPLICA_CHAIN_ADDRESSES: [ // what are eligible replica networks
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
    {
      NETWORK_LOGO: "",
      NETWORK_NAME: "Polygon Mumbai",
      NETWORK_ID: "0x13881",
      DOMAIN_ID: "9991"
    },
  ],
  DAO_ADDRESS: "0x1df24e0463dd40dc5a6be8034e90cf434686c9a4",
  SAFE_ADDRESS: "0xf44803400e641abe86e1cfecfb82118800136d60",
  NETWORK_ID: '0x5',
  REGISTRY_ADDRESS: "0x0BcA4bfDe464Aec3F23b5E78647954952fdd6081",  // update to deployed registry
  SPLIT_ADDRESS: "0xE6bD75288bF450f2aB4F4EB3F44CAf0371AA8584", // update to deployed split
  DOMAIN_ID: "1735353714",
  NETWORK_LOGO: "",
  NETWORK_NAME: "Ethereum Goerli"
};
