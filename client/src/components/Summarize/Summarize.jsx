import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


function Summarize() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    

    const {mutate: summarize} = useMutation({
        mutationKey: ["summarize"],
        mutationFn: async () => {
            const { data } = await axios.get("/measurements/summarize-input-values/")
            setResult(data.data)
            console.log(data)
            return data.data
            
        }
    })

  return (
        <>
          <dialog id="summarize" className="modal text-center">
            <div className="modal-box bg-white border border-gray-200 shadow-xl rounded-2xl w-5/6 max-w-none px-10">
              {/* Close Button */}
              <button
                id="close-modal-mes"
                type="button"
                className="absolute top-4 right-4 rounded-full cursor-pointer p-2 bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
                onClick={() => {
                  document.getElementById("summarize").close();
                  setResult("");
                }}
              >
                ✕
              </button>
    
              <h1 className="text-3xl font-bold text-cyan-700 mb-8">
              Summarize input values
              </h1>
    
              <div className="w-full flex flex-col gap-6 items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
    
                 
    

                </div>
    
                <button
                  onClick={() => {
                    summarize()
                    
                  }}
                  className="w-fit mt-6 px-8 py-3 bg-cyan-700 text-white text-lg rounded-xl font-semibold hover:bg-cyan-800 transition"
                >
                  Summarize input values
                </button>
    
                {/* Show Error or Result */}
                {error && (
                  <div className="w-full mt-10 bg-red-100 p-6 rounded-2xl shadow-lg text-red-700">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p className="text-lg">{error}</p>
                  </div>
                )}
    
    {result && (
  <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
    <h2 className="text-2xl font-bold mb-4 text-cyan-700">
      Prediction Results
    </h2>
    <h3 className="text-2xl text-black">{result.predicted_deviation}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Serial Number</th>
            <th className="py-2 px-4 border-b text-left">Identifier</th>
            <th className="py-2 px-4 border-b text-left">Input Values and Counts</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{item.serial_number}</td>
              <td className="py-2 px-4 border-b">{item.identifier}</td>
              <td className="py-2 px-4 border-b">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(item['input values and theirs counts']).map(
                    ([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>
              </td>
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

export default Summarize
