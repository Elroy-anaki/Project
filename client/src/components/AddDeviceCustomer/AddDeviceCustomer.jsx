import React, { useContext, useState } from "react";
import Form from "./Form";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";


export function AddDeviceCustomer() {
  const [deviceCustomerDetails, setDeviceCustomerDetails] = useState({});
  const {customer} = useContext(AuthContext)
  const queryClient = useQueryClient();


  const handelChange = (e) => {
    setDeviceCustomerDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const { mutate: createDeviceCustomer } = useMutation({
    mutationKey: ["createDeviceCustomer"],
    mutationFn: async (data) => await axios.post("device-customers/", data),
    onSuccess: () => {

      alert("Added succefully!")
      queryClient.invalidateQueries({queryKey: ["getDevicesCustomers"]})
    
      
    },
    onError: () => alert("Something get wrong..."),
  });

  return (
    <>
      
      <dialog id="add-device-customer" className="modal">
        <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl">
          <h3 className="font-bold text-xl text-cyan-700">
            Add New Device Customer
          </h3>
          <p className="py-2 text-gray-600">
            Fill the form below to add a new device customer.
          </p>

          <div className="py-2">
            <Form onChange={handelChange} />
          </div>

          <div className="modal-action">
            <form
              method="dialog"
              className="flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                deviceCustomerDetails.customer_id = customer.id
                createDeviceCustomer(deviceCustomerDetails);
                console.log(deviceCustomerDetails)
                document.getElementById("close-modal").click()
              }}

            >
              <button
                type="submit"
                className="btn bg-cyan-700 text-white border-none  hover:bg-cyan-800 transition"
              >
                Add
              </button>
              <button
              id="close-modal"
                type="button"
                className="btn bg-rose-500 text-black border-none  hover:bg-rose-600 transition"
                onClick={() =>
                  document.getElementById("add-device-customer").close()
                }
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
