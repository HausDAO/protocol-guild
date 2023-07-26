import React, { useEffect } from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

import { create, SdkConfig } from "@connext/sdk";
import { fromWei } from "@daohaus/utils";

const sdkConfig: SdkConfig = {
  signerAddress: "0x2b8aA42fFb2c9c7B9f0B1e1b935F7D8331b6dC7c",
  // Use `mainnet` when you're ready...
  network: "testnet",
  // Add more chains here! Use mainnet domains if `network: mainnet`.
  // This information can be found at https://docs.connext.network/resources/supported-chains
  chains: {
    1735353714: { // Goerli domain ID
      providers: ["https://rpc.ankr.com/eth_goerli"],
    },
    1735356532: { // Optimism-Goerli domain ID
      providers: ["https://goerli.optimism.io"],
    },
  },
};

export const ReplicaConfig = () => {

  const [relayerFee, setRelayerFee] = React.useState("1");

  const params = {
    originDomain: "1735353714",
    destinationDomain: "1735356532",
  }

  useEffect(() => {
    const run = async () => {
      const { sdkBase } = await create(sdkConfig);
      console.log('sdkBase: ', sdkBase);
      const rFee = await sdkBase.estimateRelayerFee(params);
      console.log('relayerFee: ', fromWei(rFee.toString()));
      setRelayerFee(rFee.toString());
    }
    run();
  })

  return (
    <SingleColumnLayout title="Replicants">
      <ParLg>Current Networks</ParLg>
      <ParLg>Add new</ParLg>
      <ParLg>Accept/transfer splits Control</ParLg>
      <ParLg>Documentation for current owner to deploy and transfer</ParLg>
      <ParLg>instal connext sdk</ParLg>


      <FormBuilder
        form={APP_FORM.REPLICA}
        targetNetwork={TARGETS.NETWORK_ID}
        defaultValues={{
          relayFee: relayerFee,
        }
        }
      />

    </SingleColumnLayout>
  );
};
