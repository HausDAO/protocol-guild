import styled from "styled-components";

import { Member } from "../../types/Member.types";
import { MemberInfo } from "../MemberInfo";
import { MemberTable } from "../MemberTable/MemberTable";
import { Trigger } from "./Trigger";
import { CSVDownloader } from "../CsvDownloader";
import { Button, ParLg } from "@daohaus/ui";
import { SyncUpdateAll } from "./SyncUpdateAll";

type MemberRegistryProps = {
  membersList: Member[];
  lastUpdate: number;
  refetch: () => void;
};

const ActionContainer = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MemberRegistry = (props: MemberRegistryProps) => {
  const { membersList, lastUpdate, refetch } = props;
  return (
    <>
      {membersList.length ? (
        <>
        <MemberInfo memberList={membersList} lastUpdate={lastUpdate}></MemberInfo>
          <ActionContainer>
            {membersList.length > 0 && (
              <Trigger
                onSuccess={() => {
                  // TODO: update table
                  // alert user
                  refetch();
                }}
              />
            )}
            <CSVDownloader></CSVDownloader>
            <SyncUpdateAll
              onSuccess={() => {
                refetch();
              }}
            />
          </ActionContainer>

          <MemberTable memberList={membersList}></MemberTable>
        </>
      ) : (
        <ParLg>No members found</ParLg>
      )}
    </>
  );
};

export { MemberRegistry };
