import React, { useContext, useMemo, useState } from "react";
import { Table } from "../Table/Table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { SharedContext } from "../../contexts/sharedContext";

function Dashboard() {
  const { customer } = useContext(AuthContext);
  const { setSerialNumber, getAllInputValuesBySerialNumber } = useContext(SharedContext);

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
            <div className="flex flex-col items-center gap-0">
              {/* Top buttons */}
              <div className="flex gap-0 w-96">
                <button
                  onClick={() => {
                    setSerialNumber(row.serialNumber);
                    document.getElementById("add-measurement").showModal();
                  }}
                  className="w-1/2 text-cyan-700 font-medium cursor-pointer bg-white rounded-tl-lg border-t-2 border-l-2 border-cyan-700 px-3 py-2 hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setSerialNumber(row.serialNumber);
                    getAllInputValuesBySerialNumber(row.serialNumber)
                    console.log("GETTTINPUT")
                    document.getElementById("prediction").showModal();
                  }}
                  className="w-1/2 text-cyan-700 font-medium cursor-pointer bg-white rounded-tr-lg border-t-2 border-l-2 border-r-2  border-cyan-700 px-3 py-2 hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                >
                  Prediction
                </button>
              </div>
          
              {/* Bottom buttons */}
              <div className="flex gap-0 w-96">
                <button
                  onClick={() => {
                    setSerialNumber(row.serialNumber);
                    document.getElementById("uncertainty-modal").showModal();
                  }}
                  className="w-1/2 text-cyan-700 font-medium cursor-pointer bg-white rounded-bl-lg border-t-2 border-b-2 border-l-2 border-cyan-700 px-3 py-2 hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                >
                  Uncertainty
                </button>
                <button
                  onClick={() => {
                    setSerialNumber(row.serialNumber);
                    document.getElementById("calibration-interval").showModal();
                  }}
                  className="w-1/2 text-cyan-700 font-medium cursor-pointer bg-white rounded-br-lg border-2 border-cyan-700 px-3 py-2 hover:bg-cyan-700 hover:text-white transition-colors duration-200"
                >
                  Calibration Interval
                </button>
              </div>
            </div>
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
