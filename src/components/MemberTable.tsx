import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Member } from "../types/Member.types";

const columnHelper = createColumnHelper<Member>()

const columns = [
  columnHelper.accessor('account', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('activityMultiplier', {
    header: () => 'Age',
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('secondsActive', {
    header: () => <span>Visits</span>,
  }),
  columnHelper.accessor('startDate', {
    header: 'Status',
  }),
]

export const MemberTable = ({ memberList }: {memberList: Member[]}) => {
  const [data, setData] = React.useState(() => [...memberList])
  console.log('first', memberList)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
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
  )
};
