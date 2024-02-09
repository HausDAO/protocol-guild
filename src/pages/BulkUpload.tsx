import { useState } from "react";
import styled from "styled-components";
import {
  Divider,
  HelperText,
  ParLg,
  ParMd,
  SingleColumnLayout,
  Spinner,
} from "@daohaus/ui";

import { CsvUploader } from "../components/CsvUploader";
import { MemberProposalDialog } from "../components/MemberRegistry";
import { MemberImportTable } from "../components/MemberTable";
import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { useNetworkRegistry } from "../hooks/useRegistry";
import { StagingMember } from "../types/Member.types";
import { MAX_RECORDS_PER_PROPOSAL } from "../utils/constants";
import { HAUS_RPC, ValidNetwork } from "../utils/keychain";

const StyledDivider = styled(Divider)`
  margin: 2rem 0;
`;

const ActionsContainer = styled.div`
  margin: 3rem;
`;

export const BulkUpload = () => {
  const registry = useCurrentRegistry();
  const { daoChain, registryAddress, replicaChains } = registry;
  const { isIdle, isLoading, error, data, refetch } = useNetworkRegistry({
    chainId: daoChain as ValidNetwork,
    registryAddress,
    replicaChains,
    rpcs: HAUS_RPC,
  });

  const [memberList, setMemberList] = useState<StagingMember[]>([]);

  const handleSuccess = () => {
    setMemberList([]);
    // setStageMemberList([]);
    refetch();
  };

  return (
    <SingleColumnLayout title="Member Registry - Bulk Upload">
      <ParMd>
        Upload a CSV file with the following column headers:
      </ParMd>
      <ParMd>
        address, multiplier, startDate
      </ParMd>
      <StyledDivider />

      {isLoading && <Spinner />}

      {data && <CsvUploader setMemberList={setMemberList} registryData={data}/>}

      {memberList.length > 0 && (
        <>
          <ParLg>count: {memberList.length}</ParLg>
          <MemberImportTable memberList={memberList} />
          <ActionsContainer>
            {memberList.length <= MAX_RECORDS_PER_PROPOSAL ? (
              <MemberProposalDialog
                onSuccess={handleSuccess}
                registry={registry}
                stageMemberList={memberList}
              />
            ) : (
              <HelperText>
                {`There are too many members to submit on a single proposal. Please upload a smaller
                list (max ${MAX_RECORDS_PER_PROPOSAL} members).`}
              </HelperText>
            )}
          </ActionsContainer>
        </>
      )}
    </SingleColumnLayout>
  );
};
