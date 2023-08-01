import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { EthAddress, fromWei } from "@daohaus/utils";

import { create, SdkConfig } from "@connext/sdk";
import { TARGETS } from "../targetDao";

const sdkConfig: SdkConfig = {
  signerAddress: TARGETS.DAO_ADDRESS,
  // Use `mainnet` when you're ready...
  network: "testnet",
  // Add more chains here! Use mainnet domains if `network: mainnet`.
  // This information can be found at https://docs.connext.network/resources/supported-chains
  chains: {
    1735353714: {
      // Goerli domain ID
      providers: ["https://rpc.ankr.com/eth_goerli"],
    },
    1735356532: {
      // Optimism-Goerli domain ID
      providers: ["https://goerli.optimism.io"],
    },
  },
};

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
