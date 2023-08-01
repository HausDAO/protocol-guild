import React, { useEffect } from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";

import { create, SdkConfig } from "@connext/sdk";
import { fromWei } from "@daohaus/utils";
import { useParams } from "react-router-dom";
import { MolochFields } from "@daohaus/moloch-v3-fields";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useConnext } from "../hooks/useConnext";

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

  const [relayerFee, setRelayerFee] = React.useState("");
  // get chain id from useParams hook
  const { chainID } = useParams<{ chainID: string }>();

  const params = {
    originDomain: "1735353714",
    destinationDomain: "1735356532",
  }

  const originDomainID = TARGETS.DOMAIN_ID;

  const domainID = TARGETS.REPLICA_CHAIN_ADDRESSES.find(
    (r) => r.NETWORK_ID === chainID
  )?.DOMAIN_ID;

  const { isIdle, isLoading, error, data, refetch } = useConnext({
    originDomain: originDomainID,
    destinationDomain: domainID || "",
    chainID: chainID || "",
  });
  
  console.log("data: ", data);


  if(!data) return (
    <SingleColumnLayout title="Replicants">
      <ParLg>Loading...</ParLg> 
    </SingleColumnLayout>
  );

  return (
    <SingleColumnLayout title="Replicants">

      <FormBuilder
        form={APP_FORM.REPLICA}
        targetNetwork={TARGETS.NETWORK_ID}
        customFields={{ ...MolochFields, ...AppFieldLookup }}
        defaultValues={{
          relayFee: data?.relayerFee,
          chainID: chainID,
          domainID: domainID,
        }
        }
      />

    </SingleColumnLayout>
  );
};
