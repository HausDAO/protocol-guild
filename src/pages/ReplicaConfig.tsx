import { useParams } from "react-router-dom";

import { FormBuilder } from "@daohaus/form-builder";
import { ErrorText, ParLg,  SingleColumnLayout } from "@daohaus/ui";

import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { useConnext } from "../hooks/useConnext";
import { useNetworkRegistry } from "../hooks/useRegistry";
import { RegistryFields } from "../legos/fieldConfig";
import { APP_FORM } from "../legos/forms";
import { HAUS_RPC, ValidNetwork } from "../utils/keychain";

export const ReplicaConfig = () => {
  // get chain id from useParams hook
  const { chainID } = useParams<{ chainID: string }>();
  const {
    connextEnv,
    daoChain,
    domainId,
    registryAddress,
    replicaChains,
    safeAddress,
  } = useCurrentRegistry();

  const originDomainID = domainId;

  const domainID = replicaChains.find(
    (r) => r.NETWORK_ID === chainID
  )?.DOMAIN_ID;

  const { isIdle, isLoading, error, data: connextFeeData, refetch } = useConnext({
    network: connextEnv,
    destinationChainIds: [chainID || ""],
    destinationDomains: [domainID || ""],
    originChainId: daoChain || "",
    originDomain: originDomainID,
    signerAddress: safeAddress,
  });

  const { data: dataRegistry } = useNetworkRegistry({
    registryAddress: registryAddress,
    chainId: daoChain as ValidNetwork,
    rpcs: HAUS_RPC,
  });

  if (!connextFeeData)
    return (
      <SingleColumnLayout title="NetworkRegistry - Replica Management">
        <ParLg>Loading...</ParLg>
      </SingleColumnLayout>
    );

  return (
    <SingleColumnLayout title="NetworkRegistry - Replica Management">
      <div style={{textAlign: 'left'}}>
        <FormBuilder
          form={APP_FORM.BATCH_REPLICA_CLAIM}
          targetNetwork={daoChain}
          customFields={{ ...RegistryFields }}
          defaultValues={{
            relayFee: connextFeeData.relayerFee,
            chainID: chainID,
            domainID: domainID,
          }}
        />
      </div>
      {!connextFeeData.signerHasBalance && (
        <div style={{padding: "3rem 0"}}>
          <ErrorText>DAO Vault does not have enough balance to cover Connext Relayer Fees</ErrorText>
        </div>
      )}
    </SingleColumnLayout>
  );
};
