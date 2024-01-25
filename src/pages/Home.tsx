import { ValidNetwork } from "@daohaus/keychain-utils";
import { SingleColumnLayout, Spinner } from "@daohaus/ui";

import { useCurrentRegistry } from "../hooks/context/RegistryContext";
import { MemberRegistry } from "../components/MemberRegistry/MemberRegistry";
import { useNetworkRegistry } from "../hooks/useRegistry";
import { HAUS_RPC } from "../utils/keychain";

export const Home = () => {

  const registry = useCurrentRegistry();
  const { registryAddress, replicaChains, daoChain } = registry;
  
  const { isIdle, isLoading, error, data, refetch } = useNetworkRegistry({
    chainId: daoChain as ValidNetwork,
    registryAddress,
    replicaChains,
    rpcs: HAUS_RPC,
  });

  return (
    <SingleColumnLayout
      title="Protocol Guild Member Registry"
      description={`
        Protocol guild keeps a onchain registry of active members which is updated periodically to track member activity.
        This registry informs the automatic compensation distro.`
      }
    >
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <>
          <MemberRegistry
            membersList={data.membersSorted}
            lastUpdate={data.lastActivityUpdate}
            refetch={refetch}
            registry={registry}
            registryData={data}
          />
        </>
      )}
    </SingleColumnLayout>
  );
};
