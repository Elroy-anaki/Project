import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function WriteCalibrationCertificate() {
  const { serialNumber, inputValues, setInputValues, identifiers } =
    useContext(SharedContext);
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [result, setResult] = useState("");

  const { mutate: writeCalibrationCertificate } = useMutation({
    mutationKey: ["writeCalibrationCertificate"],
    mutationFn: async (query) => {
      const { data } = await axios.post(
        `/measurements/${serialNumber}/write-calibration-certificate`,
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
          id="write-calibration-certificate"
          className="modal text-center"
        >
          <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-none">
            {/* Close Button */}
            <button
              id="close-modal-mes"
              type="button"
              className="absolute top-4 right-4 rounded-xl cursor-pointer px-2 py-1 bg-rose-500 text-white font-bold border-none hover:bg-rose-600 transition"
              onClick={() =>{
                document.getElementById("write-calibration-certificate").close()
                setResult(null);
                setChosenIdentifier("")
            }
              }
            >
              X
            </button>

            <h1 className="text-3xl font-bold text-cyan-700 mb-8">
              Write Calibration Certificate
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
                  writeCalibrationCertificate(data);
                }}
                className="w-fit mt-6 px-8 py-3 bg-cyan-700 text-white text-lg rounded-xl font-semibold hover:bg-cyan-800 transition"
              >
                Write Calibration Certificate
              </button>

              {/*  Result */}
              {result && (
                <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-700">
                    Result
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-lg">
                    <div className="p-4 bg-white rounded-xl shadow">
                      <p className="font-bold text-gray-600">input</p>
                      <p className="font-bold text-gray-600">{result.input}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow">
                      <p className="font-bold text-gray-600">output</p>
                      <p className="font-bold text-gray-600">{result.output}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow">
                      <p className="font-bold text-gray-600">deviation</p>
                      <p className="font-bold text-gray-600">{result.deviation}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow">
                      <p className="font-bold text-gray-600">unc</p>
                      <p className="font-bold text-gray-600">{result.unc}</p>
                    </div>
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

export default WriteCalibrationCertificate;
