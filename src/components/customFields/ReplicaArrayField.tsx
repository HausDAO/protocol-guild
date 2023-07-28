import { Buildable, ParMd } from "@daohaus/ui";
import { ZERO_ADDRESS } from "@daohaus/utils";
import React, { useEffect, useState } from "react";

import { useFormContext } from "react-hook-form";
import { TARGETS } from "../../targetDao";

export const ReplicaArrayField = (props: Buildable<{}>) => {
  const { watch, setValue } = useFormContext();
  const [replica, chainID, domainID] = watch([
    "replica",
    "chainID",
    "domainID"
  ]);
  const [errorText, setErrorText] = useState<string | null>(null);


  useEffect(() => {
    if (!replica || !chainID || !domainID) {
      return;
    }
    if (replica === ZERO_ADDRESS) {
      setErrorText("Replica cannot be zero address");
      return;
    }
    if (!domainID){
      setErrorText("Domain ID cannot be empty");
      return;
    }
    
    setErrorText(null);
    setValue(
      "replicaData",
      [domainID, replica, ZERO_ADDRESS]
    );
  }, [replica, chainID, domainID]);

  if (!errorText) {
    return null;
  }

  return <ParMd style={{color: "red"}}>{errorText}</ParMd>;
};
