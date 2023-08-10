import React from "react";
import moment from "moment";
import { Bold, DataLg, H2, ParMd } from "@daohaus/ui";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Member } from "../../types/Member.types";
import { MemberProfile } from "./MemberProfile";
import { TimeActive } from "./TimeActive";
import { Table, TableData, TableHead, TableRow } from "./MemberTable.styles";

const columnHelper = createColumnHelper<Member>();

const columns = [
  columnHelper.accessor("account", {
    header: () => "Address",
    cell: (info) => <MemberProfile address={info.getValue()} />,
  }),
  columnHelper.accessor("activityMultiplier", {
    header: () => "Activity Multiplier",
    cell: (info) => <ParMd>{`${info.renderValue()} %`}</ParMd>,
  }),
  columnHelper.accessor("secondsActive", {
    header: () => <span>Time Active</span>,
    cell: (info) => <TimeActive secondsActive={info.renderValue()} />,
  }),
  columnHelper.accessor("startDate", {
    header: "Start Date",
    cell: (info) => (
      <ParMd>
        {info.renderValue()
          ? moment.unix(info.getValue()).format("DD/MM/yyyy")
          : "No Date"}
      </ParMd>
    ),
  }),
  columnHelper.accessor("percAlloc", {
    header: () => <span>Percent</span>,
    cell: (info) => <ParMd>{`${info.renderValue()} %`}</ParMd>,
  }),
];

export const MemberTable = ({ memberList }: { memberList: Member[] }) => {
  
  const [data] = React.useState(() => [...memberList]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                <DataLg>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </DataLg>
              </th>
            ))}
          </tr>
        ))}
      </TableHead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableData key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableData>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};
