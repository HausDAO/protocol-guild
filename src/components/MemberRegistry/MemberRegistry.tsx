import styled from "styled-components";

import { Member } from "../../types/Member.types";
import { MemberInfo } from "../MemberInfo";
import { MemberTable } from "../MemberTable/MemberTable";
import { Trigger } from "./Trigger";
import { CSVDownloader } from "../CsvDownloader";

type MemberRegistryProps = {
  membersList: Member[];
  lastUpdate: number;
};

const ActionContainer = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MemberRegistry = (props: MemberRegistryProps) => {
  const { membersList, lastUpdate } = props;
  return (
    <>
      <MemberInfo memberList={membersList} lastUpdate={lastUpdate}></MemberInfo>
      <ActionContainer>
        <Trigger
          onSuccess={() => {
            alert("yay trigger");
          }}
        />
        <CSVDownloader></CSVDownloader>
      </ActionContainer>

      <MemberTable memberList={membersList}></MemberTable>
    </>
  );
};

export { MemberRegistry };
