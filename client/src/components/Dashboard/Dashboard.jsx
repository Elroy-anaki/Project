import React, { useContext, useMemo, useState } from "react";
import { Table } from "../Table/Table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { AddMeasurementContext } from "../../contexts/addMeasurementContext";

function Dashboard() {
  const { customer } = useContext(AuthContext);
  const {setSerialNumber} = useContext(AddMeasurementContext)
  const { data: devices, isLoading } = useQuery({
    queryKey: ["getDevicesCustomers"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/device-customers/${customer.id}/customer`
      );
      return data.data;
    },
  });

  const data = useMemo(
    () =>
      devices?.map((device) => ({
        serialNumber: device.serial_number,
        deviceName: device.device_name,
        model: "-",
        deviceFeatures: device.device_features,
      })) ?? [],
    [devices]
  );

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
        cell: (info) => {
          const row = info.row.original;
          return (
            <button
              onClick={() => {
                setSerialNumber(row.serialNumber);
                alert(row.serialNumber)
                document.getElementById("add-measurement").showModal();
              }}
              className="text-cyan-700 font-medium cursor-pointer bg-white rounded-lg border-2 border-cyan-700 px-2 py-1 hover:bg-cyan-600 hover:text-white"
            >
              View
            </button>
          );
        },
      },
    ],
    []
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="mx-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold ">Choose a Device</h3>
          <button
            className="text-white px-3 py-1.5 bg-cyan-700 font-semibold rounded-lg cursor-pointer hover:bg-cyan-600"
            onClick={() =>
              document.getElementById("add-device-customer").showModal()
            }
          >
            Add New Device +
          </button>
        </div>
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}

export default Dashboard;
