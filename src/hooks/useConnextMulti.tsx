import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { EthAddress, fromWei } from "@daohaus/utils";

import { create, SdkConfig } from "@connext/sdk";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "@daohaus/keychain-utils";

const fetch = async ({
  originDomain,
  destinationDomains,
  chainID,
}: {
  originDomain: string;
  destinationDomains: string[];
  chainID: string;
}) => {
  const sdkConfig: SdkConfig = {
    signerAddress: TARGETS.DAO_ADDRESS,
    // Use `mainnet` when you're ready...
    network: "testnet",
    // Add more chains here! Use mainnet domains if `network: mainnet`.
    // This information can be found at https://docs.connext.network/resources/supported-chains
    chains: {
      [originDomain]: {
        providers: [HAUS_RPC[TARGETS.NETWORK_ID as keyof typeof HAUS_RPC]],
      },
    },
  };

  for (const destinationDomain of destinationDomains) {
    sdkConfig.chains[destinationDomain] = {
      providers: [HAUS_RPC[chainID as keyof typeof HAUS_RPC]],
    };
  }

  const relayerFeesWei: string[] = [];
  const relayerFees: string[] = [];

  try {
    const { sdkBase } = await create(sdkConfig);
    console.log("sdkBase: ", sdkBase);
    for (const destinationDomain of destinationDomains) {
      const rFee = await sdkBase.estimateRelayerFee({
        originDomain: originDomain,
        destinationDomain: destinationDomain,
      });
      console.log("relayerFee: ", fromWei(rFee.toString()));
      relayerFeesWei.push(rFee.toString());
      relayerFees.push(fromWei(rFee.toString()));
    }

    return {
      relayerFeesWei,
      relayerFees,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useConnextMulti = ({
  originDomain,
  destinationDomains,
  chainID,
}: {
  originDomain: string;
  destinationDomains: string[];
  chainID: string;
}) => {
  const { data, ...rest } = useQuery(
    ["connextDataMulti", { chainID, destinationDomains }],
    () =>
      fetch({
        originDomain,
        destinationDomains,
        chainID,
      }),
    { enabled: !!destinationDomains }
  );

  useDebugValue(data ?? "Loading");

  return { data, ...rest };
};
