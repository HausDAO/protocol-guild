import React from "react";

import { AddressDisplay, ParLg, SingleColumnLayout } from "@daohaus/ui";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "./Home";
import { useMemberRegistry } from "../hooks/useRegistry";
import { AddressKeyChain, ValidNetwork } from "../utils/createContract";
import { Keychain } from "@daohaus/keychain-utils";

export const ControllerConfig = () => {
  const daochain = TARGETS.NETWORK_ID as ValidNetwork;
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  if (isLoading) return <ParLg>Loading...</ParLg>;

  return (
    <SingleColumnLayout title="0xSplits Controller">
      <ParLg>
        Owner:{" "}
        {data?.owner.toLowerCase() == TARGETS.SAFE_ADDRESS.toLowerCase() &&
          "DAO"}
      </ParLg>
      <AddressDisplay
        address={data?.owner as string}
        truncate
        copy
        explorerNetworkId={daochain as keyof Keychain}
      />
      <ParLg>TODO: Transfer Control</ParLg>
      <ParLg>TODO: Cancel transfer</ParLg>
      <ParLg>TODO: manage control on foreignRegistries</ParLg>

      <FormBuilder
        form={APP_FORM.ACCEPT_CONTROLL}
        targetNetwork={TARGETS.NETWORK_ID}
      />
    </SingleColumnLayout>
  );
};
