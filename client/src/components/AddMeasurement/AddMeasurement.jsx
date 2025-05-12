import React, { useContext, useState, useMemo } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import Form from "./Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table } from "../Table/Table";

// measurements
function AddMeasurement() {
  const [measurements, setMeasurements] = useState([]);
  const { serialNumber, mesToAdd, addMeasurementDetails, setMesToAdd, setAddMeasurementDetails, counterMes, setCounterMes } = useContext(SharedContext);
  const [formKey, setFormKey] = useState(0);

  const queryClient = useQueryClient();

  const handelChange = (e) => {
    setAddMeasurementDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // מאפס את הטופס ואת כל המידע הקשור אליו
  const resetForm = () => {
    setMesToAdd([]);
    setAddMeasurementDetails({});
    setCounterMes(0);
    setFormKey(prev => prev + 1);
  };

  const { mutate: addMeasurement } = useMutation({
    mutationKey: ["addMeasurement"],
    mutationFn: async (data) => {
      await axios.post("measurements/", data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getMeasurements"] }),
    onError: () => alert("something get wrong!"),
  });

  const { data: a } = useQuery({
    queryKey: ["getMeasurements", serialNumber],
    queryFn: async () => {
      const { data } = await axios.get(`measurements/${serialNumber}`);
      setMeasurements(data.data);
      return data.data;
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "Serial Number",
        accessorKey: "serial_number",
        cell: (info) => (
          <span className="text-cyan-700 font-medium">{info.getValue()}</span>
        ),
      },
      {
        header: "Measurement Date",
        accessorKey: "measurement_date",
      },
      {
        header: "Input Value",
        accessorKey: "input_value",
      },
      {
        header: "Output Value",
        accessorKey: "output_value",
      },
      {
        header: "Unit 1",
        accessorKey: "unit1",
      },
      {
        header: "Deviation",
        accessorKey: "deviation",
      },
      {
        header: "Tolerance",
        accessorKey: "tolerance",
      },
      {
        header: "Unit 2",
        accessorKey: "unit2",
      },
      {
        header: "Uncertainty",
        accessorKey: "uncertainty",
      },
      {
        header: "Unit 3",
        accessorKey: "unit3",
      },
      {
        header: "Threshold",
        accessorKey: "threshold",
      },
      {
        header: "Identifier",
        accessorKey: "identifier",
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Comments",
        accessorKey: "comments",
      },
    ],
    []
  );

  return (
    <>
      <dialog id="add-measurement" className="modal text-center">
        <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none">
          {/* Close Button */}
          <button
            id="close-modal-mes"
            type="button"
            className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-white font-bold border-none hover:bg-rose-600 transition"
            onClick={() => {
              resetForm();
              document.getElementById("add-measurement").close();
            }}
          >
            X
          </button>

          <div className="flex justify-center items-start gap-10 py-4">
            <div className="text-black">
              <Table columns={columns} data={measurements} />
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-bold text-xl text-cyan-700 mb-1">
                Add a New Measurement
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Fill the form below to add a new measurement
              </p>

              <div className="w-full mt-4">
                <form
                  method="dialog"
                  name="add-measurement"
                  id="add-measurement"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // שלב 1: מפה את mesToAdd לשדות הפלט
                    let mesToAddParsed = {};
                    if (mesToAdd?.length && counterMes < mesToAdd.length) {
                      mesToAddParsed = {
                        input_value: mesToAdd[counterMes]["Nominal torque"]?.value || 0,
                        output_value: mesToAdd[counterMes]["Applied torque"]?.value || 0,
                        deviation: mesToAdd[counterMes]["Permissible deviation"]?.value || "",
                        tolerance: mesToAdd[counterMes]["Permissible deviation"]?.value || "",
                        uncertainty: mesToAdd[counterMes]["Uncertainty"]?.value || "",
                        comments: mesToAdd[counterMes]["comments"]?.value || "",
                        threshold: mesToAdd[counterMes]["Permissible deviation"]?.value || "",
                      };
                    }

                    // שלב 2: מאחד את הנתונים של הטופס עם mesToAdd
                    const fullMeasurement = {
                      ...addMeasurementDetails,
                      ...mesToAddParsed,
                      serial_number: serialNumber,
                    };

                    addMeasurement(fullMeasurement);

                    if (mesToAdd?.length > counterMes && counterMes !== mesToAdd?.length - 1) {
                      setCounterMes(counterMes + 1);
                    } else {
                      resetForm();
                      document.getElementById("add-measurement").close();
                    }
                  }}
                >
                  <Form key={formKey} onChange={handelChange} serialNumber={serialNumber} formKey={formKey} />
                  <button
                    type="submit"
                    className="btn bg-cyan-700 w-full text-white border-none hover:bg-cyan-800 transition"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AddMeasurement;