import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function PredictNonexistent() {
  const { serialNumber, inputValues, identifiers } = useContext(SharedContext);
  const [chosenInputValue, setChosenInputValue] = useState("");
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [chosenDate, setChosenDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const { mutate: PredictForNonexistingInput } = useMutation({
    mutationKey: ["PredictForNonexistingInput"],
    mutationFn: async (query) => {
      const { data } = await axios.post(
        `measurements/${serialNumber}/predict-for-nonexisting-input`,
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
      <dialog id="predict-nonexisting-modal" className="modal text-center">
        <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-5/6 max-w-none px-10">
          {/* Close Button */}
          <button
            id="close-modal-mes"
            type="button"
            className="absolute top-4 right-4 rounded-full cursor-pointer p-2 bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
            onClick={() => {
              document.getElementById("predict-nonexisting-modal").close();
              setChosenDate("");
              setChosenIdentifier("");
              setError("");
              setResult("");
              setChosenIdentifier("")
            }}
          >
            ✕
          </button>

          <h1 className="text-3xl font-bold text-cyan-700 mb-8">
            Predict for nonexisting input
          </h1>

          <div className="w-full flex flex-col gap-6 items-center justify-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input Value */}
              <div className="flex flex-col">
                <label
                  htmlFor="input_value"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Choose Input Value
                </label>
                <select
                  id="input_value"
                  className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={(e) => setChosenInputValue(e.target.value)}
                  value={chosenInputValue}
                >
                  <option value="">Select value</option>
                  {inputValues.length > 0 ? (
                    inputValues.map((inputValue, index) => (
                      <option key={index} value={inputValue}>
                        {inputValue}
                      </option>
                    ))
                  ) : (
                    <option disabled>There are no options</option>
                  )}
                </select>
              </div>

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

              {/* Date Picker */}
              <div className="flex flex-col">
                <label
                  htmlFor="query_date"
                  className="text-gray-700 font-semibold mb-2"
                >
                  Choose Date
                </label>
                <input
                  type="date"
                  name="query_date"
                  id="query_date"
                  className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    const formattedDate = `${day}/${month}/${year}`;
                    setChosenDate(formattedDate);
                  }}
                />
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={() => {
                const data = {
                  identifier: chosenIdentifier,
                  query_date: chosenDate,
                  query_value: Number(chosenInputValue),
                };
                console.log("data to send:", data);
                PredictForNonexistingInput(data);
              }}
              className="w-fit mt-6 px-8 py-3 bg-cyan-700 text-white text-lg rounded-xl font-semibold hover:bg-cyan-800 transition"
            >
              Predict for nonexisting input
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
                  Prediction Results
                </h2>
                <h3 className="text-2xl text-black">{result.predicted_deviation}</h3>
                <div className="">
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Calibration Chart"
                className="max-w-full h-[580px] rounded-xl border border-gray-300 shadow-md"
              />
            </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

export default PredictNonexistent;
