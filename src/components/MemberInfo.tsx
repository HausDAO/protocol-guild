import React from "react";
import styled from "styled-components";
import moment from "moment";
import { DataIndicator, H3, Link } from "@daohaus/ui";

import { Member } from "../types/Member.types";

const MemberInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2rem;
`;

const RightAligned = styled(DataIndicator)`
  align-items: end;
`;

export const MemberInfo = ({
  memberList,
  lastUpdate,
}: {
  memberList: Member[];
  lastUpdate: number;
}) => {
  return (
    <MemberInfoContainer>
      <DataIndicator label="Members" data={memberList.length} />
      <RightAligned
        label="Last Updated"
        data={moment.unix(lastUpdate).format("llll")}
        size="sm"
      />
    </MemberInfoContainer>
  );
};
