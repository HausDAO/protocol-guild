import React from "react";
import { useCSVDownloader } from "react-papaparse";
import { useMemberRegistry } from "../hooks/useRegistry";
import { TARGETS } from "../targetDao";
import { HAUS_RPC } from "../pages/Home";
import { Button } from "@daohaus/ui";



export const CSVDownloader = () => {
  const { CSVDownloader, Type } = useCSVDownloader();
  const { isIdle, isLoading, error, data, refetch } = useMemberRegistry({
    registryAddress: TARGETS.REGISRTY_ADDRESS,
    chainId: TARGETS.NETWORK_ID,
    rpcs: HAUS_RPC,
  });

  return (
    <CSVDownloader filename={"filename"} data={data?.members}>
      <Button color="secondary" variant="outline" >Download CSV</Button>
    </CSVDownloader>
  );
};
