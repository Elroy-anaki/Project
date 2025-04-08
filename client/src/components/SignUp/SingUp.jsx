import React, { useState } from "react";
import { Input } from "../ui/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function SingUp() {
  const [customerDetails, setCustomerDetails] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handelChange = (e) => {
    setCustomerDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const { mutate: signUp } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (customerDetails) =>
      await axios.post("customers/sign-up", customerDetails),
    onSuccess: (data) => navigate("/login"),
    onError: (error) => setMsg("Something Get Wrong!"),
  });

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
    signUp(customerDetails);
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
                type={"text"}
                placeholder={"Full Name *"}
                name={"customer_name"}
                id={"customer_name"}
                onChange={handelChange}
              />
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
              <Input
                type={"password"}
                placeholder={"Confirm Password *"}
                name={"customer_confirm_password"}
                id={"customer_confirm_password"}
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
