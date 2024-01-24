import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { create, SdkConfig } from "@connext/sdk";
import { HAUS_RPC } from "@daohaus/keychain-utils";
import { EthAddress, fromWei } from "@daohaus/utils";

import { createViemClient } from "../utils/createContract";
import { ValidNetwork } from "../utils/keychain";
import { ConnextEnv } from "../targetDao";

const fetchRelayFee = async ({
  network,
  destinationChainIds,
  destinationDomains,
  originChainId,
  originDomain,
  signerAddress,
}: {
  network: ConnextEnv;
  destinationChainIds: Array<string>;
  destinationDomains: Array<string>;
  originChainId: string;
  originDomain: string;
  signerAddress: EthAddress;
}) => {
  const destinationsConfig = Array
    .apply(null, Array(destinationChainIds.length))
    .map((_, idx) =>
      Object.fromEntries([
        ['destinationChainId', destinationChainIds[idx]],
        ['destinationDomain', destinationDomains[idx]],
      ])
    ) as Array<{ destinationChainId: string; destinationDomain: string }>;

  const sdkConfig: SdkConfig = {
    signerAddress,
    // Use `mainnet` when you're ready...
    network,
    // Add more chains here! Use mainnet domains if `network: mainnet`.
    // This information can be found at https://docs.connext.network/resources/supported-chains
    chains: {
      [originDomain]: {
        providers: [HAUS_RPC[originChainId as keyof typeof HAUS_RPC]],
      },
    },
  };

  for (const { destinationChainId, destinationDomain } of destinationsConfig) {
    sdkConfig.chains[destinationDomain] = {
      providers: [HAUS_RPC[destinationChainId as keyof typeof HAUS_RPC]],
    };
  }

  try {
    const { sdkBase } = await create(sdkConfig);

    const relayerFees = await Promise.all(
      destinationsConfig.map(async ({ destinationDomain }) => {
        return await sdkBase.estimateRelayerFee({
          originDomain: originDomain,
          destinationDomain: destinationDomain,
        });
      }),
    );
    const relayerFeeWei = relayerFees.reduce((acc, val) => acc + val.toBigInt(), BigInt(0));
    const relayerFee = fromWei(relayerFeeWei.toString());

    const client = createViemClient({
      chainId: originChainId as ValidNetwork,
      rpcs: HAUS_RPC
    });
    const signerCurrentBalance = await client.getBalance({ address: signerAddress });

    return {
      feesPerDestination: relayerFees,
      relayerFeeWei,
      relayerFee,
      signerHasBalance: signerCurrentBalance >= relayerFeeWei,
      signerBalanceWei: signerCurrentBalance,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useConnext = ({
  network,
  destinationChainIds,
  destinationDomains,
  originChainId,
  originDomain,
  signerAddress,
}: {
  network: ConnextEnv;
  destinationChainIds: Array<string>;
  destinationDomains: Array<string>;
  originChainId: string;
  originDomain: string;
  signerAddress: EthAddress;
}) => {
  const { data, ...rest } = useQuery(
    ["connextData", { destinationChainIds, destinationDomains }],
    () =>
      fetchRelayFee({
        network,
        destinationChainIds,
        destinationDomains,
        originChainId,
        originDomain,
        signerAddress,
      }),
    { enabled: destinationChainIds.length === destinationDomains.length }
  );

  useDebugValue(data ?? "Loading");

  return { data, ...rest };
};
