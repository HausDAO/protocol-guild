
import { EthAddress } from '@daohaus/utils';
import { ValidNetwork } from './utils/createContract';


export type REGISTRY = {
  NETWORK_LOGO?: string;
  NETWORK_NAME?: string;
  NETWORK_ID: ValidNetwork;
  DOMAIN_ID?: string;
  REGISTRY_ADDRESS?: EthAddress;
  DELEGATE?: EthAddress;
  TOTAL_MEMBERS?: string;
  UPDATER?: EthAddress;
  LAST_ACTIVITY_UPDATE?: string;
  SPLIT_ADDRESS?: EthAddress;
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
  ],
  DAO_ADDRESS: "0xab50312a200abdb70b0e89895fb8f22446f48c6c",
  SAFE_ADDRESS: "0x4a75aca9f92a92e2638d98d2fee2d2ddcef3f358",
  NETWORK_ID: '0x5',
  REGISTRY_ADDRESS: "0x4d4481D75Cd1d86A60f73da4085608f74370e5F5",  // update to deployed registry
  SPLIT_ADDRESS: "0xe66FdFBB8E942071C24Edb32EF3A5F1eE95B655d", // update to deployed split
  DOMAIN_ID: "1735353714",
  NETWORK_LOGO: "",
  NETWORK_NAME: "Ethereum Goerli"
};
