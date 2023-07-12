import React, { useState } from "react";

import { Button, ParLg, SingleColumnLayout } from "@daohaus/ui";

import { CsvUploader } from "../components/CsvUploader";
import { Member } from "../types/Member.types";
import { MemberTable } from "../components/MemberTable/MemberTable";

export const CsvUpload = () => {
  const [memberList, setMemberList] = useState<Member[] | null>(null);


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
      <MemberTable memberList={memberList} />
      <Button onClick={() => console.log("memberList", memberList)}>Submit Proposal</Button>
      </>)}

    </SingleColumnLayout>
  );
};
