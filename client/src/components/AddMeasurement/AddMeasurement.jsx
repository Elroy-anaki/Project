import React, { useContext, useState } from "react";
import { AddMeasurementContext } from "../../contexts/addMeasurementContext";
import Form from "./Form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// measurements
function AddMeasurement() {
  const [addMeasurementDetails, setAddMeasurementDetails] = useState({});
  const { serialNumber } = useContext(AddMeasurementContext);

  const handelChange = (e) => {
    setAddMeasurementDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const {mutate: addMeasurement} = useMutation({
    mutationKey:["addMeasurement"],
    mutationFn: async (data) => await axios.post("measurements/", data),
    onSuccess: () => alert("added!"),
    onError: () => alert("something get wrong!")
  })

  return (
    <>
      <dialog id="add-measurement" className="modal text-center">
        <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none">
          {/* Close Button */}
          <button
            id="close-modal-mes"
            type="button"
            className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-black border-none hover:bg-rose-600 transition"
            onClick={() => document.getElementById("add-measurement").close()}
          >
            X
          </button>

=          <div className="flex justify-center items-start gap-10 py-4">
            <div className="text-black w-9/12">Table</div>

            <div className="w-3/12 mx-auto flex flex-col items-center">
              <h3 className="font-bold text-xl text-cyan-700 mb-1">
                Add New Device Customer
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Fill the form below to add a new device customer.
              </p>

              <Form onChange={handelChange} serialNumber={serialNumber} />

              <div className="w-full mt-4">
                <form
                  method="dialog"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMeasurement.serial_number = serialNumber
                    console.log("addMeasurementDetails", addMeasurementDetails);
                    addMeasurement(addMeasurementDetails)
                    document.getElementById("close-modal-mes").click();
                  }}
                >
                  <button
                    type="submit"
                    className="btn bg-cyan-700 text-white border-none hover:bg-cyan-800 transition"
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
