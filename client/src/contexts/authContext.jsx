
import { useEffect, useState, } from "react";
import { createContext,  } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from "axios";




export const AuthContext = createContext()

function AuthProvider({ children }) {

    const [isAuth, setIsAuth] = useState(false)
    const [customer, setCustomer] = useState(null)

    const { data } = useQuery({
        queryKey: ['verifyToken'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('customers/verify-token');
                console.log("data", data);
                console.log(data.data);
                setIsAuth(data.success)
                setCustomer(data.data)
                return data;

            } catch (error) {
                console.log("error", error);
                throw error;
            }
        },
        staleTime: 1000 * 60000,
        refetchOnMount: false,
        retry: 1,
        

    });

    const {mutate: logOut} = useMutation({
        mutationKey:["logOut"],
        mutationFn: async () => axios.post("/customers/logout"),
        onSuccess: () => {
            setCustomer(null)
            setIsAuth(false)
            alert("BYE BYE...")},
        onError: (error) => console.log(error)
    })



    const authGlobalState = {
        customer,
        isAuth,
        setCustomer,
        setIsAuth,
        logOut
        
    }

    return (
        <AuthContext.Provider value={authGlobalState}>
                                    {children}   
        </AuthContext.Provider>


    )
}
export default AuthProvider;