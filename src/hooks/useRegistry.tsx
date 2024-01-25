import { useDebugValue } from "react";
import { useQuery } from "react-query";

import { EthAddress } from "@daohaus/utils";

import { REGISTRY } from "../targetDao";
import { AddressKeyChain, ValidNetwork } from "../utils/keychain";
import { fetchRegistryData } from "../utils/registry";

export const useNetworkRegistry = ({
  registryAddress,
  replicaChains,
  chainId,
  rpcs,
}: {
  registryAddress?: EthAddress;
  replicaChains?: Array<REGISTRY>;
  chainId: ValidNetwork;
  rpcs?: AddressKeyChain;
}) => {
  const { data, error, ...statusProps } = useQuery(
    ["networkRegistryData", { registryAddress }],
    () =>
      fetchRegistryData({
        registryAddress,
        replicaChains,
        chainId,
        rpcs,
      }),
    { enabled: !!registryAddress }
  );

  useDebugValue(data ?? "Loading");

  return { data, error, ...statusProps };
};
