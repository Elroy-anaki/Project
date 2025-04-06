import React, { useState } from "react";
import { Input } from "../ui/Input/Input";
import { Link, useNavigate } from "react-router-dom";

export function Login() {

  const [customerDetails, setCustomerDetails] = useState({});
  const navigate = useNavigate()

  const handelChange = (e) => {

    setCustomerDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const login = async(data) => {

  }

  const  handleSubmit = async(e) => {
    e.preventDefault()
    navigate("/dashboard")
    
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
              name={"customerEmail"}
              id={"customerEmail"}
              onChange={handelChange}
            />
          </div>
          
          <div>
            <Input
              type={"password"}
              placeholder={"Password *"}
              name={"customerPassword"}
              id={"customerPassword"}
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
