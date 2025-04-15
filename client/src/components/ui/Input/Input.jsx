import React from 'react'

export function Input({placeholder, type, step, min, max, name, id, onChange, value}) {
  return (
    <>
    <input className="border-2 border-gray-200 text-lg text-gray-800 rounded-md px-2 w-11/12 py-2 placeholder:text-gray-800 placeholder:text-base" type={type} step={type === "number" ? step : null} min={type === "number" ? min : null} max={type === "number"? max: null} name={name} id={id} placeholder={placeholder} value={value || null} onChange={onChange}/>
    </>
  )
}

