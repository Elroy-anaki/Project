import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

function Prediction() {
  const { serialNumber, inputValues, setInputValues } =
    useContext(SharedContext);

  const [chosenInputValue, setChosenInputValue] = useState("");
  const [result, setResult] = useState(null);

  const { mutate: predict } = useMutation({
    mutationKey: ["predict"],
    mutationFn: async () => {
      const { data } = await axios.get(``);
      setResult(data.data);
      return data;
    },
  });
  const { mutate: prdeict } = useMutation({
    mutationKey: ["predict"],
    mutationFn: async () => {
      const { data } = await axios.get(
        `/measurements/${serialNumber}/${chosenInputValue}/predict-calibration`
      );
      setResult(data.data);
      console.log(data.data);
      return data;
    },
  });

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
              setResult(null)
            }}
          >
            X
          </button>
          <h2 className="text-black text-4xl text-center">Prediction</h2>
          <div className="w-1/3">
            <label htmlFor="input_value" className="text-black text-2xl">
              Choose Input Value
            </label>
            <div className="flex justify-between items-center gap-4">
              <select
                id="input_value"
                className="w-full text-black p-2 mt-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                onChange={(e) => {
                  setChosenInputValue(e.target.value);
                }}
              >
                {inputValues.length > 0 ? (
                  inputValues.map((inputValue, index) => (
                    <option
                      className="text-black"
                      key={index}
                      value={inputValue}
                    >
                      {inputValue}
                    </option>
                  ))
                ) : (
                  <option disabled>אין ערכים להצגה</option>
                )}
              </select>{" "}
              <button
                onClick={prdeict}
                className="px-3 py-2 mt-4 bg-cyan-700 rounded-xl text-white cursor-pointer"
              >
                Predict
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-black text-3xl text-center">Result</h2>
            {result && (
  <div className="w-1/2 mx-auto  border-2 border-black mt-10">
    <table className="min-w-full divide-y divide-x divide-gray-300 text-center text-black ">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-1.5 text-lg font-semibold">Parameter</th>
          <th className="px-3 py-1.5 text-lg font-semibold">Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {[
          ["a", result.a],
          ["b", result.b],
          ["u²a", result.u2a],
          ["u²b", result.u2b],
          ["cov(a,b)", result["cov(a,b)"]],
          ["chi² stat", result.chi2_stat],
          ["n", result.n],
          ["df", result.df],
          ["chi² quantil 95", result.chi2_quantil_95],
          ["status", result.status],
          ["R²", result.R2],
        ].map(([key, value]) => (
          <tr key={key}>
            <td className="px-6 py-4 font-medium">{key}</td>
            <td className="px-6 py-4">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

          </div>
        </div>
      </dialog>
    </>
  );
}

export default Prediction;
