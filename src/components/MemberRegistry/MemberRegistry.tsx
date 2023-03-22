import styled from "styled-components";

import { Member } from "../../types/Member.types";
import { MemberInfo } from "../MemberInfo";
import { MemberTable } from "../MemberTable/MemberTable";
import { Trigger } from "./Trigger";
import { TriggerAndDistro } from "./TriggerAndDistro";

type MemberRegistryProps = {
  membersList: Member[];
  membersSorted: string[];
  lastUpdate: number;
};

const ActionContainer = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MemberRegistry = (props: MemberRegistryProps) => {
  const { membersList, lastUpdate, membersSorted } = props;
  return (
    <>
      <MemberInfo memberList={membersList} lastUpdate={lastUpdate}></MemberInfo>
      <ActionContainer>
        <Trigger
          onSuccess={() => {
            alert("yay trigger");
          }}
          sortedMemberList={membersSorted}
        />

        <TriggerAndDistro
          onSuccess={() => {
            alert("yay trigger");
          }}
          sortedMemberList={membersSorted}
        />
      </ActionContainer>

      <MemberTable memberList={membersList}></MemberTable>
    </>
  );
};

export { MemberRegistry };
