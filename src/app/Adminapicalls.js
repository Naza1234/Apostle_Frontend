// utils/fetchUserData.js
import axios from "axios";
import { ApiUrl , WinUrl } from "./ApiUrl";


const FetchAdminData = async () => {
  try {
    // Ensure we're on the Admin dashboard page
    if (!window.location.href.startsWith(`${WinUrl}/Admin`)) {
      return { status: false, message: "You are not on the Admin dashboard page." };
    }

    // Retrieve user ID from localStorage
    const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    if (!userId) {
    
      return { status: false, message: "User not authenticated. Redirecting..." };
    }

    // Make API request
    const response = await axios.get(`${ApiUrl}/user/full-info/${userId}`);

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "An unexpected error occurred while fetching admin data.",
    };
  }
};



const AddPowerBank = async (payload = {}) => {
    try {
  
      const response = await axios.post(
        `${ApiUrl}/powerbanks`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
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

const EditPowerBank = async (payload = {}) => {
    try {
  
      const response = await axios.put(
        `${ApiUrl}/powerbanks/${payload.ItemId}`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

const AddLateReturn = async (payload = {}) => {
    try {
  
      const response = await axios.post(
        `${ApiUrl}/latereturnprices`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

const GetLateReturn = async (payload = {}) => {
    try {
  
      const response = await axios.get(
        `${ApiUrl}/latereturnprices`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

const EditLateReturn = async (payload = {}) => {
    try {
  
      const response = await axios.put(
        `${ApiUrl}/latereturnprices/${payload.ItemId}`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };


const AddReserveTime = async (payload = {}) => {
    try {
  
      const response = await axios.post(
        `${ApiUrl}/reservetimes`,
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

const EditReserveTime = async (payload = {}) => {
    try {
  
      const response = await axios.put(
        `${ApiUrl}/reservetimes/${payload.ItemId}`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

  const GetRentalHistory  = async (PageNo = {}) => {
    try {

    const response = await axios.get(`${ApiUrl}/rentals/${PageNo}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetRentalActive  = async (PageNo = {}) => {
    try {

    const response = await axios.get(`${ApiUrl}/rentals/active/${PageNo}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetRentalOverDue  = async (PageNo = {}) => {
    try {

    const response = await axios.get(`${ApiUrl}/rentals/overdue/${PageNo}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetReserves  = async (PageNo = {}) => {
    try {

    const response = await axios.get(`${ApiUrl}/reserves/${PageNo}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetUsers  = async (PageNo = {}) => {
    try {

    const response = await axios.get(`${ApiUrl}/user/get-all-users/${PageNo}`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetUsersName  = async () => {
    try {

    const response = await axios.get(`${ApiUrl}/user/user-name`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const UpdateUserSchoolProfile = async (formData) => {
    try {
      const userId = formData.get("userId");

      const response = await axios.post(
        `${ApiUrl}/user/upload-school-profile/${userId}`,
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

  const GetSummaryData  = async () => {
    try {

    const response = await axios.get(`${ApiUrl}/adminporttal/get-summary`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const GetAccountSummary = async (timing = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/adminporttal/get-financial-summary`, timing);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };
  
  const EditPowerBankNumber = async (payload = {}) => {
    try {
  
      const response = await axios.put(
        `${ApiUrl}/powerbanks/powerbankno/editing`,
        payload
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { status: false, message: error.message };
    }
  };

  const GetUserQuickRentalHistoryForToday  = async () => {
    try {

    // Make the API call
    const response = await axios.get(`${ApiUrl}/rentals/for/admin/today-rentals`);

      return response.data; // returns the rentals
    } catch (error) {
      console.error('Error fetching user rentals:', error.message);
      throw error; // or return null if you want to silently fail
    }
  };

  const FetchUserData = async (userId = {}) => {
    try {
      // Check current URL
   
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

  const UpdateUserData = async (updateDataArray , userId) => {
    try {
      const response = await axios.put(
        `${ApiUrl}/user/update-info-admin/${userId}`,
        updateDataArray
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating user data:", error);
      return { status: false, message: error.message };
    }
  };
  
  const GetAccountRentalDetails = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/adminporttal/get-rental-details`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };

  const GetAccountRentalDetailsForReserve = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/adminporttal/get-rental-details-for-reserve`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };
  
  const RentOutPowerBank = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/rentals`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };
  
  const RentOutPowerBankForReserve = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/rentals/for-reserve`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };

  const ReturnPowerBank = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/rentals/end-rental-by-return`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };


  const SendMessageHandler = async (params = {}) => {
    try {
      const response = await axios.post(`${ApiUrl}/contact/Custom-email`, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching account summary:', error.message);
      throw error;
    }
  };





  export {
    AddPowerBank , GetPowerBank , EditPowerBank , 
    AddLateReturn , GetLateReturn , EditLateReturn ,
    AddReserveTime ,GetReserveTime , EditReserveTime , 
    GetRentalActive ,GetRentalHistory , GetRentalOverDue, 
    GetReserves , GetUsers ,GetUsersName ,UpdateUserSchoolProfile,
    GetSummaryData , GetAccountSummary , EditPowerBankNumber ,
    GetUserQuickRentalHistoryForToday , FetchUserData ,UpdateUserData ,
    GetAccountRentalDetails , RentOutPowerBank , GetAccountRentalDetailsForReserve ,
    RentOutPowerBankForReserve , ReturnPowerBank , FetchAdminData ,
    SendMessageHandler 

  }