import React from "react";
import { useDHConnect } from "@daohaus/connect";
import { Card, ParMd, SingleColumnLayout, Spinner } from "@daohaus/ui";

import { homePageCopy } from "../assets/protocol-guild-copy";
import { GatedButton } from "../components/GatedButton";
import { Trigger } from "../components/Trigger";
import { TXBuilder } from "@daohaus/tx-builder";
import { CONTRACT } from "../legos/contract";
import { useMemberRegistry } from "../hooks/useRegistry";
import { MemberInfo } from "../components/MemberInfo";
import { MemberTable } from "../components/MemberTable";
import { TriggerAndDistro } from "../components/TriggerAndDistro";
import { MemberRegistry } from "../components/MemberRegistry";

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
  const { chainId, provider, address } = useDHConnect();
  const daochain = "0x5";
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: "0xBe87eB4a8B3C2b1142D9Baa022FC861D445a4cf4", // get from contracts
    userAddress: address,
    chainId: "0x5",
    rpcs: HAUS_RPC,
  });

  const isConnectedToDao =
    chainId === daochain
      ? true
      : "You are not connected to the same network as the DAO";
  console.log("data", data);

  return (
    <TXBuilder
      provider={provider}
      chainId="0x5"
      daoId="0x7839755b77aadcd6a8cdb76248b3dddfa9b7f5f1"
      safeId="0xaccd85e73639b5213a001630eb2512dbd6292e32"
      appState={{}}
    >
      <SingleColumnLayout
        title={homePageCopy.title}
        description={homePageCopy.description}
      >
        {isLoading && <Spinner />}
        {!isLoading && data && (
          <MemberRegistry
            membersList={data.members}
            lastUpdate={data.lastUpdate}
          ></MemberRegistry>
        )}
      </SingleColumnLayout>
    </TXBuilder>
  );
};
