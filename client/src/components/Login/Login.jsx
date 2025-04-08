import React, { useContext, useState } from "react";
import { Input } from "../ui/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

import {useMutation} from "@tanstack/react-query"
import { AuthContext } from "../../contexts/authContext";

export function Login() {
  const {setCustomer, setIsAuth,} = useContext(AuthContext)

  const [customerDetails, setCustomerDetails] = useState({});
  const navigate = useNavigate()

  const handelChange = (e) => {

    setCustomerDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const {mutate: login} = useMutation({
    mutationKey:["login"],
    mutationFn: async(customerDetails) => await axios.post("customers/login", customerDetails),
    onSuccess: (data) => {
      console.log(data.data.data);
      setCustomer(data.data.data)
      setIsAuth(true)
      alert(data.data.message);
      navigate("/dashboard")
    }
  })

  const  handleSubmit = async(e) => {
    e.preventDefault()
    console.log(customerDetails)
    login(customerDetails)
    
  } 
  

  return (
    <>
          <div className="flex justify-center items-center py-25">

      <form onSubmit={handleSubmit} className="w-2/5 mx-auto bg-white text-center py-5   rounded-xl">
        <div className="space-y-5">
          <div>
            <h1 className="text-black text-4xl font-bold">Login</h1>
          </div>
          <div>
            <Input
              type={"email"}
              placeholder={"Email *"}
              name={"customer_email"}
              id={"customer_email"}
              onChange={handelChange}
            />
          </div>
          
          <div>
            <Input
              type={"password"}
              placeholder={"Password *"}
              name={"customer_password"}
              id={"customer_password"}
              onChange={handelChange}
            />
          </div>
        
          <div>
            <button
              type="submit"
              className="text-white rounded-lg bg-cyan-700 w-11/12 py-2 font-semibold text-xl"
            >
              Login
            </button>
          </div>
          <div>
            <p className="text-black text-base">
              Don't have an account?{" "}
              <span className="text-cyan-700 font-extrabold ml-5">
                <Link to={"/sign-up"}>Sign Up</Link>
              </span>
            </p>
          </div>
        </div>
      </form>
      </div>
    </>
  );
}
