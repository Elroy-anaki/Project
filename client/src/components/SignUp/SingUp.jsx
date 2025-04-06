import React, { useState } from "react";
import { Input } from "../ui/Input/Input";
import { Link } from "react-router-dom";

export function SingUp() {
  const [customerDetails, setCustomerDetails] = useState({});
  const [msg, setMsg] = useState("");

  const handelChange = (e) => {
    setCustomerDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const signUp = async (data) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      customerDetails.customerPassword !==
      customerDetails.customerConfirmPassword
    ) {
      setMsg("The password and confirm password must be identical.");
      return;
    }
    console.log(customerDetails);
    // send to the server
  };

  return (
    <>
      <div className="flex justify-center items-center py-20">
        <form
          onSubmit={handleSubmit}
          className="w-2/5 mx-auto bg-white text-center py-5 rounded-xl "
        >
          <div className="space-y-5">
            <div>
              <h1 className="text-black text-4xl font-bold">Sign Up</h1>
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
                type={"text"}
                placeholder={"Full Name *"}
                name={"customerName"}
                id={"customerName"}
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
              <Input
                type={"password"}
                placeholder={"Confirm Password *"}
                name={"customerConfirmPassword"}
                id={"customerConfirmPassword"}
                onChange={handelChange}
              />
            </div>
            <div>
              {msg && <p className="text-left ml-8 text-red-500">{msg}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="text-white rounded-lg bg-cyan-700 w-11/12 py-2 font-semibold text-xl"
              >
                Register
              </button>
            </div>
            <div>
              <p className="text-black text-base">
                Already have an account?{" "}
                <span className="text-cyan-700 font-extrabold ml-5">
                  <Link to={"/login"}>Login</Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
