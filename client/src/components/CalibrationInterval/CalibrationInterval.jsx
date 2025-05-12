import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function CalibrationInterval() {
  const { serialNumber, inputValues, setInputValues, identifiers } =
    useContext(SharedContext);
  const [chosenInputValue, setChosenInputValue] = useState("");
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [chosenRiskFactor, setChosenRiskFactor] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const { mutate: findCalibrationInterval } = useMutation({
    mutationKey: ["findCalibrationInterval"],
    mutationFn: async (query) => {
      const { data } = await axios.post(
        `/measurements/${serialNumber}/calibration-interval`,
        query
      );
      console.log(data.data);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      setResult(data.data);
      setError("");
    }, 
    onError: (e) => {
      setError("There are no measurements to predict with.");
      setResult(null);
    },
  });
  return (
    <div>
      <>
        <dialog id="calibration-interval" className="modal text-center">
          <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none">
            {/* Close Button */}
            <button
              id="close-modal-mes"
              type="button"
              className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-white font-bold border-none hover:bg-rose-600 transition"
              onClick={() =>{
                document.getElementById("calibration-interval").close()
                setResult(null)
                setError(null)
              }
              }
            >
              X
            </button>

            <h1 className="text-3xl font-bold text-cyan-700 mb-8">
              Calibaration Interval
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
                <div className="flex flex-col">
                  <label
                    htmlFor="risk_factor"
                    className="text-gray-700 font-semibold mb-2"
                  >
                    Choose Risk Factor
                  </label>
                  <select
                    id="risk_factor"
                    name="risk_factor"
                    onChange={(e) => setChosenRiskFactor(e.target.value)}
                    className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">בחר גורם סיכון</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                  </select>
                </div>
              </div>

              {/* Predict Button */}
              <button
                onClick={() => {
                  const data = {
                    identifier: chosenIdentifier,
                    risk_factor: Number(chosenRiskFactor),
                  };
                  console.log("data to sent", data);
                  findCalibrationInterval(data);
                }}
                disabled={!chosenInputValue || !chosenIdentifier || !chosenRiskFactor}
                className={`w-fit mt-6 px-8 py-3 text-white text-lg rounded-xl font-semibold transition ${
                  !chosenInputValue || !chosenIdentifier || !chosenRiskFactor
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-800"
                }`}
              >
                Calibration Interval
              </button>
              {error && (
              <div className="w-full mt-10 bg-red-100 p-6 rounded-2xl shadow-lg text-red-700">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-lg">{error}</p>
              </div>
            )}
              {/*  Result */}
              {result && !error &&(
                <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-700">
                    Result
                  </h2>
                  <div className="">
                  <h2 className="text-center">{Math.abs(Number(result)).toFixed(3)} years</h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </dialog>
      </>
    </div>
  );
}

export default CalibrationInterval;
