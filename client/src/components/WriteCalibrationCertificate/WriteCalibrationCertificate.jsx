import React, { useContext, useState } from "react";
import { SharedContext } from "../../contexts/sharedContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function WriteCalibrationCertificate() {
  const { serialNumber, inputValues, setInputValues, identifiers } =
    useContext(SharedContext);
  const [chosenIdentifier, setChosenIdentifier] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // כותרת
    doc.setFontSize(20);
    doc.text("Calibration Certificate Results", 14, 15);
    
    // תאריך
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // מזהה
    doc.text(`Identifier: ${chosenIdentifier}`, 14, 35);
    
    // טבלת תוצאות
    if (Array.isArray(result)) {
      const tableData = result.map(item => [
        item.input,
        item.output,
        item.deviation,
        item.unc
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Input', 'Output', 'Deviation', 'Uncertainty']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45 }
      });
    } else {
      // אם יש רק תוצאה אחת
      autoTable(doc, {
        startY: 45,
        head: [['Parameter', 'Value']],
        body: [
          ['Input', result.input],
          ['Output', result.output],
          ['Deviation', result.deviation],
          ['Uncertainty', result.unc]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45 }
      });
    }
    
    // שמירת הקובץ
    doc.save(`calibration_certificate_${chosenIdentifier}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const { mutate: writeCalibrationCertificate } = useMutation({
    mutationKey: ["writeCalibrationCertificate"],
    mutationFn: async (query) => {
      const { data } = await axios.post(
        `/measurements/${serialNumber}/write-calibration-certificate`,
        query
      );
      console.log(data.data);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.data.length === 0) {
        setError("There are no measurements to predict with.");
        setResult(null);
        return;
      }
      setResult(data.data);
      setError("");
    },
    onError: (e) => {
      setError("There are no measurements to predict with.");
      setResult(null);
    },
  });

  const renderResults = () => {
    if (!result || result.length === 0) return null;
    
    return (
      <div className="w-full mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-700">
            {Array.isArray(result) ? "Results" : "Result"}
          </h2>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export to PDF
          </button>
        </div>

        {Array.isArray(result) ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-cyan-700 text-white">
                  <th className="py-3 px-4 text-center">Input</th>
                  <th className="py-3 px-4 text-center">Output</th>
                  <th className="py-3 px-4 text-center">Deviation</th>
                  <th className="py-3 px-4 text-center">Uncertainty</th>
                </tr>
              </thead>
              <tbody>
                {result.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4">{item.input}</td>
                    <td className="py-3 px-4">{item.output}</td>
                    <td className="py-3 px-4">{item.deviation}</td>
                    <td className="py-3 px-4">{item.unc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
        )}
      </div>
    );
  };

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
                setError(null);
              }}
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
                disabled={!chosenIdentifier}
                className={`w-fit mt-6 px-8 py-3 text-white text-lg rounded-xl font-semibold transition ${
                  !chosenIdentifier
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-800"
                }`}
              >
                Write Calibration Certificate
              </button>
              {error && (
              <div className="w-full mt-10 bg-red-100 p-6 rounded-2xl shadow-lg text-red-700">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-lg">{error}</p>
              </div>
            )}

              {/* Results */}
              {result && result.length > 0 && (
                renderResults()
              )}
              
            </div>
          </div>
        </dialog>
      </>
    </div>
  );
}

export default WriteCalibrationCertificate;
