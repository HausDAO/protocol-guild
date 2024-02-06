import styled from "styled-components";

import { Checkbox, ParLg } from "@daohaus/ui";

import { MemberRegistryInfo } from "./MemberRegistryInfo";
import { SyncUpdateAllDialog } from "./SyncUpdateAllDialog";
import { MemberTable } from "../MemberTable";
import { CSVDownloaderButton } from "../molecules/CsvDownloaderButton";
import { Member } from "../../types/Member.types";
import { RegistryData } from "../../utils/registry";
import { Registry } from "../../hooks/context/RegistryContext";
import { useMemo, useState } from "react";

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
  const [showAll, toggleShowAll] = useState<boolean | "indeterminate">(false);

  const activeMembers = useMemo(() => {
    return membersList.filter((m) => m.activityMultiplier > 0);
  }, [membersList]);

  return (
    <>
      {membersList.length ? (
        <>
          <MemberRegistryInfo memberList={showAll ? membersList : activeMembers} lastUpdate={lastUpdate} />
          <ActionContainer>
            <Checkbox title="Show Inactive Members" onCheckedChange={(checked) => toggleShowAll(checked)} />
            <CSVDownloaderButton registryData={registryData} />
            <SyncUpdateAllDialog
              onSuccess={() => {
                refetch();
              }}
              registry={registry}
              registryData={registryData}
            />
          </ActionContainer>

          <MemberTable memberList={showAll ? membersList : activeMembers}></MemberTable>
        </>
      ) : (
        <ParLg>No members found</ParLg>
      )}
    </>
  );
};
