import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { EthAddress, fromWei } from "@daohaus/utils";

import { create, SdkConfig } from "@connext/sdk";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "@daohaus/keychain-utils";



const fetch = async ({
  originDomain,
  destinationDomain,
  chainID,
}: {
  originDomain: string;
  destinationDomain: string;
  chainID: string;
}) => {
  const params = {
    originDomain: originDomain,
    destinationDomain: destinationDomain,
  };

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
      [destinationDomain]: {
        providers: [HAUS_RPC[chainID as keyof typeof HAUS_RPC]],
      },
    },
  };

  try {
    const { sdkBase } = await create(sdkConfig);
    console.log("sdkBase: ", sdkBase);
    const rFee = await sdkBase.estimateRelayerFee(params);
    console.log("relayerFee: ", fromWei(rFee.toString()));

    return {
      relayerFeeWei: rFee.toString() || "0",
      relayerFee: fromWei(rFee.toString() || "0") ,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useConnext = ({
  originDomain,
  destinationDomain,
  chainID,
}: {
  originDomain: string;
  destinationDomain: string;
  chainID: string;
}) => {
  const { data, ...rest } = useQuery(
    ["connextData", { chainID, destinationDomain }],
    () =>
      fetch({
        originDomain,
        destinationDomain,
        chainID,
      }),
    { enabled: !!destinationDomain }
  );

  useDebugValue(data ?? "Loading");

  return { data, ...rest };
};
