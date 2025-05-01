import React, { useContext, useMemo, useState } from "react";
import { Table } from "../Table/Table";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import { SharedContext } from "../../contexts/sharedContext";

function Dashboard() {
  const queryClient = useQueryClient();
  const { customer } = useContext(AuthContext);
  const {
    setSerialNumber,
    getAllInputValuesBySerialNumber,
    gtAllIdentifiersBySerialNumber,
    setMesToAdd,
  } = useContext(SharedContext);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile); // הדפסת הקובץ שנבחר
    } else {
      console.log("No file selected");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected to upload");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      console.log("Uploading file..."); // הודעה לפני העלאה
      const response = await axios.post(
        `/measurements/upload-pdf/${customer.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      queryClient.invalidateQueries({ queryKey: ["getDevicesCustomers"] });
      // setSerialNumber(response.data.data.first_page['Serial Number'])
      setSerialNumber("12345");
      document.getElementById("add-measurement").showModal();
      console.log(
        "serialNumber:",
        response.data.data.first_page["Serial Number"]
      );
      const mesTo = response.data.data.measurements;
      const mess = mesTo.map((mes) => ({
        ...mes,
        comments: {
          value: response.data.data.first_page["Calibration Certificate No"],
        },
      }));
      console.log("mess", mess);
      // mesTo["comments"] = {value: response.data.data.first_page['Calibration Certificate No']}
      setMesToAdd(mess);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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
                document
                  .getElementById("write-calibration-certificate")
                  .showModal();
                break;
              case "predictNonexisting":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document
                  .getElementById("predict-nonexisting-modal")
                  .showModal();
                break;
              case "compareUncertainties":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document
                  .getElementById("compare-deviations-uncertainties")
                  .showModal();
                break;
              case "validation":
                getAllInputValuesBySerialNumber(row.serialNumber);
                gtAllIdentifiersBySerialNumber(row.serialNumber);
                document.getElementById("validation").showModal();
                break;

              default:
                break;
            }
          };

          return (
            <div className="flex justify-between">
              <select
                defaultValue=""
                onChange={handleActionChange}
                className="border border-cyan-700 rounded-lg px-4 py-2 bg-white text-cyan-700 font-semibold hover:bg-cyan-700 hover:text-white transition"
              >
                <option value="" disabled>
                  Select Action
                </option>
                <option value="prediction">Prediction</option>
                <option value="uncertainty">Uncertainty</option>
                <option value="calibrationInterval">
                  Calibration Interval
                </option>
                <option value="writeCertificate">
                  Write Calibration Certificate
                </option>
                <option value="predictNonexisting">
                  Predict for Nonexisting Input
                </option>
                <option value="compareUncertainties">
                  Compare Deviations Uncertainties
                </option>
                <option value="validation">Validation</option>
              </select>
              <button
                value="view"
                onClick={() => {
                  setSerialNumber(row.serialNumber);
                  document.getElementById("add-measurement").showModal();
                }}
                className="border border-cyan-700 rounded-lg px-4 py-2 bg-white text-cyan-700 font-semibold hover:bg-cyan-700 hover:text-white transition"
              >
                View
              </button>
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
          <h3 className="text-xl font-bold">Choose a Device</h3>
          <div className="flex gap-3 flex-wrap">
            <button
              className="h-12 min-w-[150px] text-white px-5 text-base bg-cyan-700 font-semibold rounded-lg cursor-pointer hover:bg-cyan-600"
              onClick={() =>
                document.getElementById("add-device-customer").showModal()
              }
            >
              Add New Device +
            </button>

            <button
              className="h-12 min-w-[150px] text-white px-5 text-base bg-cyan-700 font-semibold rounded-lg cursor-pointer hover:bg-cyan-600"
              onClick={() => document.getElementById("summarize").showModal()}
            >
              Overview Data
            </button>

            {/* File input group */}
            <div className="flex">
              <label
                htmlFor="file-upload"
                className="h-12 min-w-[150px] flex items-center justify-center px-5 text-base bg-green-600 text-white rounded-l-lg cursor-pointer hover:bg-green-500 border-2 border-white whitespace-nowrap"
              >
                Choose PDF File
              </label>

              <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && <button
                onClick={handleUpload}
                className="h-11.5 min-w-[150px] px-5 text-base bg-green-600 text-white rounded-r-lg cursor-pointer hover:bg-green-500 flex items-center justify-center overflow-hidden whitespace-nowrap"
              >
                {file.name}
              </button>}
              
            </div>
          </div>
        </div>

        {/* Table remains unchanged */}
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}

export default Dashboard;
