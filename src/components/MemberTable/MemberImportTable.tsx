import React from "react";
import moment from "moment";
import { DataLg, ParMd, Tooltip } from "@daohaus/ui";
import { RiCheckboxCircleFill } from "react-icons/ri";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { StagingMember } from "../../types/Member.types";
import { MemberProfile } from "./MemberProfile";
import { Table, TableData, TableHead, TableRow } from "./MemberTable.styles";

const columnHelper = createColumnHelper<StagingMember>();

const columns = [
  columnHelper.accessor("newMember", {
    header: () => "New",
    cell: (info) => (
      <>
        {info.getValue() && (
          <Tooltip
            content="New Member to be added to the DAO and registry"
            triggerEl={
              <RiCheckboxCircleFill
                color="hsl(131, 41.0%, 46.5%)"
                size="2rem"
              />
            }
          />
        )}
      </>
    ),
  }),
  columnHelper.accessor("account", {
    header: () => "Address",
    cell: (info) => <MemberProfile address={info.getValue()} />,
  }),
  columnHelper.accessor("activityMultiplier", {
    header: () => "Activity Multiplier",
    cell: (info) => <ParMd>{`${info.renderValue()} %`}</ParMd>,
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

export const MemberImportTable = ({
  memberList,
}: {
  memberList: StagingMember[];
}) => {
  console.log("memberList table", memberList);

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
