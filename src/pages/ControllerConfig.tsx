import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { ParLg, Select, SingleColumnLayout } from "@daohaus/ui";

import { ControllerHomeForm } from "../components/ControllerHomeForm";
import { ControllerReplicaForm } from "../components/ControllerReplicaForm";
import { useCurrentRegistry } from "../hooks/context/RegistryContext";

export const ControllerConfig = () => {
  const { chainID } = useParams<{ chainID: string }>();
  const [formOption, setFormOption] = useState(null);
  const { daoChain, networkName, replicaChains } = useCurrentRegistry();

  const handleChange = (e: any) => {
    setFormOption(e.target.value);
  };

  const netName = daoChain === chainID
    ? networkName
    : replicaChains.find(c => c.NETWORK_ID === chainID)?.NETWORK_NAME

  return (
    <SingleColumnLayout title="0xSplit - Manage Controller">
      <ParLg style={{marginBottom: '2rem'}}>Network: {netName}</ParLg>

      <Select
        id="select"
        onChange={handleChange}
        options={[
          {
            name: "Select an Action",
            value: "",
          },
          {
            name: "Accept Control",
            value: "Accept Control",
          },
          {
            name: "Transfer Control",
            value: "Transfer Control",
          },
          {
            name: "Cancel Transfer",
            value: "Cancel Transfer",
          },
        ]}
      />

      {formOption && (
        chainID == daoChain ? (
          <ControllerHomeForm option={formOption} />
        ) : (
          <ControllerReplicaForm option={formOption} chainId={chainID} />
        )
      )}
    </SingleColumnLayout>
  );
};
