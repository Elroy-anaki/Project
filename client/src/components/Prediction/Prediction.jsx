import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

function Prediction() {
  const { serialNumber, inputValues, setInputValues } =
    useContext(SharedContext);

  const [chosenInputValue, setChosenInputValue] = useState("");
  const [result, setResult] = useState(null);

  
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
    <dialog id="prediction" className="modal">
      <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-5/6 max-w-none px-10">
        {/* כפתור סגירה */}
        <button
          id="close-modal-mes"
          type="button"
          className="absolute cursor-pointer top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
          onClick={() => {
            document.getElementById("prediction").close();
            setInputValues([]);
            setResult(null);
          }}
        >
          ✕
        </button>
  
        <h2 className="text-black text-4xl text-center font-bold mb-4">
          Prediction
        </h2>
  
        <div className="w-full flex flex-col md:flex-row gap-6 items-center justify-center mb-10">
          <div className="w-full md:w-1/2">
            <label htmlFor="input_value" className="block text-black text-xl mb-2 font-semibold">
              Choose Input Value
            </label>
            <select
              id="input_value"
              className="w-full text-black p-3 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onChange={(e) => setChosenInputValue(e.target.value)}
            >
              {inputValues.length > 0 ? (
                inputValues.map((inputValue, index) => (
                  <option key={index} value={inputValue}>
                    {inputValue}
                  </option>
                ))
              ) : (
                <option disabled>אין ערכים להצגה</option>
              )}
            </select>
          </div>
  
          <button
            onClick={prdeict}
            className="h-fit cursor-pointer mt-2 md:mt-8 px-6 py-3 bg-cyan-700 text-white rounded-xl font-medium hover:bg-cyan-800 transition"
          >
            Predict
          </button>
        </div>
  
        {result && (
          <>
            <h2 className="text-black text-3xl text-center font-semibold mb-3">Result</h2>
            <div className="flex justify-center items-center gap-20">
            <div className="w-1/2 overflow-x-auto border-2 border-black rounded-xl mb-10 flex justify-between gap-20 items-center">
              <table className="min-w-full divide-y divide-x divide-gray-300 text-center text-black">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-lg font-semibold">Parameter</th>
                    <th className="px-4 py-2 text-lg font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
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
                      <td className="px-4 py-3 font-medium">{key}</td>
                      <td className="px-4 py-3">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="">
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Calibration Chart"
                className="max-w-full h-[580px] rounded-xl border border-gray-300 shadow-md"
              />
            </div>
            </div>
            
          </>
        )}
      </div>
    </dialog>
  );
  
}

export default Prediction;
