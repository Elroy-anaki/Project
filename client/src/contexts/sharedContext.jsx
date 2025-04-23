import { useMutation } from "@tanstack/react-query";
import { createContext, useState } from "react";
import axios from "axios";

export const SharedContext = createContext();

export function SharedProvider({ children }) {

    const [serialNumber, setSerialNumber] = useState("")
    const [inputValues, setInputValues] = useState([])

    const {mutate: getAllInputValuesBySerialNumber} = useMutation({
        mutationKey: ["getAllInputValuesBySerialNumber"],
        mutationFn: async (serialN) => {
          const {data} = await axios.get(`/measurements/${serialN}/input-values`)
          console.log(data.data[0])
          setInputValues(data.data);
          return data
        } 
      })
    



    const sharedGlobalState = {
        serialNumber,
        setSerialNumber,
        inputValues,
        setInputValues,
        getAllInputValuesBySerialNumber
        
    }

    return (
        <SharedContext.Provider value={sharedGlobalState}>
                                    {children}   
        </SharedContext.Provider>


    )
}