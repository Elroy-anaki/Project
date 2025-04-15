import { createContext, useState } from "react";

export const AddMeasurementContext = createContext();

export function AddMeasurementProvider({ children }) {

    const [serialNumber, setSerialNumber] = useState("")



    const addMeasurementGlobalState = {
        serialNumber,
        setSerialNumber
        
    }

    return (
        <AddMeasurementContext.Provider value={addMeasurementGlobalState}>
                                    {children}   
        </AddMeasurementContext.Provider>


    )
}