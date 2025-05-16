"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExportInput } from "../components/Inputs";
import "../css/SignupLogin.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiUrl, WinUrl } from "../ApiUrl";

const LogInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    RedirectionUrl:`${WinUrl}/LogIn`
  });
  const [resetFormData, setResetFormData] = useState({
    email: "",
    newPassword: "",
    showPassword: false,
  });
  
  const [FetchRequestIsDone, setFetchRequestIsDone] = useState(true);
  const [AccountStat, setAccountStat] = useState("login");
  const [FetchRequestResponse, setFetchRequestResponse] = useState({
    status: true,
    response: ""
  });
  const handleResetInputChange = ({ type, value }) => {
    setResetFormData((prev) => ({
      ...prev,
      [type]: value
    }));
  };
  useEffect(() => {
    // Get query parameter using native JS
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state");

    if (stateParam) {
      if (stateParam != "verificationcode") {
        setAccountStat(stateParam);
      }
    }
  }, []);

  // ✅ Extract `verificationcode` from the URL
  useEffect(() => {
    if (searchParams) {
      const code = searchParams.get("verificationcode");
      if (code) {
        setFormData((prev) => ({
          ...prev,
          VerificationCode: code
        }));
      }
    }
  }, [searchParams]);

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
    await loginUser(formData);
    setFormData({
      email: "",
      password: "",
      VerificationCode: "",
      showPassword: false,
    });
  };

  const loginUser = async (formData) => {
    setFetchRequestIsDone(false);
    const url = `${ApiUrl}/user/login`;

    try {
      const response = await axios.post(url, {
        UserEmail: formData.email,
        UserPassword: formData.password,
        VerificationCode: formData.VerificationCode || undefined,
        RedirectionUrl:`${WinUrl}/LogIn`
      });

      if (response.data.status === "success") {
        localStorage.setItem("ApostlesRentalWebsiteForPowerBanksUserId", response.data.response.UserId);
        setFetchRequestResponse({ status: true, response: response.data.message });
        
        router.push("/Dashboard")
      } else {
        setFetchRequestResponse({ status: false, response: response.data.message });
        setTimeout(() => setFetchRequestIsDone(true), 3000);
      }

    } catch (error) {
      setFetchRequestResponse({
        status: false,
        response: error.response?.data?.message || "An unknown error occurred",
      });
      setTimeout(() => setFetchRequestIsDone(true), 3000);
    }
  };



  
// 🟢 Handle sending reset email
const handleSendResetEmail = async (e) => {
  e.preventDefault();
  setFetchRequestIsDone(false);
  try {
    const response = await axios.post(`${ApiUrl}/contact/forgot-password`, {
      UserEmail: resetFormData.email,
      RedirectionUrl:`${WinUrl}/LogIn`
    });

    if (response.data.status === "success") {
      setFetchRequestResponse({ status: true, response: response.data.message });
    } else {
      setFetchRequestResponse({ status: false, response: response.data.message });
    }
  } catch (error) {
    setFetchRequestResponse({
      status: false,
      response: error.response?.data?.message || "An unknown error occurred",
    });
  }
  setTimeout(() => setFetchRequestIsDone(true), 3000);
};



// 🟢 Handle changing password
const handleChangePassword = async (e) => {
  e.preventDefault();
  setFetchRequestIsDone(false);
  try {
    const response = await axios.put(`${ApiUrl}/user/update-password-with-user-email`, {
      UserEmail: resetFormData.email,
      UserPassword: resetFormData.newPassword,
    });

    if (response.data.status === "success") {
      setFetchRequestResponse({ status: true, response: response.data.message });
      router.push("/Login")
    } else {
      setFetchRequestResponse({ status: false, response: response.data.message });
    }
  } catch (error) {
    setFetchRequestResponse({
      status: false,
      response: error.response?.data?.message || "An unknown error occurred",
    });
  }
  setTimeout(() => setFetchRequestIsDone(true), 3000);
};



  return (
    <>
    {
      AccountStat === "login" ? (
        <form onSubmit={handleSubmit}>
        <h1>Log in</h1>
  
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
          Password
          <ExportInput
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          <p onClick={() =>setAccountStat("forgotPassword")} className="forgot">Forgot password?</p>
          <div>
            <input
              type="checkbox"
              checked={formData.showPassword}
              onChange={() => handleCheckboxChange("showPassword")}
            />
            Show password
          </div>
        </label>
  
        <h2 className={!FetchRequestIsDone ? (FetchRequestResponse.status ? "okay good" : "error okay") : ""}>
          {FetchRequestResponse.response}
        </h2>
  
        <button type="submit" className={FetchRequestIsDone ? "" : "notActive"}>Log in</button>
  
        <p>Don’t have an account?</p>
        <a href="../SingUp">Sign Up</a>
      </form>
      ) : AccountStat === "forgotPassword" ? (
      // ✅ Forgot Password Form
<form onSubmit={handleSendResetEmail}>
  <h3 style={{ display: "flex", alignItems: "center",justifyContent: "left", width:"100%", gap: "10px" }}>
    <img
      src="../assets/images/arrow-left.svg"
      alt="Go back"
      onClick={() => setAccountStat("login")}
      style={{ cursor: "pointer" }}
    />
    Send Email
  </h3>

  <label>
    Input email to get verification code.<br />
    Please make sure it's an email registered to your account.
    <input
      type="email"
      value={resetFormData.email}
      onChange={(e) => handleResetInputChange({ type: "email", value: e.target.value })}
    />
  </label>

  <h2 className={!FetchRequestIsDone ? (FetchRequestResponse.status ? "okay good" : "error okay") : ""}>
    {FetchRequestResponse.response}
  </h2>

  <button type="submit" className={FetchRequestIsDone ? "" : "notActive"}>
    Send Change Password Link
  </button>
</form>

      ) : (
       // ✅ Change Password Form
<form onSubmit={handleChangePassword}>
  <h1>Change Password</h1>

  <label>
    Email
    <input
      type="email"
      value={resetFormData.email}
      onChange={(e) => handleResetInputChange({ type: "email", value: e.target.value })}
    />
  </label>

  <label>
    Password
    <input
      type={resetFormData.showPassword ? "text" : "password"}
      value={resetFormData.newPassword}
      onChange={(e) => handleResetInputChange({ type: "newPassword", value: e.target.value })}
    />
    <div>
      <input
        type="checkbox"
        checked={resetFormData.showPassword}
        onChange={() => handleResetInputChange({ type: "showPassword", value: !resetFormData.showPassword })}
      />
      Show password
    </div>
  </label>

  <h2 className={!FetchRequestIsDone ? (FetchRequestResponse.status ? "okay good" : "error okay") : ""}>
    {FetchRequestResponse.response}
  </h2>

  <button type="submit" className={FetchRequestIsDone ? "" : "notActive"}>
    Change Password
  </button>
</form>

      )
    }
    </>
  );
};

export { LogInForm };
