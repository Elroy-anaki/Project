import React from 'react'

export function Input({placeholder, type, name, id, onChange}) {
  return (
    <>
    <input className="border-2 border-gray-200 text-lg rounded-md px-2 w-11/12 py-2" type={type} name={name} id={id} placeholder={placeholder} onChange={onChange}/>
    </>
  )
}

