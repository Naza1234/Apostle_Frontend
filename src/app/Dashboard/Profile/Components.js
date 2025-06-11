"use client";

import { ExportInput } from "@/app/components/Inputs";
import "../../css/profile.css"
import { useEffect, useState } from "react";
import { FetchUserData, UpdateUserData, UpdateUserPin, UpdateUserProfileImage } from "../../UserApiCalles";


const ProfileInfo = ({ setViewPin }) => {
    const  [apiResponse ,setApiResponse] = useState()


    const handleClick = () => {
      setViewPin((prev) => !prev); // toggle viewPin param
    };
  
    
    useEffect(() => {
      const loadUser = async () => {
        const result = await FetchUserData();
        if (result.status) {
          console.log("User data:", result.data);
          setApiResponse(result.data)
        } else {
          console.warn("Fetch error:", result.message);
        }
      };
  
      loadUser();
    }, []);


    return (
      <section className="profile_information">

        {apiResponse && !apiResponse.user.AccountSetup && (
        <>
        {!apiResponse.user.UserName && (
        <h2 className="error" style={{ maxWidth: "100%" }}>
        Profile information is missing. Edit your profile to add your user info.
        </h2>
        )}

        {!apiResponse.profileImg && (
        <h2 className="error" style={{ maxWidth: "100%" }}>
         User profile picture is missing. Edit your profile to add a profile picture.
        </h2>
        )}
        </>
        )}

        {apiResponse?.user && (
          <section className="pin">
            <p>{apiResponse.user.UserPin ? "*****" : "Add user pin"}</p>
            <button onClick={handleClick}>
              {apiResponse.user.UserPin ? "View" : "Add Pin"}
            </button>
          </section>
        )}
        
        <h1>student user profile:</h1>
        <section className="info">
          <ul>
          {apiResponse?.user?.UserName && (
            <>
            {Object.entries(apiResponse.user)
            .filter(([key]) =>
             ["Address", "Admission", "Department", "Level", "UserEmail", "UserMobile", "UserName"].includes(key)
           )
           .map(([key, value]) => (
           <li key={key}>
           {key}
          <p>{value || "Not provided"}</p>
          </li>
          ))}
          </>
          )} 
          </ul>
          <img
            src={apiResponse?.profileImg?.FilePath || ""}
            className="profile"
          />

        </section>
      </section>
    );
  };



const SchoolDoc = () =>{
  const  [apiResponse ,setApiResponse] = useState()


  
  useEffect(() => {
    const loadUser = async () => {
      const result = await FetchUserData();
      if (result.status) {
        console.log("User data:", result.data);
        setApiResponse(result.data)
      } else {
        console.warn("Fetch error:", result.message);
      }
    };

    loadUser();
  }, []);


    return (
      <section className="doc">
      <h1>Student Portal Certification</h1>
    
      {apiResponse && apiResponse.schoolProfile && apiResponse.schoolProfile.FilePath && (
        <iframe
          src={apiResponse.schoolProfile.FilePath}
          width="100%"
          height="100%"
          title="Student Certification"
        />
      )}
    </section>
    
    )
}


