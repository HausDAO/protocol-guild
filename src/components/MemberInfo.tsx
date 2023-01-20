import React from "react";

import { ParMd } from "@daohaus/ui";

export const MemberInfo = ({
  memberList,
  lastUpdate,
}: {
  memberList: any;
  lastUpdate: any;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div>
      <ParMd>Member Count: {memberList?.length}</ParMd>
      <ParMd>
        Last Update: {new Date(lastUpdate * 1000).toLocaleDateString()}{" "}
        {new Date(lastUpdate * 1000).toLocaleTimeString()}
      </ParMd>
    </div>
  );
};
