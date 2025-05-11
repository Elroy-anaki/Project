import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function Uncertainty() {
  const { serialNumber, inputValues, setInputValues, identifiers } = useContext(SharedContext);
  const [chosenInputValue, setChosenInputValue] = useState("");
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [chosenDate, setChosenDate] = useState("");
  const [result, setResult] = useState(null);

  const { mutate: predictUncertaintyBySerialNumber } = useMutation({
    mutationKey: ["predictUncertaintyBySerialNumber"],
    mutationFn: async (query) => {
      const { data } = await axios.post(`/measurements/${serialNumber}/predict-uncertainty`, query);
      setResult(data.data);
      console.log(data.data);
      return;
    },
  });

  return (
    <>
      <dialog id="uncertainty-modal" className="modal text-center">
      <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-5/6 max-w-none px-10">
          {/* Close Button */}
          <button
            id="close-modal-mes"
            type="button"
            className="absolute top-4 right-4 rounded-full cursor-pointer p-2 bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
            onClick={() => {
              setResult(null)
              document.getElementById("uncertainty-modal").close()}}
          >
            ✕
          </button>

          <h1 className="text-3xl font-bold text-cyan-700 mb-8">Predict Uncertainty</h1>

          <div className="w-full flex flex-col gap-6 items-center justify-center">

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input Value */}
              <div className="flex flex-col">
                <label htmlFor="input_value" className="text-gray-700 font-semibold mb-2">
                  Choose Input Value
                </label>
                <select
                  id="input_value"
                  className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={(e) => setChosenInputValue(e.target.value)}
                  value={chosenInputValue}
                >
                  <option selected>Select value</option>
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
                <label htmlFor="identifier" className="text-gray-700 font-semibold mb-2">
                  Choose Identifier
                </label>
                <select
                  id="identifier"
                  className="w-full text-black p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onChange={(e) => setChosenIdentifier(e.target.value)}
                  value={chosenIdentifier}
                >
                  <option selected>Select identifier</option>
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

              {/* Date Picker */}
              <div className="flex flex-col">
                <label htmlFor="query_date" className="text-gray-700 font-semibold mb-2">
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
                console.log("data to sent", data);
                predictUncertaintyBySerialNumber(data);
              }}
              disabled={!chosenInputValue || !chosenIdentifier || !chosenDate}
              className={`w-fit mt-6 px-8 py-3 text-white text-lg rounded-xl font-semibold transition ${
                !chosenInputValue || !chosenIdentifier || !chosenDate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-700 hover:bg-cyan-800"
              }`}
            >
              Predict Uncertainty
            </button>

            {/* Prediction Result */}
            {result && (
              <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
                <h2 className="text-2xl font-bold mb-4 text-cyan-700">Prediction Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-lg">
                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="font-bold text-gray-600">u_predStandard</p>
                    <p>{result.u_predStandard}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="font-bold text-gray-600">EffictiveDF</p>
                    <p>{result.EffictiveDF}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow">
                    <p className="font-bold text-gray-600">Uncertainty Extended</p>
                    <p>{result.uncertainty_extended_prediction}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </dialog>
    </>
  );
}

export default Uncertainty;
