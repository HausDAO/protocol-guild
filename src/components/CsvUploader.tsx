import React, { CSSProperties, useState } from "react";
import { useCSVReader } from "react-papaparse";
import { Member } from "../types/Member.types";
interface CsvData {
  address: string;
  modifier: number;
  startDate: string;
}

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: "20%",
  } as CSSProperties,
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: "red",
  } as CSSProperties,
};

interface CsvUploaderProps {
  setMemberList: (memberList: Member[]) => void;
}

export const CsvUploader = (props: CsvUploaderProps) => {
  const { CSVReader } = useCSVReader();
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateCsvData = (
    csvData: string[][]
  ): string | null => {
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

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setCsvData(results);

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

        console.log("---------------------------");
        console.log(results);
        console.log("---------------------------");
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
        <>
          <div style={styles.csvReader}>
            <button type="button" {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
          {error && <p>{error}</p>}
        </>
      )}
    </CSVReader>
  );
};
