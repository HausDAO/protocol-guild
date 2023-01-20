import { Buildable, ParMd } from "@daohaus/ui";
import React, { useEffect, useState } from "react";

import { useFormContext } from "react-hook-form";

export const EditArrayField = (props: Buildable<{}>) => {
  const { watch } = useFormContext();
  const [members, activitymods] = watch([
    "members",
    "activitymods"
  ]);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    console.log("members", members);
    console.log("activitymods", activitymods);
    if(!members || !activitymods) {
      return
    }
    if (
      members?.length !== activitymods?.length
    ) {
      setErrorText("All arrays must be the same length");
      return;
    }
    setErrorText(null);
    
  }, [members, activitymods]);

  if (!errorText) {
    return null;
  }

  return <ParMd style={{color: "red"}}>{errorText}</ParMd>;
};
