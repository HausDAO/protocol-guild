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

const columnHelper = createColumnHelper<Member>();

const columns = [
  columnHelper.accessor("account", {
    header: () => "Activity Multiplier",
    cell: (info) => <MemberProfile address={info.getValue()} />,
  }),
  columnHelper.accessor("activityMultiplier", {
    header: () => "Activity Multiplier",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("secondsActive", {
    header: () => <span>Time Active</span>,
    cell: (info) => <TimeActive secondsActive={info.renderValue()} />,
  }),
  columnHelper.accessor("startDate", {
    header: "Start Date",
    cell: (info) => moment(info.renderValue()).format("dd/MM/yyyy"),
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
    <div>
      <table>
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
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
