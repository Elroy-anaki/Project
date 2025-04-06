import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export const Table = () => {
  // הגדרת הנתונים
  const data = useMemo(
    () => [
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
      {
        serialNumber: "07448",
        deviceName: "Example",
        model: "-",
        deviceFeatures: "range 75-100 mm",
      },
    ],
    []
  );

  // הגדרת העמודות
  const columns = useMemo(
    () => [
      {
        header: "Serial Number",
        accessorKey: "serialNumber",
        cell: (info) => (
          <span className="text-cyan-700 font-medium">{info.getValue()}</span>
        ),
      },
      {
        header: "Name",
        accessorKey: "deviceName",
      },
      {
        header: "Model",
        accessorKey: "model",
      },
      {
        header: "Device Features",
        accessorKey: "deviceFeatures",
      },
      {
        header: "Action",
        accessorKey: null,
        cell: () => (
          <button className="text-cyan-700 font-medium bg-white rounded-lg border-2 border-cyan-700 px-2 py-1">
            View
          </button>
        ),
      },
    ],
    []
  );

  // יצירת הטבלה
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
                className="border-2 border-gray-300 p-2 text-center bg-gray-200"
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
                className="border-2 border-gray-300 p-1.5 bg-white text-center"
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
