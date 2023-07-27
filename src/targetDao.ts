
import { EthAddress } from '@daohaus/utils';
import { ValidNetwork } from './utils/createContract';

export const TARGET_DAO: {
  [key: string]: {
    ADDRESS: string;
    SAFE_ADDRESS: string;
    CHAIN_ID: ValidNetwork;
  };
} = {
  "0xf6538c07324f59b3ba685d86393c65dce9676c70": {
    ADDRESS: "0xf6538c07324f59b3ba685d86393c65dce9676c70",
    SAFE_ADDRESS: "0xb64b12c4e68310fc222580dea1c86d202310f343",
    CHAIN_ID: "0x5",
  },
  "0xf844b98df9ccdfbe5d460d0d7bdca232cf9da923": {
    ADDRESS: "0xf844b98df9ccdfbe5d460d0d7bdca232cf9da923",
    SAFE_ADDRESS: "0xeb0dc703b854791914f30b5a73dd04d8d22a9aff",
    CHAIN_ID: "0x1",
  },
  "0x7839755b77aadcd6a8cdb76248b3dddfa9b7f5f1": {
    ADDRESS: "0x7839755b77aadcd6a8cdb76248b3dddfa9b7f5f1",
    SAFE_ADDRESS: "0xaccd85e73639b5213a001630eb2512dbd6292e32",
    CHAIN_ID: "0x5",
  },
};


export type REGISTRY = {
  NETWORK_LOGO: string;
  NETWORK_NAME: string;
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
  SUMMONER_ADDRESS: EthAddress;
  REGISTRY_ADDRESS: EthAddress;
  REGISTRY_SINGLETON_ADDRESS: EthAddress;
  SHAMAN_ADDRESS: EthAddress;
  SPLIT_ADDRESS: EthAddress;
  NETWORK_LOGO: string;  
  NETWORK_NAME: string;
}

export const TARGETS: TARGET = {
  REPLICA_CHAIN_ADDRESSES: [ // what are eligible for replica networks
    { // optimism goerli
      NETWORK_LOGO: "",
      NETWORK_NAME: "Optimism Goerli",
      NETWORK_ID: "0x1a4"
    },

    { // arbitrum goerli
      // SUMMONER_ADDRESS: "0xE8c26332C8Ecbc05a29e62E9c6bc3578EC82090f", // probably not needed
      // REGISTRY_ADDRESS: "0x2d917d2c05c133405362549BE2Bd8FbE3aF3E48e", // not needed if create 2 or get in hook
      // SHAMAN_ADDRESS: "0xB6a81F4E9cCF525A4C1474c3c41B4c04E29dC8B9", // not needed
      // SPLIT_ADDRESS: "", // get in hook
      NETWORK_LOGO: "",
      NETWORK_NAME: "Arbitrum Goerli",
      NETWORK_ID: "0x66eed"
    },
  ],
  DAO_ADDRESS: "0x719dfde5f1be59318cadb2ad60e1fd56ba7eaffa",
  SAFE_ADDRESS: "0xe79e5b67adc45460fa4b63f430a461ab82e5c8be",
  NETWORK_ID: '0x5',
  SUMMONER_ADDRESS: "0xd8453cEE3b86887829cd7622FDD39187DE8e8261",
  REGISTRY_ADDRESS: "0x2d917d2c05c133405362549BE2Bd8FbE3aF3E48e",  // update to deployed registry
  REGISTRY_SINGLETON_ADDRESS: "0x6A24DF62c9b1DE05442F59F2718ed2e6Ee6C3872",
  SHAMAN_ADDRESS: "0x5CE4aC4F49c43E42216f5F00503EF6c6EE672bFF",
  SPLIT_ADDRESS: "0x6c482189763877052C5C6982462C3756d7D51dc2",
  NETWORK_LOGO: "",
  NETWORK_NAME: "Ethereum Goerli"
};