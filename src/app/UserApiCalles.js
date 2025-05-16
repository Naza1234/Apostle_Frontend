// utils/fetchUserData.js
import axios from "axios";
import { ApiUrl , WinUrl } from "./ApiUrl";


const FetchUserData = async () => {
  console.log("nouserId2",localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId"));
  try {
    // Check current URL

    
    // Get userId from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
      console.log("nouserId");
      return { status: false, message: "User ID not found in localStorage" };
    }

    // Make the API call
    const response = await axios.get(`${ApiUrl}/user/full-info/${userId}`);

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};




const UpdateUserPin = async (updateDataArray) => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
  
      if (!userId) {
        throw new Error("User ID not found in local storage.");
      }
  
      const response = await axios.put(
        `${ApiUrl}/user/update-pin/${userId}`,
        updateDataArray
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating user pin:", error);
      return { status: false, message: error.message };
    }
  };



const UpdateUserData = async (updateDataArray) => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
  
      if (!userId) {
        throw new Error("User ID not found in local storage.");
      }
  
      const response = await axios.put(
        `${ApiUrl}/user/update-info/${userId}`,
        updateDataArray
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating user data:", error);
      return { status: false, message: error.message };
    }
  };

const UpdateUserProfileImage = async (formData) => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
  
      if (!userId) {
        throw new Error("User ID not found in local storage.");
      }
  
      const response = await axios.post(
        `${ApiUrl}/user/upload-profile-image/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

const GetUserActiveRentals = async () => {
    try {
    // Get userId from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
      return { status: false, message: "User ID not found in localStorage" };
    }

    // Make the API call
    const response = await axios.get(`${ApiUrl}/rentals/active-rentals/${userId}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };


const GetUserRentalHistory  = async () => {
    try {
    // Get userId from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
      return { status: false, message: "User ID not found in localStorage" };
    }

    // Make the API call
    const response = await axios.get(`${ApiUrl}/rentals/history/${userId}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetReserves  = async () => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
      if (!userId) {
        return { status: false, message: "User ID not found in localStorage" };
      }
    const response = await axios.get(`${ApiUrl}/reserves/user/${userId}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };



  const GetPowerBankInfo  = async () => {
    try {
    // Make the API call
    const response = await axios.get(`${ApiUrl}/powerbanks/powerbanks/summary`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };


  const GetUserRentalInfo  = async () => {
    try {
    // Get userId from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
      return { status: false, message: "User ID not found in localStorage" };
    }

    // Make the API call
    const response = await axios.get(`${ApiUrl}/rentals/${userId}/rental-stats`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetUserQuickRentalHistory  = async () => {
    try {
    // Get userId from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
      return { status: false, message: "User ID not found in localStorage" };
    }

    // Make the API call
    const response = await axios.get(`${ApiUrl}/rentals/${userId}/recent-rentals`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetPowerBank = async (payload = {}) => {
    try {
  
      const response = await axios.get(
        `${ApiUrl}/powerbanks`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };
  const GetReserveTime = async (payload = {}) => {
    try {
     
      const response = await axios.get(
        `${ApiUrl}/reservetimes`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

  const PayOutHandler = async (payload = {}) => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
      if (!userId) {
        return { status: false, message: "User ID not found in localStorage" };
      }
  
      const data = {
        UserId : userId,
        orders :payload,
        CallBackUrl : `${WinUrl}/Dashboard/ProcessPayment`
      }
      const response = await axios.post(
        `${ApiUrl}/payment/make-payment`,
        data
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };


  const confirmPayOutHandler = async (payload = {}) => {
    try {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
      if (!userId) {
        return { status: false, message: "User ID not found in localStorage" };
      }
  
      const data = {
        UserId : userId,
        data :payload,
      }
      const response = await axios.post(
        `${ApiUrl}/payment/confirm-payments`,
        data
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };


  const ContactUsHandler = async (payload = {}) => {
    try {
      
      const response = await axios.post(
        `${ApiUrl}/contact/Contact-us`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };



export {
  FetchUserData , UpdateUserPin , UpdateUserData ,
  UpdateUserProfileImage , GetUserActiveRentals , GetUserRentalHistory , 
  GetPowerBankInfo , GetUserRentalInfo , GetUserQuickRentalHistory ,
  GetPowerBank , GetReserveTime , PayOutHandler ,
  confirmPayOutHandler ,GetReserves , ContactUsHandler
}