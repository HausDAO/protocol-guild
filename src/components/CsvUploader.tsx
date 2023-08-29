import React, { CSSProperties, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Member } from "../types/Member.types";
import { Button, ErrorText, HelperText } from "@daohaus/ui";
import styled from "styled-components";
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
  gap: 2rem;
  margin-bottom: 2rem;
`;

interface CsvUploaderProps {
  setMemberList: (memberList: Member[]) => void;
}

export const CsvUploader = (props: CsvUploaderProps) => {
  const { CSVReader } = useCSVReader();
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean | null>(null);

  const validateCsvData = (csvData: string[][]): string | null => {
    const isValid = csvData.every((row) => row.length === 3);
    if (!isValid) {
      return "Invalid number of columns in CSV data";
    }

    for (const row of csvData as []) {
      if (!row[0] || typeof row[0] !== "string") {
        return "Invalid address in CSV data";
      }
      const modifier = Number(row[1]);
      if (
        !row[1] ||
        typeof modifier !== "number" ||
        modifier < 0 ||
        modifier > 100
      ) {
        return "Invalid modifier in CSV data";
      }
      const startDate = Number(row[2]);
      if (!row[2] || typeof startDate !== "number") {
        return "Invalid start date in CSV data";
      }
    }
    return null;
  };

  const hydrateMemberList = (csvData: []): Member[] => {
    const memberList: Member[] = csvData.slice(1).map((row) => {
      return {
        account: String(row[0]),
        activityMultiplier: Number(row[1]),
        secondsActive: 0,
        startDate: Number(row[2]),
      };
    });
    return memberList;
  };

  const uploadRejected = () => {
    setCsvData([]);
    setRejected(true);
    props.setMemberList([]);
    setError(null);
  };

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setCsvData(results);
        setRejected(false);

        try {
          const validationError = validateCsvData(results.data);
          if (validationError) {
            setError(validationError);
          } else {
            setCsvData(csvData);
            props.setMemberList(hydrateMemberList(results.data));
            setError(null);
          }
        } catch (error) {
          setError("Failed to parse CSV file");
        }
      }}
    >
      {({
        getRootProps,
        getRemoveFileProps,
        acceptedFile,
        ProgressBar,
      }: any) => {
        return (
          <>
            <ActionContainer>
              <Button {...getRootProps()}>Browse File</Button>
              {!rejected && (
                <>

                  <HelperText>{acceptedFile && acceptedFile.name}</HelperText>
                  <Button onClick={uploadRejected} variant="outline">
                    Clear
                  </Button>
                </>
              )}
            </ActionContainer>
            <ProgressBar style={styles.progressBarBackgroundColor} />
            {error && <ErrorText>{error}</ErrorText>}
          </>
        );
      }}
    </CSVReader>
  );
};
