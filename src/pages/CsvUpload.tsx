import React, { useEffect, useState } from "react";

import {
  Divider,
  HelperText,
  ParLg,
  ParMd,
  SingleColumnLayout,
  WarningText,
} from "@daohaus/ui";

import { CsvUploader } from "../components/CsvUploader";
import { Member, StagingMember } from "../types/Member.types";
import { MemberImportTable } from "../components/MemberTable/MemberImportTable";
import { useMemberRegistry } from "../hooks/useRegistry";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "./Home";
import { ComboMemberProposal } from "../components/MemberRegistry/ComboMemberProposal";
import styled from "styled-components";

const StyledDivider = styled(Divider)`
  margin-bottom: 2rem;
`;

export const CsvUpload = () => {
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  const [memberList, setMemberList] = useState<Member[] | null>(null);
  const [stageMemberList, setStageMemberList] = useState<StagingMember[]>([]);

  useEffect(() => {
    if (data?.members && memberList) {
      const stagingList: StagingMember[] = memberList.map((member) => {
        const isNewMember = !data.members.find(
          (m) => m.account === member.account
        );
        return {
          account: member.account,
          activityMultiplier: member.activityMultiplier,
          startDate: member.startDate,
          newMember: isNewMember,
        };
      });
      setStageMemberList(stagingList);
    }
  }, [data, memberList]);

  const handleSuccess = () => {
    setMemberList(null);
    setStageMemberList([]);
    refetch();
  };

  return (
    <SingleColumnLayout>
      <ParMd>
        Upload a CSV file with the following columns: address, modifier,
        startDate
      </ParMd>
      <StyledDivider />

      <CsvUploader setMemberList={setMemberList} />

      {stageMemberList.length > 0 && (
        <>
          <ParLg>count: {stageMemberList.length}</ParLg>
          <MemberImportTable memberList={stageMemberList} />
          {stageMemberList.length < 50 ? (
            <ComboMemberProposal
              onSuccess={handleSuccess}
              stageMemberList={stageMemberList}
            />
          ) : (
            <HelperText>
              Too many members to create a proposal. Please upload a smaller
              list (less than 50).
            </HelperText>
          )}
        </>
      )}
    </SingleColumnLayout>
  );
};
