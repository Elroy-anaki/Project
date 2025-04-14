import React, { useContext, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/authContext";

export function Table ({data, columns}) {
  const {} = useContext(AuthContext)

  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="table-auto w-full border-2 border-gray-300">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-2 text-black border-gray-300 p-2 text-center bg-gray-200"
              >
                {flexRender(
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
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border-2 text-black border-gray-300 p-1.5 bg-white text-center"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {/* תחתית פשוטה אחידה */}
      <tfoot>
        <tr className="bg-white">
          <td colSpan={columns.length} className="p-4 text-center border">
            <div className="flex justify-between items-center"></div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
