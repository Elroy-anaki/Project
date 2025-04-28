import React, { useContext, useMemo, useState } from "react";
import { Table } from "../Table/Table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { SharedContext } from "../../contexts/sharedContext";

function Dashboard() {
  const { customer } = useContext(AuthContext);
  const { setSerialNumber, getAllInputValuesBySerialNumber, gtAllIdentifiersBySerialNumber } = useContext(SharedContext);

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
      
          const handleActionChange = (e) => {
            const action = e.target.value;
            setSerialNumber(row.serialNumber);
      
            switch (action) {
              case "view":
                document.getElementById("add-measurement").showModal();
                break;
              case "prediction":
                getAllInputValuesBySerialNumber(row.serialNumber);
                document.getElementById("prediction").showModal();
                break;
              case "uncertainty":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document.getElementById("uncertainty-modal").showModal();
                break;
              case "calibrationInterval":
                document.getElementById("calibration-interval").showModal();
                break;
              case "writeCertificate":
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document.getElementById("write-calibration-certificate").showModal();
                break;
              case "predictNonexisting":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document.getElementById("predict-nonexisting-modal").showModal();
                break;
              case "compareUncertainties":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document.getElementById("compare-deviations-uncertainties").showModal();
                break;
              default:
                break;
            }
          };
      
          return (
            <div className="flex justify-center">
              <select
                defaultValue=""
                onChange={handleActionChange}
                className="border border-cyan-700 rounded-lg px-4 py-2 bg-white text-cyan-700 font-semibold hover:bg-cyan-700 hover:text-white transition"
              >
                <option value="" disabled>Select Action</option>
                <option value="view">View</option>
                <option value="prediction">Prediction</option>
                <option value="uncertainty">Uncertainty</option>
                <option value="calibrationInterval">Calibration Interval</option>
                <option value="writeCertificate">Write Calibration Certificate</option>
                <option value="predictNonexisting">Predict for Nonexisting Input</option>
                <option value="compareUncertainties">Compare Deviations Uncertainties</option>
              </select>
            </div>
          );
        },
      }
      
      
      
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
