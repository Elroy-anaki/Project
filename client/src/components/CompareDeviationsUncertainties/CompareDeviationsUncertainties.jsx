import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function CompareDeviationsUncertainties() {
  const { serialNumber, inputValues, setInputValues, identifiers } =
    useContext(SharedContext);
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [result, setResult] = useState("");

  const { mutate: CompareDeviationsUncertainties } = useMutation({
    mutationKey: ["CompareDeviationsUncertainties"],
    mutationFn: async (query) => {
      const { data } = await axios.post(
        `/measurements/${serialNumber}/compare-deviations-uncertainties`,
        query
      );
      console.log(data.data);
      setResult(data.data[0]);
    },
  });
  return (
    <div>
      <>
        <dialog
          id="compare-deviations-uncertainties"
          className="modal text-center"
        >
          <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none">
            {/* Close Button */}
            <button
              id="close-modal-mes"
              type="button"
              className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-white font-bold border-none hover:bg-rose-600 transition"
              onClick={() => {
                document
                  .getElementById("compare-deviations-uncertainties")
                  .close();
                setChosenIdentifier("");
                setResult("");
              }}
            >
              X
            </button>

            <h1 className="text-3xl font-bold text-cyan-700 mb-8">
              Compare Deviations Uncertainties
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
                      identifiers.map((identifier, index) => {
                        if (identifier !== "") {
                          return (
                            <option key={index} value={identifier}>
                              {identifier}
                            </option>
                          );
                        }
                      })
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
                  console.log("data to sent", data);
                  CompareDeviationsUncertainties(data);
                }}
                disabled={!chosenIdentifier}
                className={`w-fit mt-6 px-8 py-3 text-white text-lg rounded-xl font-semibold transition ${
                  !chosenIdentifier
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-800"
                }`}
              >
                Compare Deviations Uncertainties
              </button>

              {/*  Result */}
              {result && (
  <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black overflow-x-auto">
    <h2 className="text-2xl font-bold mb-4 text-cyan-700">Prediction Results</h2>
    <table className="min-w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-cyan-700 text-white">
        <tr>
          <th className="py-3 px-4 text-center">Field</th>
          <th className="py-3 px-4 text-center">Value</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Input Value</td>
          <td className="py-2 px-4">{result.input_value}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Slope</td>
          <td className="py-2 px-4">{result.slope}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Intercept</td>
          <td className="py-2 px-4">{result.intercept}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Real Deviation</td>
          <td className="py-2 px-4">{result.real_deviation}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Predicted Deviation</td>
          <td className="py-2 px-4">{result.predicted_deviation}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Real Uncertainty</td>
          <td className="py-2 px-4">{result.real_uncertainty}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Predicted Uncertainty</td>
          <td className="py-2 px-4">{result.predicted_uncertainty}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">En</td>
          <td className="py-2 px-4">{result.En}</td>
        </tr>
        <tr className="border-b hover:bg-gray-100 transition-colors">
          <td className="py-2 px-4">Comparison to 1</td>
          <td className="py-2 px-4">
            {result.comparison_to_1 === 1.0 ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

            </div>
          </div>
        </dialog>
      </>
    </div>
  );
}

export default CompareDeviationsUncertainties;
