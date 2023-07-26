import React, { useEffect, useState } from "react";

import { Divider, ParLg, ParMd, SingleColumnLayout, WarningText } from "@daohaus/ui";

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
`

export const CsvUpload = () => {

  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISRTY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });
  
  const [memberList, setMemberList] = useState<Member[] | null>(null);  
  const [stageMemberList, setStageMemberList] = useState<StagingMember[]>([]);


  useEffect(() => {
    
    if (data?.members && memberList) {
      const stagingList: StagingMember[] = memberList.map((member) => {
        const isNewMember = !data.members.find((m) => m.account === member.account);        
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


  return (
    <SingleColumnLayout>

      <ParLg>CSV Upload format:</ParLg>
      <ParMd>Format and 1st row header: address, modifier, startdate</ParMd>
      <StyledDivider />

      <CsvUploader setMemberList={setMemberList} />

      
      {stageMemberList.length > 0 && (
      <>
      <MemberImportTable memberList={stageMemberList} />
      <ComboMemberProposal onSuccess={() => console.log("success")} stageMemberList={stageMemberList} />
      </>)}

    </SingleColumnLayout>
  );
};
