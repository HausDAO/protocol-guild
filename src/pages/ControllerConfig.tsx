import React from "react";

import { useParams } from "react-router-dom";
import { ControllerHomeForm } from "../components/ControllerHomeForm";
import { TARGETS } from "../targetDao";
import { ControllerReplicaForm } from "../components/ControllerReplicaForm";
import { ParLg, SingleColumnLayout } from "@daohaus/ui";

export const ControllerConfig = () => {
  const { chainID } = useParams<{ chainID: string }>();

  return (
    <SingleColumnLayout>
      <ParLg>TODO: Split transfer status</ParLg>
      <ParLg>TODO: Transfer Control</ParLg>
      <ParLg>TODO: Cancel transfer</ParLg>

      {chainID == TARGETS.NETWORK_ID ? (
        <ControllerHomeForm />
      ) : (
        <ControllerReplicaForm chainId={chainID} />
      )}
    </SingleColumnLayout>
  );
};
