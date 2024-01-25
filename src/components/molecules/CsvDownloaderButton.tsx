import { useCSVDownloader } from "react-papaparse";

import { Button } from "@daohaus/ui";

import { RegistryData } from "../../utils/registry";

export const CSVDownloaderButton = ({ registryData } : { registryData: RegistryData }) => {
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <CSVDownloader filename={"registryDataExport"} data={registryData.members}>
      <Button color="secondary" variant="outline" >Download CSV</Button>
    </CSVDownloader>
  );
};
