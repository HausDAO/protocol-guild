import { CSSProperties, useState } from "react";
import { useCSVReader } from "react-papaparse";
import styled from "styled-components";
import { Button, ErrorText, HelperText } from "@daohaus/ui";

import { StagingMember } from "../types/Member.types";
import { RegistryData } from "../utils/registry";
import { isEthAddress } from "@daohaus/utils";

interface CsvData {
  address: string;
  modifier: number;
  startDate: string;
}

const styles = {
  progressBarBackgroundColor: {
    backgroundColor: "red",
  } as CSSProperties,
};

const ActionContainer = styled.div`
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

interface CsvUploaderProps {
  registryData: RegistryData;
  setMemberList: (memberList: Array<StagingMember>) => void;
}

export const CsvUploader = ({
  registryData,
  setMemberList,
}: CsvUploaderProps) => {
  const { CSVReader } = useCSVReader();
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean | null>(null);

  const validateCsvData = (csvData: string[][]): string | null => {
    const hasHeader = csvData.length > 0 &&
      csvData[0].every(el => ["address", "multiplier", "startDate"].includes(el));
    if (!hasHeader) {
      return "CSV does not have the required column headers";
    }
    const isValid = csvData.every((row) => row.length === 3);
    if (!isValid) {
      return "Invalid number of columns in CSV data";
    }

    const accounts: Array<string> = [];

    for (const row of csvData.slice(1) as []) {
      if (
        !row[0] ||
        typeof row[0] !== "string" ||
        !isEthAddress(row[0])
      ) {
        return `Invalid address in CSV data (value: ${row[0]})`;
      }
      const address = (row[0] as string).toLowerCase();
      if (accounts.includes(address)) {
        return `Duplicate address in CSV data (${address})`
      }
      accounts.push(address);
      const multiplier = Number(row[1]);
      if (
        !row[1] ||
        isNaN(multiplier) ||
        multiplier < 0 ||
        multiplier > 100
      ) {
        return `Invalid multiplier in CSV data (value: ${row[1]})`;
      }
      const startDate = Number(row[2]);
      if (
        !row[2] ||
        isNaN(startDate) ||
        startDate <= 0
      ) {
        return `Invalid startDate in CSV data (value: ${row[2]})`;
      }
    }
    return null;
  };

  const hydrateMemberList = (csvData: []): StagingMember[] => {
    const memberList: StagingMember[] = csvData.slice(1).map((row) => {
      const account = String(row[0]);
      const member = registryData.members.find(
        (m) => m.account === account
      );
      return {
        account,
        activityMultiplier: Number(row[1]),
        startDate: Number(row[2]),
        isNewMember: !member,
      };
    });
    return memberList;
  };

  const uploadRejected = () => {
    setCsvData([]);
    setRejected(true);
    setMemberList([]);
    setError(null);
  };

  return (
    <CSVReader
      config={{
        skipEmptyLines: true,
      }}
      onUploadAccepted={(results: any) => {
        setCsvData(results);
        setRejected(false);

        try {
          const validationError = validateCsvData(results.data);
          if (validationError) {
            setError(validationError);
          } else {
            setCsvData(csvData);
            setMemberList(hydrateMemberList(results.data));
            setError(null);
          }
        } catch (error) {
          setError("Failed to parse CSV file");
        }
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
      }: any) => {
        return (
          <>
            <ActionContainer>
              {!rejected && <HelperText>{acceptedFile && acceptedFile.name}</HelperText>}
              <Button {...getRootProps()} disabled={rejected === false}>Browse File</Button>
              <Button onClick={uploadRejected} variant="outline" disabled={!acceptedFile}>
                Clear
              </Button>
            </ActionContainer>
            <ProgressBar style={styles.progressBarBackgroundColor} />
            {error && <ErrorText>{error}</ErrorText>}
          </>
        );
      }}
    </CSVReader>
  );
};
