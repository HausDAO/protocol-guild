import React from "react";
import { convertSeconds } from "../utils/convertSeconds";

const TimeActive = ({ secondsActive }: { secondsActive: number | null }) => {
  return <div>{secondsActive ? convertSeconds(secondsActive) : "No time"}</div>;
};

export default TimeActive;
