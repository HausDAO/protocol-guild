import { Card } from "@daohaus/ui";
import React, { PropsWithChildren } from "react";

import { Member } from "../types/Member.types";
import { MemberInfo } from "./MemberInfo";
import { MemberTable } from "./MemberTable";

type MemberRegistryProps = {
  membersList: Member[];
  lastUpdate: number;
};

const MemberRegistry = (props: PropsWithChildren<MemberRegistryProps>) => {
  const { membersList, lastUpdate, children } = props;
  return (
    <>
      <MemberInfo memberList={membersList} lastUpdate={lastUpdate}></MemberInfo>

      <MemberTable memberList={membersList}></MemberTable>
    </>
  );
};

export { MemberRegistry };
