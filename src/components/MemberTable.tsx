import React from "react";

import { ParMd } from "@daohaus/ui";

interface Member {
  account: string;
  activityMultiplier: number;
  secondsActive: number;
  startDate: number;
}

export const MemberTable = ({ memberList }: { memberList: any }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const renderMemberList = () => {
    return memberList?.map((member: Member) => {
      return (
        <ParMd>
          {member.account} |{" "}
          {new Date(member.startDate * 1000).toLocaleDateString()} |{" "}
          {member.secondsActive} | {member.activityMultiplier}
        </ParMd>
      );
    });
  };

  return (
    <div>
      <ParMd>acount | startdate | secondsActive | activityMultiplier</ParMd>
      {renderMemberList()}
    </div>
  );
};
