import { useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import styled from "styled-components";

import { DeepDecodedAction } from "@daohaus/tx-builder";
import { Bold, Button, DataMd, Dialog, DialogContent, DialogTrigger, GatedButton } from "@daohaus/ui";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MarkDownContainer = styled.div`
  min-height: 20rem;
  max-height: 20rem;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 5rem;
  border-radius: 5px;
  font-size: 1.5rem;
  font-family: inherit;
`;

export const ExportableFunctionParamsTable = ({
  action,
  index,
}: {
  action: DeepDecodedAction;
  index: number;
}) => {
  const exportableFunctionNames: {[key: string]: string[]} = {
    "syncBatchNewMembers": ["_members", "_activityMultipliers", "_startDates"],
    "syncBatchUpdateMembersActivity": ["_members", "_activityMultipliers"],
    "syncNetworkMemberRegistry": ["_members"],
    "mintShares": ["to", "amount"],
    "burnShares": ["from", "amount"],
  };

  const exportToCSV = useCallback(() => {
    const argNames = exportableFunctionNames[action.name];
    const header = `${argNames.reduce((a, b) => `${a}${a.length ? ',' : ''}${b}`, '')}`;

    const argValues = argNames.map((argName) => {
      const param = action.params.find(p => p.name === argName);
      return (param?.value as string)?.split(',') || [];
    });
    
    const vals = argValues[0]
      .map((_, colIdx) =>
        argValues
          .map(row => row[colIdx])
          .reduce((a, b) => `${a}${a.length ? ',' : ''}${b}`, '')
      ).reduce((a, b) => `${a}${b}\n`, '');

    const data = `${header}\n${vals}`;
    console.log('CSV', data);

    const filename = `${action.name}.csv`;
    const blob = new Blob([data], {type: 'text/csv'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }, [action]);

  if (Object.keys(exportableFunctionNames).includes(action.name)) {
    const argNames = exportableFunctionNames[action.name];
    const header = `|${argNames.map((v) => ` ${v} |`).reduce((a, b) => a + b, '')}`;
    const sep = `|${argNames.map((v) => ` ${'-'.repeat(v.length)} |`).reduce((a, b) => a + b, '')}`;

    const argValues = argNames.map((argName) => {
      const param = action.params.find(p => p.name === argName);
      return (param?.value as string)?.split(',') || [];
    });
    
    const vals = argValues[0]
      .map((_, colIdx) =>
        argValues
          .map(row => row[colIdx])
          .reduce((a, b) => a + ` ${b} |`, '|')
      ).reduce((a, b) => `${a}${b}\n`, '');

    const value = `${header}\n${sep}\n${vals}`;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <ButtonContainer>
            <DataMd className="space">
              <Bold>PARAMETERS</Bold>
            </DataMd>
            <GatedButton
              color="secondary"
              rules={[]}
              style={{ height: '4rem', padding: "0 1rem" }}
            >
              Expand View
            </GatedButton>
          </ButtonContainer>
        </DialogTrigger>

        <DialogContent title={'name' in action ? action.name : "Unexpected Error"}>
          <MarkDownContainer>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </MarkDownContainer>
          <Button size='sm' onClick={() => exportToCSV()}>Export to CSV</Button>
        </DialogContent>
      </Dialog>
    );
  }
};