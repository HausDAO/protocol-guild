import styled from "styled-components";

import { SingleColumnLayout, Spinner } from "@daohaus/ui";
import { useDHConnect } from "@daohaus/connect";
import { useMemberRegistry } from "../hooks/useRegistry";
import { useCurrentDao } from "@daohaus/moloch-v3-hooks";
import { MemberRegistry } from "../components/MemberRegistry/MemberRegistry";
import { Trigger } from "../components/MemberRegistry/Trigger";
// import { TriggerAndDistro } from "../components/TriggerAndDistro";

const LinkBox = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-between;
`;

export const HAUS_RPC = {
  "0x1": `https://787b6618b5a34070874c12d7157e6661.eth.rpc.rivet.cloud/`,
  "0x5": `https://787b6618b5a34070874c12d7157e6661.goerli.rpc.rivet.cloud/`,
  "0x64": "https://rpc.gnosischain.com/",
  "0xa": "https://mainnet.optimism.io",
  "0x89": "https://polygon-rpc.com/",
  "0xa4b1": "https://arb1.arbitrum.io/rpc",
  "0xa4ec": "https://forno.celo.org",
};

export const Home = () => {
  const { daoChain, daoId } = useCurrentDao();
  const { chainId, provider, address } = useDHConnect();
  const daochain = "0x5";
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: "0xBe87eB4a8B3C2b1142D9Baa022FC861D445a4cf4", // get from contracts
    userAddress: address,
    chainId: daochain,
    rpcs: HAUS_RPC,
  });
  console.log("isLoading", isLoading);
  console.log("daoId", daoId);

  console.log("data", data);
  return (
    <SingleColumnLayout
      title="Protocol Guild Member Registry"
      description={`Protocol guild keeps a onchain registry of active members which is updated periodically to track member activity. This registry informs the automatic compensation distro.`}
    >
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <>
          <MemberRegistry
            membersList={data.members}
            membersSorted={data.membersSorted}
            lastUpdate={data.lastUpdate}
          />
        </>
      )}
    </SingleColumnLayout>
  );
};
