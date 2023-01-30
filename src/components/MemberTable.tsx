import React from "react";
import moment from "moment";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Member } from "../types/Member.types";
import { MemberProfile } from "./MemberProfile";
import TimeActive from "./TimeActive";
import { Bold, H2, ParMd } from "@daohaus/ui";

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
];

export const MemberTable = ({ memberList }: { memberList: Member[] }) => {
  const [data] = React.useState(() => [...memberList]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      {...{
        style: {
          width: table.getCenterTotalSize(),
        },
      }}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
