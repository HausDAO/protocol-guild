import styled from "styled-components";
import { useDHConnect } from "@daohaus/connect";
import { useCurrentDao } from "@daohaus/moloch-v3-hooks";
import { SingleColumnLayout, Spinner } from "@daohaus/ui";

import { MemberRegistry } from "../components/MemberRegistry/MemberRegistry";
import { useMemberRegistry } from "../hooks/useRegistry";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "../utils/keychain";

const LinkBox = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-between;
`;

export const Home = () => {

  const { address } = useDHConnect();
  const daochain = TARGETS.NETWORK_ID;
  
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISTRY_ADDRESS,
    chainId: daochain,
    rpcs: HAUS_RPC,
  });

  return (
    <SingleColumnLayout
      title="Protocol Guild Member Registry"
      description={`Protocol guild keeps a onchain registry of active members which is updated periodically to track member activity. This registry informs the automatic compensation distro.`}
    >
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <>
          <MemberRegistry
            membersList={data.membersSorted}
            lastUpdate={data.lastUpdate}
            refetch={refetch}
          />
        </>
      )}
    </SingleColumnLayout>
  );
};
