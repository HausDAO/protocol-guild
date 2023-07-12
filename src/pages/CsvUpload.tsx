import React, { useState } from "react";

import { ParLg, SingleColumnLayout } from "@daohaus/ui";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { TARGETS } from "../targetDao";
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


      <CsvUploader setMemberList={setMemberList} />

      
      {memberList && (<MemberTable memberList={memberList} />)}

    </SingleColumnLayout>
  );
};
