import styled from "styled-components";

import { ParLg } from "@daohaus/ui";

import { MemberRegistryInfo } from "./MemberRegistryInfo";
import { SyncUpdateAllDialog } from "./SyncUpdateAllDialog";
import { MemberTable } from "../MemberTable";
import { CSVDownloaderButton } from "../molecules/CsvDownloaderButton";
import { Member } from "../../types/Member.types";
import { RegistryData } from "../../utils/registry";
import { Registry } from "../../hooks/context/RegistryContext";

type MemberRegistryProps = {
  membersList: Member[];
  lastUpdate: number;
  refetch: () => void;
  registry: Registry;
  registryData: RegistryData;
};

const ActionContainer = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const MemberRegistry = (props: MemberRegistryProps) => {
  const { membersList, lastUpdate, refetch, registry, registryData } = props;

  return (
    <>
      {membersList.length ? (
        <>
          <MemberRegistryInfo memberList={membersList} lastUpdate={lastUpdate} />
          <ActionContainer>
            <CSVDownloaderButton registryData={registryData} />
            <SyncUpdateAllDialog
              onSuccess={() => {
                refetch();
              }}
              registry={registry}
              registryData={registryData}
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
