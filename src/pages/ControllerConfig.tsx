import React from "react";

import { useParams } from "react-router-dom";
import { ControllerHomeForm } from "../components/ControllerHomeForm";
import { TARGETS } from "../targetDao";
import { ControllerReplicaForm } from "../components/ControllerReplicaForm";
import { ParLg, Select, SingleColumnLayout } from "@daohaus/ui";

export const ControllerConfig = () => {
  const { chainID } = useParams<{ chainID: string }>();
  const [formOption, setFormOption] = React.useState(null);

  const handleChange = (e: any) => {
    setFormOption(e.target.value);
  };

  return (
    <SingleColumnLayout>
      <ParLg>TODO: Split transfer status</ParLg>

      <Select
        id="select"
        onChange={handleChange}
        options={[
          {
            name: "Select",
            value: "na",
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

      {chainID == TARGETS.NETWORK_ID ? (
        <ControllerHomeForm option={formOption} />
      ) : (
        <ControllerReplicaForm option={formOption} chainId={chainID} />
      )}
    </SingleColumnLayout>
  );
};
