import React, { useContext, useState, useEffect } from "react";
import { Input } from "../ui/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import {useMutation} from "@tanstack/react-query"
import { AuthContext } from "../../contexts/authContext";
import { toast } from 'react-toastify';

export function Login() {
  const {setCustomer, setIsAuth, isAuth} = useContext(AuthContext)

  const [customerDetails, setCustomerDetails] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {mutate: login} = useMutation({
    mutationKey:["login"],
    mutationFn: async(customerDetails) => await axios.post("customers/login", customerDetails),
    onSuccess: (data) => {
      console.log(data.data.data);
      setCustomer(data.data.data)
      setIsAuth(true)
      toast.success('התחברת בהצלחה!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        rtl: true
      });
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000);
    },
    onError: (error) => {
      setErrors({ submit: 'שם משתמש או סיסמה שגויים' });
    }
  })

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (validateForm()) {
      login(customerDetails)
    }
  } 

  useEffect(() => {
    if(!isAuth) return
    navigate("/dashboard")
  }, [isAuth])
  

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
          
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
        
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
