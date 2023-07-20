import React from "react";
import { handleErrorMessage, TXLego } from "@daohaus/utils";
import { useDHConnect } from "@daohaus/connect";
import { buildMultiCallTX, useTxBuilder } from "@daohaus/tx-builder";
import { Spinner, useToast, GatedButton } from "@daohaus/ui";

import { ACTION_TX, ProposalTypeIds } from "../../legos/tx";

import MEMBER_REGISTRY from '../../abis/memberRegistry.json'
import { TARGETS } from "../../targetDao";
import { APP_CONTRACT } from "../../legos/contract";
import { Member, StagingMember } from "../../types/Member.types";


export const ComboMemberProposal = ({
  onSuccess,
  stageMemberList,
}: {
  onSuccess: () => void;
  stageMemberList: any;

}) => {
  if (!stageMemberList) return null;

  const daochain = TARGETS.DEFAULT_CHAIN;
  const { fireTransaction } = useTxBuilder();
  const { chainId, address } = useDHConnect();
  const { errorToast, defaultToast, successToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const newMembers = stageMemberList.filter((member: StagingMember) => member.newMember);  
  const editMembers = stageMemberList.filter((member: StagingMember) => !member.newMember);

  const newMemberActivityMods = newMembers.map((member: StagingMember) => member.activityMultiplier);
  const newMemberAccounts = newMembers.map((member: StagingMember) => member.account);
  const newMemberStartDates = newMembers.map((member: StagingMember) => member.startDate);
  const newMemberShares = newMembers.map((member: StagingMember) => "100000000000000000000");

  const editMemberActivityMods = editMembers.map((member: StagingMember) => member.activityMultiplier);
  const editMemberAccounts = editMembers.map((member: StagingMember) => member.account);


  const handleTrigger = () => {
    setIsLoading(true);
    fireTransaction({
      tx: buildMultiCallTX({
        id: 'NEW_AND_EDIT_MEMBER',
        JSONDetails: {
          type: 'JSONDetails',
          jsonSchema: {
            title: { type: 'static', value: 'New and Edit Members' },
            description: { type: 'static', value: 'New and Edit Members' },
            contentURI: { type: 'static', value: 'https://daohaus.club' },
            contentURIType: { type: 'static', value: 'url' },
            proposalType: { type: 'static', value: ProposalTypeIds.EditMember },
          },
        },
        actions: [
          {
            contract: APP_CONTRACT.MEMBER_REGISTRY,
            method: 'batchUpdateMember',
            args: [
              { type: 'static', value: editMemberAccounts },
              { type: 'static', value: editMemberActivityMods }, 
            ],
          },
          {
            contract: APP_CONTRACT.MEMBER_REGISTRY,
            method: 'batchNewMember',
            args: [
              { type: 'static', value: newMemberAccounts },
              { type: 'static', value: newMemberActivityMods },
              { type: 'static', value: newMemberStartDates },
            ],
          },
          {
            contract: APP_CONTRACT.CURRENT_DAO,
            method: 'mintShares',
            args: [
              { type: 'static', value: newMemberAccounts }, 
              { type: 'static', value: newMemberShares },
            ]
          },
        ],
      }),
      lifeCycleFns: {
        onTxError: (error) => {
          const errMsg = handleErrorMessage({
            error,
          });
          errorToast({ title: "Trigger Failed", description: errMsg });
          setIsLoading(false);
        },
        onTxSuccess: () => {
          defaultToast({
            title: "Trigger Success",
            description: "Please wait table to update",
          });
          setIsLoading(false);
        },
      },
    });
  };

  const isConnectedToDao =
    chainId === daochain
      ? true
      : "You are not connected to the same network as the DAO";

  return (
    <GatedButton
      color="primary"
      rules={[isConnectedToDao]}
      onClick={handleTrigger}
    >
      {isLoading ? <Spinner size="2rem" strokeWidth=".2rem" /> : "Submit Proposal"}
    </GatedButton>
  );
};