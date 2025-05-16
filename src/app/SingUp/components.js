"use client";

import { ExportInput } from "../components/Inputs";
import "../css/SignupLogin.css"
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ApiUrl , WinUrl} from "../ApiUrl";

const SignUpForm = () => {
    const [formData, setFormData] = useState({
      email: "",
      phone: "",
      password: "",
      showPassword: false,
      agree: false,
      RedirectionUrl:`${WinUrl}/LogIn`
    });
    const [FetchRequestIsDone, setFetchRequestIsDone] = useState(true)
    const [FetchRequestResponse, setFetchRequestResponse] = useState({
      status :true,
      response: ""
    })
    // http://localhost:3000/Dashboard

    const handleInputChange = ({ type, value }) => {
      setFormData((prev) => ({
        ...prev,
        [type]: value
      }));
    };
  
    const handleCheckboxChange = (type) => {
      setFormData((prev) => ({
        ...prev,
        [type]: !prev[type]
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!formData.agree) {
        alert("Please agree to the Terms & Conditions.");
        return;
      }
  
      console.log("Form submitted:", formData);
       await registerUser(formData)
      // Reset form (optional)
      setFormData({
        email: "",
        phone: "",
        password: "",
        showPassword: false,
        agree: false
      });
    };
    const registerUser = async (formData) => {
      setFetchRequestIsDone(false);
       var url =  `${ApiUrl}/user/register`
      try {
        const response = await axios.post(url, {
          UserEmail: formData.email,
          UserMobile: formData.phone,
          UserPassword: formData.password,
          RedirectionUrl:`${WinUrl}/LogIn`
        });
    
    
        if (response.data.status === "okay") {
        setFetchRequestResponse({
          status :true,
          response: response.data.message
        })
        }else {
          
          setFetchRequestResponse({
            status: false,
            response: response.data.message
          });
        
          setTimeout(() => {
            setFetchRequestIsDone(true);
          }, 3000); 
        }
    
      } catch (error) {
        if (error.response && error.response.data) {
           
          setFetchRequestResponse({
            status: false,
            response: error.response.data.message
          });
        
          setTimeout(() => {
            setFetchRequestIsDone(true);
          }, 3000); 
        } else {
          alert("An unknown error occurred");
        }
      }
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
  
        <label>
          Email
          <ExportInput
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </label>
  
        <label>
          Phone
          <ExportInput
            type="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </label>
  
        <label>
          Password
          <ExportInput
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
          />
              <p>8 or more characters, at least 1 letter and 1 number</p>
  
          <div>
            <input
              type="checkbox"
              checked={formData.showPassword}
              onChange={() => handleCheckboxChange("showPassword")}
            />
            Show password
          </div>
  
        </label>
  
        <div>
          <input
            type="checkbox"
            checked={formData.agree}
            onChange={() => handleCheckboxChange("agree")}
          />
          <p>
            I agree with <a href="#">Terms & Conditions</a>
          </p>
        </div>
        <h2 className={!FetchRequestIsDone ? FetchRequestResponse.status?"okay  good":"error okay":""}>
          {FetchRequestResponse.response}
        </h2>
        <button type="submit" className={FetchRequestIsDone?"":"notActive"}>Sign Up</button>
  
        <p>Already have an account?</p>
        <a href="../LogIn">LOG IN</a>
      </form>
    );
  };

  export {SignUpForm}
