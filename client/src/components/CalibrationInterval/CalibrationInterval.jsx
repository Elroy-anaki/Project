import React from 'react'

function CalibrationInterval() {
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
                onClick={() => document.getElementById("calibration-interval").close()}
              >
                X
              </button>
    
            mksmskmss
            </div>
          </dialog>
        </>
    </div>
  )
}

export default CalibrationInterval