const Component = ({setViewPin }) => {
    return (
      <main>
        <section className="information">
          <ProfileInfo setViewPin={setViewPin} />
        </section>
  
        <section className="quick_history">
          <SchoolDoc />
        </section>
      </main>
    );
  };



  const EditUserProfile = ({ setEditUserActive }) => {
    const  [apiResponse ,setApiResponse] = useState()


    const [formData, setFormData] = useState({
      image: null,
      UploadImg:null,
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      department: "",
      regNumber: "",
      address: "",
      duration: "",
      level: "",
    });
  

    
    useEffect(() => {
      const loadUser = async () => {
        const result = await FetchUserData();
        if (result) {
          setApiResponse(result.data);
    
          const user = result.data.user;
          const [firstName = "", middleName = "", lastName = ""] = user.UserName.trim().split(" ");
          setFormData({
            image: result.data.profileImg.FilePath || null, // or use profile image path if you have it, e.g., result.data.profileImg?.FilePath
            firstName,
            middleName,
            lastName,
            phone: user.UserMobile || "",
            email: user.UserEmail || "",
            department: user.Department || "",
            regNumber: user.RegNo || "",
            address: user.Address || "",
            duration: user.Admission || "",
            level: user.Level || "",
          });
        } else {
          console.warn("Fetch error:", result.message);
        }
      };
      loadUser();
    }, []);
    // Default to true when the component mounts, enabling edit mode initially
    const toggleActive = () => {
       setEditUserActive((prev) => !prev); // Toggle the state (true to false or false to true)
      };


      const handleInputChange = ({ type, value }) => {
   
          setFormData((prev) => ({
            ...prev,
            [type]: value,
          }));
        
      };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (!file) return;
      
          const blobUrl = URL.createObjectURL(file);
          console.log(file);
          setFormData((prev) => ({
            ...prev,
            image: blobUrl,       // used for preview in UI
            UploadImg: file,      // actual file to be sent to server
          }));
      }
    };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Prepare formData for image upload
    const imageFormData = new FormData();
    imageFormData.append("file", formData.UploadImg);
    if (!formData.image) {
      alert("Please upload a profile image.");
      return; // Prevent further submission
    }
  
    if (
      !formData.image ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.duration ||
      !formData.department ||
      !formData.level
    ) {
      alert("Please fill out all the required fields including Profile Image, Name, Email, Phone, Address, Admission, Department, and Level.");
      return; // Prevent submission
    }
    // 2. Prepare the user data to match the model
    const userUpdateData = {
      Address: formData.address,
      Admission: formData.duration,
      Department: formData.department,
      Level: formData.level,
      RegNo: formData.regNumber,
      UserEmail: formData.email,
      UserMobile: formData.phone,
      UserName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()
    };

    // 3. Call the API functions
    const [imageRes, dataRes] = await Promise.all([
      UpdateUserProfileImage(imageFormData),
      UpdateUserData(userUpdateData)
    ]);

    // 4. Check for success
    if (imageRes && dataRes) {
      toggleActive(); // Call this only if both updates are successful
    } else {
      console.warn("One or both updates failed", { imageRes, dataRes });
    }
  } catch (error) {
    console.error("Error during form submission:", error);
  }
};

  
    return (
      <form onSubmit={handleSubmit}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="../assets/images/arrow-left.svg"
            alt="Go back"
            onClick={toggleActive} // Toggle state on click
            style={{ cursor: "pointer" }}
          />
          Edit Form
        </h1>
  
        <div className="image_upload">
          {formData.image ? (
            <img src={formData.image} alt="Preview" width="150" height="150" />
          ) : (
            <div style={{ width: "150px", height: "150px", background: "#ccc" }} />
          )}
  
          <label htmlFor="image">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button type="button" onClick={() => document.getElementById("image").click()}>
              Upload Image
            </button>
          </label>
        </div>
  
        <div className="row">
          <label>
            First Name
            <ExportInput
              type="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
            />
          </label>
          <label>
            Middle Name
            <ExportInput
              type="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              placeholder="Enter your middle name"
            />
          </label>
          <label>
            Last Name
            <ExportInput
              type="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
            />
          </label>
        </div>
  
        <div className="row">
          <label>
            Mobile Number
            <ExportInput
              type="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
            />
          </label>
          <label>
            Email
            <ExportInput
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </label>
        </div>
  
        <div className="row">
          <label>
            Department
            <ExportInput
              type="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter your department"
            />
          </label>
          <label>
            Registration No
            <ExportInput
              type="regNumber"
              value={formData.regNumber}
              onChange={handleInputChange}
              placeholder="2020/EN/12345"
            />
          </label>
        </div>
  
        <label>
          Home Address
          <ExportInput
            type="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Front gate, lodge name room no"
          />
        </label>
  
        <div className="row">
          <label>
            Admission Duration
            <ExportInput
              type="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="2020 - 2025"
            />
          </label>
          <label>
            Current Level
            <ExportInput
              type="level"
              value={formData.level}
              onChange={handleInputChange}
              placeholder="100 level"
            />
          </label>
        </div>
  
        <button type="submit" className={apiResponse? "":"notActive"}>Submit</button>
      </form>
    );
  };
  

  const ViewPin = ({ setViewPinActive }) => {
    const [pin, setPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
  
   
  
    const toggleShowPin = () => {
      setShowPin((prev) => !prev);
    };
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(pin).then(() => {
        alert("PIN copied to clipboard!");
      });
    };
  
    const handleChange = (e) => {
      const value = e.target.value;
      if (value.length <= 4) {
        setPin(value);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Submitted PIN:", pin);
      setLoading(true);
    
      try {
        const response = await UpdateUserPin({ UserPin: pin });
    
        // Assume the response has .message or .data to show
        alert(response?.message || response?.data || "Update completed.");
        
        // You can check for success flag if needed
        if (response?.status === true || response?.success === true) {
          toggleActive(); // Run only if successful
        }
      } catch (error) {
        console.error("Error updating PIN:", error);
    
        // Try to show server's error message
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert(error.message || "An error occurred while updating the PIN.");
        }
      }
    
      setLoading(false);
    };
    
  
    const toggleActive = () => {
      setViewPinActive((prev) => !prev);
    };
  
    return (
      <form className="pin_info" onSubmit={handleSubmit}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="../assets/images/arrow-left.svg"
            alt="Go back"
            onClick={toggleActive}
            style={{ cursor: "pointer" }}
          />
          Rental PIN <br/>
          set a transaction pin.
        </h1>
  
        <label>
          <input
            type={showPin ? "number" : "password"}
            value={pin}
            onChange={handleChange}
            maxLength={4}
          />
          <div style={{ display: "flex", gap: "5px" }}>
            <img
              src={
                showPin
                  ? "../assets/images/eye-slash.svg"
                  : "../assets/images/eye.svg"
              }
              alt="Toggle visibility"
              onClick={toggleShowPin}
              style={{ cursor: "pointer" }}
            />
            <img
              src="../assets/images/note.svg"
              alt="Copy to clipboard"
              onClick={copyToClipboard}
              style={{ cursor: "pointer" }}
            />
          </div>
        </label>
  
        <button type="submit" className={loading?"notActive":""}>Edit</button>
      </form>
    );
  };
  
  



export { Component, EditUserProfile, ViewPin };