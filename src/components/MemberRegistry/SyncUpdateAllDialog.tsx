import { useEffect, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTxBuilder } from "@daohaus/tx-builder";
import { Spinner, useToast, GatedButton, ParMd, ErrorText } from "@daohaus/ui";
import { handleErrorMessage } from "@daohaus/utils";

import { ContentParagraph, ProposalDialog } from "../ProposalDialog";
import NETWORK_REGISTRY from "../../abis/NetworkRegistry.json";
import { Registry } from "../../hooks/context/RegistryContext";
import { useConnext } from "../../hooks/useConnext";
import { REGISTRY } from "../../targetDao";
import { RegistryData, RegistryState, checkRegistryState } from "../../utils/registry";

const PROPOSAL_DESCRIPTION = `
  This action will execute both 'updateSecondsActive' and 'updateSplits' on the main registry and
  any existing replica registries.
`;

export const SyncUpdateAllDialog = ({
  onSuccess,
  registry,
  registryData,
}: {
  onSuccess: () => void;
  registry: Registry;
  registryData: RegistryData;
}) => {
  const { fireTransaction } = useTxBuilder();
  const { chainId } = useDHConnect();
  const  {
    connextEnv,
    daoChain,
    domainId,
    registryAddress,
    replicaRegistries,
    safeAddress,
  } = registry;
  const { errorToast, defaultToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [registryState , setRegistryState] = useState<RegistryState>({ warningMsg: '' });

  useEffect(() => {
    const checkRegistryPendingState = async () => {
      if (daoChain && registryAddress) {
        const hydratedRegistryData: REGISTRY = {
          NETWORK_ID: daoChain,
          REGISTRY_ADDRESS: registryAddress,
        };
        setRegistryState(
          await checkRegistryState({ hydratedRegistryData })
        );
      }
    };
    checkRegistryPendingState();
  }, [daoChain, registryAddress]);

  const { 
    isIdle: isIdleConnext, 
    isLoading: isLoadingConnext, 
    error: errorConnext, 
    data: connextFeeData, 
    refetch: refetchConnext
  } = useConnext({
    network: connextEnv,
    destinationChainIds: replicaRegistries.map(
      (r) => r.NETWORK_ID || ""
    ),
    destinationDomains: replicaRegistries.map(
      (r) => r.DOMAIN_ID || ""
    ),
    originChainId: daoChain || "",
    originDomain: domainId,
    signerAddress: safeAddress,
  });

  if (isLoadingConnext || !registryData) return <Spinner />;

  const handleTrigger = () => {
    setIsSuccess(false);
    setIsTxLoading(true);
    fireTransaction({
      tx: {

        id: "SYNC_UPDATE_ALL",
        contract: {
          type: "static",
          contractName: "NETWORK_REGISTRY",
          abi: NETWORK_REGISTRY,
          targetAddress: registryAddress,
        },
        method: "syncUpdateAll",
        disablePoll: true,
        staticOverrides: {
          value: connextFeeData?.relayerFeeWei || BigInt(0),
        },
        args: [
          { type: "static", value: registryData.membersSorted.map((m) => m.account) as string[] },
          { type: "static", value: "0" }, // split distribution fee
          {
            type: "static",
            value: replicaRegistries.map(
              (r) => r.NETWORK_ID || ""
            ),
          },
          { type: "static", value: connextFeeData?.feesPerDestination.map(v => v.toString()) || [] }
        ],
      },
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({ title: "Sync Registry Failed", description: errMsg });
          setIsTxLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Sync Registry Success",
            description: "Sync Update All action executed! Check the sync status under Registries",
          });
          onSuccess();
          setIsSuccess(true);
          setIsTxLoading(false);
        },
      },
    });
  };
  
  const isConnectedToTargetChain = chainId === daoChain
  ? true
  : "You are not connected to the same network as the DAO";
  
  const vaultHasEnoughBalance = connextFeeData?.signerHasBalance ||
    "DAO Vault does not have enough balance to cover Connext Relayer Fees";

  const registryStateOk = registryState?.splitSetupOk === true || registryState?.warningMsg
  
  if (isLoadingConnext) {
    return <Spinner size="2rem" strokeWidth=".2rem" />;
  }

  return (
    <ProposalDialog
      dialogTrigger={
        <GatedButton
          color="secondary"
          rules={[isConnectedToTargetChain]}
        >
          {isLoadingConnext ? <Spinner size="2rem" strokeWidth=".2rem" /> : "Sync Registry + 0xSplit Distribution"}
        </GatedButton>
      }
      proposalAdditionalInfo={
        <>
          {registry.replicaRegistries.length > 0 && (  
            <ParMd>
              Total Relayer Fees: {connextFeeData?.relayerFee || "0"}
            </ParMd>
          )}
          {registryState?.warningMsg && (
            <div style={{padding: "3rem 0"}}>
            <ErrorText>{registryState.warningMsg}</ErrorText>
          </div>
          )}
          {!connextFeeData?.signerHasBalance && (
            <div style={{padding: "3rem 0"}}>
              <ErrorText>DAO Vault does not have enough balance to cover Connext Relayer Fees</ErrorText>
            </div>
          )}
        </>
      }
      proposalDescription={PROPOSAL_DESCRIPTION}
      proposalDetails={
        <ContentParagraph>
          <ParMd>
            Total Members: {`${registryData.totalMembers}`}
          </ParMd>
        </ContentParagraph>
      }
      proposalSubmitTrigger={
        <GatedButton
          color="primary"
          rules={[isConnectedToTargetChain, registryStateOk, vaultHasEnoughBalance]}
          onClick={handleTrigger}
          style={{ marginTop: "2rem" }}
        >
          {isTxLoading ? (
            <Spinner size="2rem" strokeWidth=".2rem" />
          ) : (
            "Submit Proposal"
          )}
        </GatedButton>
      }
      registry={registry}
      success={isSuccess}
      title="Registry: Sync Update All"
    />
  );
};
