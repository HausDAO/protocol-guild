import React, { useEffect, useState } from "react";

import { Button, ParLg, SingleColumnLayout } from "@daohaus/ui";

import { CsvUploader } from "../components/CsvUploader";
import { Member, StagingMember } from "../types/Member.types";
import { MemberTable } from "../components/MemberTable/MemberTable";
import { MemberImportTable } from "../components/MemberTable/MemberImportTable";
import { useMemberRegistry } from "../hooks/useRegistry";
import { TARGETS } from "../targetDao";
import { useDHConnect } from "@daohaus/connect";
import { HAUS_RPC } from "./Home";

export const CsvUpload = () => {

  const { chainId, provider, address } = useDHConnect();

  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISRTY_ADDRESS,
    userAddress: address,
    chainId: TARGETS.DEFAULT_CHAIN,
    rpcs: HAUS_RPC,
  });

  console.log("data???", data);
  

  const [memberList, setMemberList] = useState<Member[] | null>(null);  
  const [stageMemberList, setStageMemberList] = useState<StagingMember[]>([]);


  useEffect(() => {
    console.log('change?', memberList, data?.members);
    
    if (data?.members && memberList) {
      const stagingList: StagingMember[] = memberList.map((member) => {
        const isNewMember = !data.members.find((m) => m.account === member.account);
        console.log("isNewMember", isNewMember);
        
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
      <ParLg>Upload CSV file with address, modifier, start date</ParLg>
      <ParLg>Validate shape</ParLg>
      <ParLg>Compare against current registry</ParLg>

      <ParLg>Submit data to multicall proposal</ParLg>
      <ParLg>batch update and batch new</ParLg>
      <ParLg>csv format: account, modifier, startdate</ParLg>



      <CsvUploader setMemberList={setMemberList} />

      
      {memberList && (
      <>
      <MemberImportTable memberList={stageMemberList} />
      <Button onClick={() => console.log("memberList", memberList)}>Submit Proposal</Button>
      </>)}

    </SingleColumnLayout>
  );
};
