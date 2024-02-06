import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useDHConnect } from "@daohaus/connect";
import { ValidNetwork } from "@daohaus/keychain-utils";
import { buildMultiCallTX, useTxBuilder } from "@daohaus/tx-builder";
import {
  Spinner,
  useToast,
  GatedButton,
  ParMd,
  Button,
  Link,
  ErrorText,
} from "@daohaus/ui";
import { EthAddress, handleErrorMessage, MulticallAction, ValidArgType } from "@daohaus/utils";

import { ProposalDialog } from "../ProposalDialog";
import { Registry } from "../../hooks/context/RegistryContext";
import { useConnext } from "../../hooks/useConnext";
import { APP_CONTRACT } from "../../legos/contract";
import { ProposalTypeIds } from "../../legos/tx";
import { StagingMember } from "../../types/Member.types";
import { fetchMembersShares } from "../../utils/dao";

const ContentParagraph = styled.div`
  margin-bottom: 2rem;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: center;
`;

const PROPOSAL_DESCRIPTION = `
  This action will submit a proposal to the DAO to update the main member registry and any existing
  replica registries. The proposal will set the activity status for new/existing members and will also
  use this multiplier factor to mint/burn DAO membership shares.
`;

export const MemberProposalDialog = ({
  onSuccess,
  registry,
  stageMemberList,
}: {
  onSuccess: () => void;
  registry: Registry;
  stageMemberList: any;
}) => {
  if (!registry.daoChain || !stageMemberList) return null;

  const { fireTransaction } = useTxBuilder();
  const { chainId } = useDHConnect();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sharesToBurn, setSharesToBurn] = useState<Array<string>>([]);
  const [newMemberShares, setNewMemberShares] = useState<Array<EthAddress>>([]);
  const [accountsToRestoreShares, setAccountsToRestoreShares] = useState<Array<EthAddress>>([]);

  const { isIdle, isLoading, error, data: connextFeeData, refetch } = useConnext({
    network: registry.connextEnv,
    destinationChainIds: registry.replicaRegistries.map(
      (r) => r.NETWORK_ID || ""
    ),
    destinationDomains: registry.replicaRegistries.map(
      (r) => r.DOMAIN_ID || ""
    ),
    originChainId: registry.daoChain || "",
    originDomain: registry.domainId,
    signerAddress: registry.safeAddress,
  });

  const hasReplicas = registry.replicaRegistries.length > 0;

  const newMembers = useMemo(() => {
    return stageMemberList.filter(
      (member: StagingMember) => member.isNewMember
    );
  }, [stageMemberList]);
  
  const noNewMembersError = useMemo(() => {
    if (
      newMembers.some(
        (member: StagingMember) => member.activityMultiplier === 0
      )
    ) {
      return 'New members cannot have activityMultiplier set to zero';
    }
    return true;
  }, [newMembers]);

  const editMembers = useMemo(() => {
    return stageMemberList.filter(
      (member: StagingMember) => !member.isNewMember
    );
  }, [stageMemberList]);

  const inactiveMembers: Array<StagingMember> = useMemo(() => {
    return editMembers.filter(
      (member: StagingMember) => member.activityMultiplier === 0
    );
  }, [editMembers]);

  // NOTICE: multiplier that accounts for the total No. of cross-chain calls that will be performed on each replica
  const relayerFeesMultiplier = useMemo(() => {
    return BigInt(Number(newMembers.length > 0) + Number(editMembers.length > 0));
  }, [newMembers, editMembers]);

  const signerHasBalance = useMemo(() => {
    if (connextFeeData)
      return connextFeeData.signerBalanceWei >= connextFeeData.relayerFeeWei * relayerFeesMultiplier;
  }, [connextFeeData, relayerFeesMultiplier]);

  console.log(
    'Relayer Fee',
    `${connextFeeData?.relayerFee} x ${relayerFeesMultiplier}`,
    `Balance: ${signerHasBalance}`
  );

  useEffect(() => {
    const fetchMemberShares = async () => {
      const memberAddresses: Array<EthAddress> = newMembers
        .filter(
          (m: StagingMember) => m.activityMultiplier > 0
        ).map((m: StagingMember) => m.account as EthAddress);
      const currentMemberShares = await fetchMembersShares({
        dao: registry.daoId,
        memberAddresses: memberAddresses,
        networkId: registry.daoChain as ValidNetwork,
      });
      const toMintAddresses = memberAddresses.filter(
        (_, idx) => BigInt(currentMemberShares[idx]) === BigInt(0)
      );
      setNewMemberShares(toMintAddresses);
    };
    if (registry.sharesToMint > 0) {
      fetchMemberShares();
    }
  }, [newMembers, registry]);

  useEffect(() => {
    const fetchInactiveMemberShares = async () => {
      const currentMemberShares = await fetchMembersShares({
        dao: registry.daoId,
        memberAddresses: inactiveMembers.map((m: StagingMember) => m.account as EthAddress),
        networkId: registry.daoChain as ValidNetwork,
      });
      setSharesToBurn(currentMemberShares);
    };
    if (inactiveMembers.length) {
      fetchInactiveMemberShares();
    }
  }, [inactiveMembers]);

  useEffect(() => {
    const fetchMemberShares = async () => {
      const activeMemberAddresses: Array<EthAddress> = editMembers
        .filter(
          (m: StagingMember) => m.activityMultiplier > 0
        ).map((m: StagingMember) => m.account as EthAddress);
      const activeMemberShares = await fetchMembersShares({
        dao: registry.daoId,
        memberAddresses: activeMemberAddresses,
        networkId: registry.daoChain as ValidNetwork,
      });
      const missingSharesAddresses = activeMemberAddresses.filter(
        (_, idx) => BigInt(activeMemberShares[idx]) === BigInt(0)
      );
      setAccountsToRestoreShares(missingSharesAddresses);
    }
    if (editMembers.length) {
      fetchMemberShares();
    }
  }, [editMembers]);

  const accountsToMintShares = useMemo(() => {
    return [...newMemberShares, ...accountsToRestoreShares];
  }, [newMemberShares, accountsToRestoreShares]);

  const handleTrigger = useCallback(() => {
    setIsTxLoading(true);
    setIsSuccess(false);

    const editMemberActivityMods = editMembers.map(
      (member: StagingMember) => member.activityMultiplier
    );
  
    const editMemberAccounts = editMembers.map(
      (member: StagingMember) => member.account
    );

    const inactiveMemberAccounts = inactiveMembers.map(
      (member: StagingMember) => member.account
    );

    const registryActions: MulticallAction[] = [];
    if (editMemberAccounts.length) {
      const batchArgs: Array<ValidArgType> = [
        { type: "static", value: editMemberAccounts },
        { type: "static", value: editMemberActivityMods },
        {
          type: "static",
          value: hasReplicas ? registry.replicaRegistries.map(
            (r) => r.NETWORK_ID || ""
          ) : [],
        },
        { type: "static", value: hasReplicas ? connextFeeData?.feesPerDestination : [] }
      ];

      registryActions.push({
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "syncBatchUpdateMembersActivity",
        args: batchArgs,
        value: { type: "static", value: connextFeeData?.relayerFeeWei || "0" },
      });
    }

    if (inactiveMemberAccounts.length) {
      registryActions.push({
        contract: APP_CONTRACT.CURRENT_DAO,
        method: "burnShares",
        args: [
          { type: "static", value: inactiveMemberAccounts },
          { type: "static", value: sharesToBurn },
        ],
      });
    }

    const newMemberActivityMods: Array<number> = newMembers.map(
      (member: StagingMember) => member.activityMultiplier
    );
    const newMemberAccounts = newMembers.map(
      (member: StagingMember) => member.account
    );
    const newMemberStartDates = newMembers.map(
      (member: StagingMember) => member.startDate
    );

    if (newMemberAccounts.length) {
      const batchArgs: Array<ValidArgType> = [
        { type: "static", value: newMemberAccounts },
        { type: "static", value: newMemberActivityMods },
        { type: "static", value: newMemberStartDates },
        {
          type: "static",
          value: hasReplicas ? registry.replicaRegistries.map(
            (r) => r.NETWORK_ID || ""
          ): [],
        },
        { type: "static", value: hasReplicas ? connextFeeData?.feesPerDestination : [] }
      ];

      registryActions.push({
        contract: APP_CONTRACT.NETWORK_REGISTRY,
        method: "syncBatchNewMembers",
        args: batchArgs,
        value: { type: "static", value: connextFeeData?.relayerFeeWei || "0" },
      });
    }

    if (accountsToMintShares.length > 0) {
      const memberShareAmounts = accountsToMintShares.map(
        () => registry.sharesToMint.toString()
      );
      registryActions.push({
        contract: APP_CONTRACT.CURRENT_DAO,
        method: "mintShares",
        args: [
          { type: "static", value: accountsToMintShares },
          { type: "static", value: memberShareAmounts },
        ],
      });
    }

    fireTransaction({
      tx: buildMultiCallTX({
        id: "BATCH_ADD_UPDATE_MEMBERS",
        JSONDetails: {
          type: "JSONDetails",
          jsonSchema: {
            title: { type: "static", value: "Add/Update Registry Members" },
            description: { type: "static", value: "Batch operation to add/update members in the registry" },
            contentURI: { type: "static", value: "https://daohaus.club" },
            contentURIType: { type: "static", value: "url" },
            proposalType: { type: "static", value: ProposalTypeIds.MultiCall },
          },
        },
        actions: registryActions,
        // TODO:  (x6 for registry actions) +
        //        (x20 for minting shares) +
        //        (relayerFeesMultiplier * default_gasBufferMultiplier) +
        //        (need at least 150k extra to the 250k default for baal processing)
        // sample tx with 50 new members https://goerli.etherscan.io/tx/0x6922b8dc1c217d5ff88992ed0a60f12a39923300cf47df80ba1900c02859518e
        gasBufferPercentage: 6 + (newMemberAccounts.length ? 20 : 0) + (Number(relayerFeesMultiplier.toString()) * 1.2) + 0.4,
      }),
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({ title: "Bulk Upload Failed", description: errMsg });
          setIsTxLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Bulk Upload Success",
            description: "A Proposal was submitted to the DAO",
          });
          setIsTxLoading(false);
          setIsSuccess(true);
          onSuccess();
        },
      },
    });
  }, [
    accountsToMintShares,
    connextFeeData,
    editMembers,
    hasReplicas,
    inactiveMembers,
    newMembers,
    registry,
    relayerFeesMultiplier,
    sharesToBurn,
  ]);

  const isConnectedToTargetChain = chainId === registry.daoChain
    ? true
    : "You are not connected to the same network as the DAO";

  const vaultHasEnoughBalance = signerHasBalance ||
    "DAO Vault does not have enough balance to cover Connext Relayer Fees";

  if (isLoading) {
    return <Spinner size="2rem" strokeWidth=".2rem" />;
  }

  return (
    <ProposalDialog
      dialogTrigger={
        <GatedButton color="primary" rules={[isConnectedToTargetChain]}>
          {isTxLoading ? (
            <Spinner size="2rem" strokeWidth=".2rem" />
          ) : (
            "Submit Proposal"
          )}
        </GatedButton>
      }
      error={
        noNewMembersError !== true ? (
            <ErrorText>{noNewMembersError}</ErrorText>
        ) : null
      }
      proposalAdditionalInfo={
        <>
          {registry.replicaRegistries.length > 0 && (  
            <ParMd>
              Total Relayer Fees: {connextFeeData?.relayerFee || "0"}
            </ParMd>
          )}
          {!signerHasBalance && (
            <div style={{padding: "3rem 0"}}>
              <ErrorText>DAO Vault does not have enough balance to cover Connext Relayer Fees</ErrorText>
            </div>
          )}
        </>
      }
      proposalDescription={PROPOSAL_DESCRIPTION}
      proposalDetails={
        <ContentParagraph>
          {newMembers.length > 0 && (
            <ParMd>
              New Members: {`${newMembers.length}`}
            </ParMd>
          )}
          {editMembers.length > 0 && (
            <ParMd>
              Updated Members: {`${editMembers.length - (inactiveMembers.length || 0)}`}
            </ParMd>
          )}
          {inactiveMembers.length > 0 && (
            <ParMd>
              Inactive Members: {`${inactiveMembers.length}`}
            </ParMd>
          )}
          {registry.sharesToMint > 0 && accountsToMintShares.length > 0 && (
            <ParMd>
              DAO Shares to Mint: {`${BigInt(accountsToMintShares.length) * registry.sharesToMint / BigInt(1e18)}`}
            </ParMd>
          )}
          {sharesToBurn.length > 0 && (
            <ParMd>
              DAO Shares to Burn: {`${sharesToBurn.reduce((a, b) => a + BigInt(b), BigInt(0)) / BigInt(1e18)}`}
            </ParMd>
          )}
        </ContentParagraph>
      }
      proposalSubmitTrigger={
        <GatedButton
          color="primary"
          rules={[isConnectedToTargetChain, vaultHasEnoughBalance, noNewMembersError]}
          onClick={handleTrigger}
          style={{ marginTop: "2rem", padding: "0 1rem" }}
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
      title="DAO Proposal: Member Registry Bulk Upload"
      successInfo={
        <>
          <ParMd>Proposal Submitted: The DAO can now vote to execute.</ParMd>
          <DialogActions style={{ marginTop: "2rem" }}>
            <Link
              href={`https://admin.daohaus.fun/#/molochv3/${registry.daoChain}/${registry.daoId}`}  
              target="_blank"
            >
              <Button>Go to DAO Admin</Button>
            </Link>
          </DialogActions>
        </>
      }
    />
  );
};
