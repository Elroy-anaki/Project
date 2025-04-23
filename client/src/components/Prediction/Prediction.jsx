import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

function Prediction() {
  const { serialNumber, inputValues, setInputValues } =
    useContext(SharedContext);

  const [chosenInput, setChosenInput] = useState("")
  const [result, setResult] = useState(null)

  const {mutate: predict} = useMutation({
    mutationKey:["predict"],
    mutationFn: async() => {
      const { data } = await axios.get(``)
      setResult(data.data)
      return data
    }
  })

  return (
    <>
      <dialog id="prediction" className="modal">
        <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none px-10">
          {/* Close Button */}
          <button
            id="close-modal-mes"
            type="button"
            className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-white font-bold border-none hover:bg-rose-600 transition"
            onClick={() => {
              document.getElementById("prediction").close();
              setInputValues([]);
            }}
          >
            X
          </button>
          <h2 className="text-black text-4xl text-center">Prediction</h2>
          <div className="w-1/3">
          <label htmlFor="input_value" className="text-black text-2xl">Choose Input Value</label>
          <select id="input_value" className="w-full text-black p-2 mt-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" onChange={(e) => {
            setChosenInput(e.target.value)
          }}>
            {inputValues.length > 0 ? (
              inputValues.map((inputValue, index) => (
                <option className="text-black" key={index} value={inputValue}>
                  {inputValue}
                </option>
              ))
            ) : (
              <option disabled>אין ערכים להצגה</option>
            )}
          </select>{" "}
          
          </div>
          <div>
            <h2 className="text-black text-3xl">Result</h2>
          <div className="w-full mx-auto border-2 border-black rounded-xl mt-10">
            fmkdmf;p
          </div>
          </div>
          
        </div>
      </dialog>
    </>
  );
}

export default Prediction;
