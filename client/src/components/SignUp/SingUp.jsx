import React, { useState } from "react";
import { Input } from "../ui/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function SingUp() {
  const [customerDetails, setCustomerDetails] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.length >= 2;
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => {
      return { ...prev, [name]: value };
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerDetails.customer_name) {
      newErrors.customer_name = 'שם מלא חובה';
    } else if (!validateName(customerDetails.customer_name)) {
      newErrors.customer_name = 'השם חייב להכיל לפחות 2 תווים';
    }

    if (!customerDetails.customer_email) {
      newErrors.customer_email = 'מייל חובה';
    } else if (!validateEmail(customerDetails.customer_email)) {
      newErrors.customer_email = 'נא להזין כתובת מייל תקינה';
    }

    if (!customerDetails.customer_password) {
      newErrors.customer_password = 'סיסמה חובה';
    } else if (!validatePassword(customerDetails.customer_password)) {
      newErrors.customer_password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }

    if (!customerDetails.customer_confirm_password) {
      newErrors.customer_confirm_password = 'אישור סיסמה חובה';
    } else if (customerDetails.customer_password !== customerDetails.customer_confirm_password) {
      newErrors.customer_confirm_password = 'הסיסמאות אינן תואמות';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate: signUp } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (customerDetails) =>
      await axios.post("customers/sign-up", customerDetails),
    onSuccess: (data) => navigate("/login"),
    onError: (error) => {
      setErrors({ submit: 'ההרשמה נכשלה. נסה שוב מאוחר יותר.' });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      signUp(customerDetails);
    }
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
              {errors.customer_name && (
                <p className="text-red-500 text-sm text-right mr-8">{errors.customer_name}</p>
              )}
            </div>
            <div>
              <Input
                type={"email"}
                placeholder={"Email *"}
                name={"customer_email"}
                id={"customer_email"}
                onChange={handelChange}
              />
              {errors.customer_email && (
                <p className="text-red-500 text-sm text-right mr-8">{errors.customer_email}</p>
              )}
            </div>

            <div>
              <Input
                type={"password"}
                placeholder={"Password *"}
                name={"customer_password"}
                id={"customer_password"}
                onChange={handelChange}
              />
              {errors.customer_password && (
                <p className="text-red-500 text-sm text-right mr-8">{errors.customer_password}</p>
              )}
            </div>
            <div>
              <Input
                type={"password"}
                placeholder={"Confirm Password *"}
                name={"customer_confirm_password"}
                id={"customer_confirm_password"}
                onChange={handelChange}
              />
              {errors.customer_confirm_password && (
                <p className="text-red-500 text-sm text-right mr-8">{errors.customer_confirm_password}</p>
              )}
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
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
