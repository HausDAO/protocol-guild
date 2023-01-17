import React from "react";

import { ParMd } from "@daohaus/ui";

export const MemberInfo = ({ memberList }: { memberList: any }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div>
      <ParMd>Member Count {memberList?.length}</ParMd>
      <ParMd>last update --</ParMd>
    </div>
  );
};
