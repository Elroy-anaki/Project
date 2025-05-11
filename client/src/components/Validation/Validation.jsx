import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
function Validation() {

    const { serialNumber, inputValues, identifiers } = useContext(SharedContext);
    const [chosenIdentifier, setChosenIdentifier] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");


    const { mutate: percentagePassDeviationUncertaintyValidation } = useMutation({
      mutationKey: ["percentagePassDeviationUncertaintyValidation"],
      mutationFn: async (query) => {
        const { data } = await axios.post(
          `measurements/${serialNumber}/percentage-pass-deviation-uncertainty-validation`,
          query
        );
        return data;
      },
      onError: (e) => {
        setError("There are no measurements to predict with.");
        setResult(null);
      },
      onSuccess: (data) => {
        console.log(data)
        setResult(data.data);
        setError("");
      },
    });

    return (
        <>
          <dialog id="validation" className="modal text-center">
            <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-5/6 max-w-none px-10">
              {/* Close Button */}
              <button
                id="close-modal-mes"
                type="button"
                className="absolute top-4 right-4 rounded-full cursor-pointer p-2 bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
                onClick={() => {
                  document.getElementById("validation").close();
                  setChosenIdentifier("");
                  setResult("");
                  setChosenIdentifier("")
                }}
              >
                ✕
              </button>
    
              <h1 className="text-3xl font-bold text-cyan-700 mb-8">
              Validation
              </h1>
    
              <div className="w-full flex flex-col gap-6 items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
    
                  {/* Identifier */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="identifier"
                      className="text-gray-700 font-semibold mb-2"
                    >
                      Choose Identifier
                    </label>
                    <select
                      id="identifier"
                      className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      onChange={(e) => setChosenIdentifier(e.target.value)}
                      value={chosenIdentifier}
                    >
                      <option value="">Select identifier</option>
                      {identifiers.length > 0 && identifiers[0] !== null ? (
                        identifiers.map((identifier, index) =>
                          identifier !== "" ? (
                            <option key={index} value={identifier}>
                              {identifier}
                            </option>
                          ) : null
                        )
                      ) : (
                        <option disabled>There are no options</option>
                      )}
                    </select>
                  </div>
    

                </div>
    
                {/* Predict Button */}
                <button
                  onClick={() => {
                    const data = {
                      identifier: chosenIdentifier,
                    };
                    console.log("data to send:", data);
                    percentagePassDeviationUncertaintyValidation(data);
                  }}
                  disabled={!chosenIdentifier}
                  className={`w-fit mt-6 px-8 py-3 text-white text-lg rounded-xl font-semibold transition ${
                    !chosenIdentifier
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-cyan-700 hover:bg-cyan-800"
                  }`}
                >
                  Validation
                </button>
    
                {/* Show Error or Result */}
                {error && (
                  <div className="w-full mt-10 bg-red-100 p-6 rounded-2xl shadow-lg text-red-700">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p className="text-lg">{error}</p>
                  </div>
                )}
    
                {result && !error && (
                  <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-700">
                      measurements results
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">input value</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">slope</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">intercept</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">real deviation</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">predicted deviation</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">real uncertainty</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">predicted uncertainty</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">En</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">comparison to 1</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.map((measurement, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-6 py-4">{measurement.input_value}</td>
                              <td className="px-6 py-4">{measurement.slope || '-'}</td>
                              <td className="px-6 py-4">{measurement.intercept || '-'}</td>
                              <td className="px-6 py-4">{measurement.real_deviation || '-'}</td>
                              <td className="px-6 py-4">{measurement.predicted_deviation}</td>
                              <td className="px-6 py-4">{measurement.real_uncertainty}</td>
                              <td className="px-6 py-4">{measurement.predicted_uncertainty}</td>
                              <td className="px-6 py-4">{measurement.En}</td>
                              <td className="px-6 py-4">{measurement.comparison_to_1}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </dialog>
        </>
      );
  
}

export default Validation
