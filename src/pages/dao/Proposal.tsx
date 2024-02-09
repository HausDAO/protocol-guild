import { useEffect, useState } from "react";
import styled from "styled-components";

import { ValidNetwork, isValidNetwork } from "@daohaus/keychain-utils";
import { useCurrentDao, useDaoProposal } from "@daohaus/moloch-v3-hooks";
import { TX } from '@daohaus/moloch-v3-legos';
import {
  ProposalActions,
  ProposalDetails,
  ProposalHistory,
} from "@daohaus/moloch-v3-macro-ui";
import { BiColumnLayout, Card, ParLg, Loading, widthQuery } from "@daohaus/ui";
import {
  getProposalTypeLabel,
  MulticallAction,
  MulticallArg,
  PROPOSAL_TYPE_LABELS,
  TXLego,
} from "@daohaus/utils";
import {
  deepDecodeProposalActions as decodeProposalActions,
  DeepDecodedMultiTX as DecodedMultiTX,
  isActionError
} from "@daohaus/tx-builder";

import { ProposalActionData } from "../../components/dao/ProposalActionData";
import { APP_TX } from "../../legos/tx";

const LoadingContainer = styled.div`
  margin-top: 5rem;
`;

const OverviewCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 64rem;
  padding: 2rem;
  border: none;
  margin-bottom: 3.4rem;
  height: fit-content;
  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
  }
  text-align: justify;
`;

const RightCard = styled(Card)`
  width: 45.7rem;
  padding: 2rem;
  border: none;
  margin-bottom: 3.4rem;
  height: 100%;
  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
  }
  text-align: justify;
`;

export const Proposal = () => {
  const { proposal } = useDaoProposal();
  const { daoChain, daoId } = useCurrentDao();
  const [decodeError, setDecodeError] = useState<boolean>(false);
  const [actionData, setActionData] = useState<DecodedMultiTX | null>();
  const [actionsMeta, setActionsMeta] = useState<MulticallAction[]>();

  const txLegos: Record<string, TXLego> = {
    ...TX,
    ...APP_TX
  };

  useEffect(() => {
    if (proposal?.proposalType) {
      const txLego = txLegos[proposal.proposalType]?.args?.find(
        (tx) => (tx as MulticallArg).type === 'multicall'
      );
      setActionsMeta(txLego && (txLego as MulticallArg).actions);
    }
  }, [proposal?.proposalType, txLegos]);

  useEffect(() => {
    let shouldUpdate = true;
    const fetchPropActions = async (
      chainId: ValidNetwork,
      actionData: string
    ) => {
      const proposalActions = await decodeProposalActions({
        chainId,
        actionData,
      });

      if (shouldUpdate) {
        setActionData(proposalActions);
        setDecodeError(
          proposalActions.length === 0 ||
            proposalActions.some((action) => isActionError(action))
        );
      }
    };

    if (!isValidNetwork(daoChain) || !proposal) return;
    fetchPropActions(daoChain, proposal.proposalData);

    return () => {
      shouldUpdate = false;
    };
  }, [daoChain, proposal]);

  if (!daoChain || !daoId)
    return (
      <LoadingContainer>
        <ParLg>DAO Not Found</ParLg>
      </LoadingContainer>
    );

  if (!proposal)
    return (
      <LoadingContainer>
        <Loading size={6} />
      </LoadingContainer>
    );

  return (
    <BiColumnLayout
      title={proposal?.title}
      subtitle={`${proposal?.proposalId} | ${getProposalTypeLabel(
        proposal?.proposalType,
        PROPOSAL_TYPE_LABELS
      )}`}
      left={
        <OverviewCard>
          {daoChain && daoId && proposal && (
            <ProposalDetails
              actionData={actionData}
              daoChain={daoChain}
              daoId={daoId}
              proposal={proposal}
              decodeError={decodeError}
              includeLinks
            />
          )}
          <ProposalActionData
            daoChain={daoChain}
            daoId={daoId}
            proposal={proposal}
            decodeError={decodeError}
            actionData={actionData}
            actionsMeta={actionsMeta}
          />
        </OverviewCard>
      }
      right={
        <RightCard>
          <ProposalActions
            proposal={proposal}
            daoChain={daoChain}
            daoId={daoId}
          />
          <ProposalHistory
            proposalId={proposal.proposalId}
            daoChain={daoChain}
            daoId={daoId}
            includeLinks
          />
        </RightCard>
      }
    />
  );
};
