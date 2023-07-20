import React, { useEffect, useState } from "react";

import { Button, ParLg, SingleColumnLayout } from "@daohaus/ui";

import { CsvUploader } from "../components/CsvUploader";
import { Member, StagingMember } from "../types/Member.types";
import { MemberImportTable } from "../components/MemberTable/MemberImportTable";
import { useMemberRegistry } from "../hooks/useRegistry";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "./Home";
import { ComboMemberProposal } from "../components/MemberRegistry/ComboMemberProposal";

export const CsvUpload = () => {

  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISRTY_ADDRESS,
    chainId: TARGETS.DEFAULT_CHAIN,
    rpcs: HAUS_RPC,
  });
  
  const [memberList, setMemberList] = useState<Member[] | null>(null);  
  const [stageMemberList, setStageMemberList] = useState<StagingMember[]>([]);


  useEffect(() => {
    console.log('change?', memberList, data?.members);
    
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
    <SingleColumnLayout title="CsvUpload">

      <ParLg>csv format: address, modifier, startdate</ParLg>

      <CsvUploader setMemberList={setMemberList} />

      
      {stageMemberList.length > 0 && (
      <>
      <MemberImportTable memberList={stageMemberList} />
      <ComboMemberProposal onSuccess={() => console.log("success")} stageMemberList={stageMemberList} />
      </>)}

    </SingleColumnLayout>
  );
};
