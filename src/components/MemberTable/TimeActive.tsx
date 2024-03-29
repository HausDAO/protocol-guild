import React from "react";
import { ParMd } from "@daohaus/ui";
import { convertSeconds } from "../../utils/convertSeconds";

export const TimeActive = ({
  secondsActive,
}: {
  secondsActive: number | null;
}) => {
  return (
    <ParMd>{secondsActive ? convertSeconds(secondsActive) : "No time"}</ParMd>
  );
};
