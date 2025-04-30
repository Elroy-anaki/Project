import { useMutation } from "@tanstack/react-query";
import { createContext, useState } from "react";
import axios from "axios";

export const SharedContext = createContext();

export function SharedProvider({ children }) {

    const [serialNumber, setSerialNumber] = useState("")
    const [inputValues, setInputValues] = useState([])
    const [identifiers, setIdentifiers] = useState([])
    const [mesToAdd, setMesToAdd] = useState(null)
    const [addMeasurementDetails, setAddMeasurementDetails] = useState({});
    
    

    const {mutate: getAllInputValuesBySerialNumber} = useMutation({
        mutationKey: ["getAllInputValuesBySerialNumber"],
        mutationFn: async (serialN) => {
          const {data} = await axios.get(`/measurements/${serialN}/input-values`)
          console.log(data.data[0])
          setInputValues(data.data);
          return data
        } 
      })
    const {mutate: gtAllIdentifiersBySerialNumber} = useMutation({
      mutationKey: ["gtAllIdentifiersBySerialNumber"],
      mutationFn: async (serialN) => {
        const {data} = await axios.get(`/measurements/${serialN}/identifiers`)
        console.log(data.data)
        setIdentifiers(data.data);
        return data
      } 
    })
    



    const sharedGlobalState = {
        serialNumber,
        setSerialNumber,
        inputValues,
        setInputValues,
        getAllInputValuesBySerialNumber,
        gtAllIdentifiersBySerialNumber,
        identifiers,
        mesToAdd,
        setMesToAdd,
        addMeasurementDetails,
        setAddMeasurementDetails
        
    }

    return (
        <SharedContext.Provider value={sharedGlobalState}>
                                    {children}   
        </SharedContext.Provider>


    )
}