"use client";

import { FetchUserData, GetUsers, GetUsersName, UpdateUserData, UpdateUserSchoolProfile } from "@/app/Adminapicalls";
import "../../css/users.css"
import { useEffect, useState, useRef } from "react";
import { ExportInput } from "@/app/components/Inputs";


const PopupForSendMessage = ({ PopupForSendMessageActive, PopupForSendMessageSetActive, Data }) => {
  const [apiResponse, setApiResponse] = useState();
  const [formData, setFormData] = useState({
    image: null,
    schoolProfile: null,
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    department: "",
    regNumber: "",
    stat: "",
    address: "",
    duration: "",
    level: "",
  });

  useEffect(() => {
    if (PopupForSendMessageSetActive) {
      const loadUser = async () => {
        const result = await FetchUserData(Data._id);
        if (result) {
          setApiResponse(result.data);
          const user = result.data.user;
          const [firstName = "", middleName = "", lastName = ""] = user.UserName.trim().split(" ");
          setFormData({
            image: result.data.profileImg?.FilePath || null,
            schoolProfile: result.data.schoolProfile?.FilePath || null,
            firstName,
            middleName,
            lastName,
            phone: user.UserMobile || "",
            email: user.UserEmail || "",
            department: user.Department || "",
            regNumber: user.RegNo || "",
            stat: user.UserStat || "",
            address: user.Address || "",
            duration: user.Admission || "",
            level: user.Level || "",
          });
        } else {
          console.warn("Fetch error:", result.message);
        }
      };
  
      loadUser();
    }
  }, [PopupForSendMessageSetActive]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload a profile image.");
      return;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "duration",
      "department",
      "level",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    const userUpdateData = {
      Address: formData.address,
      Admission: formData.duration,
      Department: formData.department,
      Level: formData.level,
      RegNo: formData.regNumber,
      UserEmail: formData.email,
      UserStat: formData.stat,
      UserMobile: formData.phone,
      UserName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
    };

    try {
      const dataRes = await UpdateUserData(userUpdateData, Data._id);
      if (dataRes) {
        toggleActive();
       
      } else {
        console.warn("Update failed");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const toggleActive = () => {
    PopupForSendMessageActive((prev) => !prev);
    setFormData({
      image:  null,
      schoolProfile:null,
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email:  "",
      department: "",
      regNumber:  "",
      stat: "",
      address: "",
      duration:  "",
      level: "",
    });
  };

  const handleClick = (element) => {
    element((prev) => !prev);
    setFormData({
      image:  null,
      schoolProfile:null,
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email:  "",
      department: "",
      regNumber:  "",
      stat: "",
      address: "",
      duration:  "",
      level: "",
    });
  };

  return (
    <section className={PopupForSendMessageSetActive ? "popup active" : "popup"}>
      <section className="content">
        <h1>
          send custom notification
          <img
            src="../assets/images/close-square.svg"
            alt="close"
            onClick={() => handleClick(PopupForSendMessageActive)}
          />
        </h1>
        <form onSubmit={handleSubmit}>
       
          <div className="row">
            {formData.image && (
              <img src={formData.image} alt="Preview" width="150" height="150" />
            )}
            {formData.schoolProfile && (
              <iframe
                src={formData.schoolProfile}
                width="150"
                height="150"
                title="Student Certification"
              />
            )}
          </div>

          <div className="row">
            <label>
              First Name
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </label>
            <label>
              Middle Name
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Enter your middle name"
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </label>
          </div>

          <div className="row">
            <label>
              Mobile Number
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </label>
          </div>

          <div className="row">
            <label>
              Department
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
              />
            </label>
            <label>
              Registration No
              <input
                type="text"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleInputChange}
                placeholder="2020/EN/12345"
              />
            </label>
          </div>

          <label>
            Home Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Front gate, lodge name room no"
            />
          </label>

          <div className="row">
            <label>
              Admission Duration
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="2020 - 2025"
              />
            </label>
            <label>
              Current Level
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                placeholder="100 level"
              />
            </label>
            <label>
              Current Status
              <select
                name="stat"
                value={formData.stat}
                onChange={handleInputChange}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="owner">owner</option>
                <option value="blocked">blocked</option>
              </select>
            </label>
          </div>

          <br />
          <button type="submit" className={apiResponse ? "" : "notActive"}>
            Submit
          </button>
        </form>
      </section>
    </section>
  );
};


const PopupForUploadProfile = ({ PopupForUploadProfileActive, PopupForUploadProfileSetActive }) => {
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const result = await GetUsersName(); // should return [{ _id, userName }, ...]
      setApiResponse(result.data);
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleClick = (element) => {
    element((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUserChange = (e) => {
    const name = e.target.value;
    setSelectedUserName(name);

    const matchedUser = apiResponse.find((u) => u.UserName === name);
    setSelectedUserId(matchedUser ? matchedUser._id : "");
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedUserId) {
      alert("Please select a user and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", selectedUserId);

   
    setLoading(true)
    try {
      const newResult = await UpdateUserSchoolProfile(formData);
      handleClick(PopupForUploadProfileActive);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload. Please try again.");
    }
    setLoading(false)
    // Perform your actual API call here (e.g., axios.post(...))
  };

  return (
    <section className={PopupForUploadProfileSetActive ? "popup active" : "popup"}>
      <section className="content">
        <h1>
          Upload profile for a user
          <img
            src="../assets/images/close-square.svg"
            alt="close"
            onClick={() => handleClick(PopupForUploadProfileActive)}
          />
        </h1>
        <br />
        {loading && <p>Loading...</p>}

        <div className="file_upload">
          {selectedFile ? (
            <>
              <iframe
                src={URL.createObjectURL(selectedFile)}
                title="PDF Preview"
                width="100%"
                height="100%"
              ></iframe>
              {selectedUserName && (
                <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                  Selected User: <strong>{selectedUserName}</strong>
                </p>
              )}
            </>
          ) : (
            <div style={{
              width: "150px",
              height: "150px",
              background: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span>No PDF selected</span>
            </div>
          )}

          <label htmlFor="pdf">
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button type="button" onClick={() => document.getElementById("pdf").click()}>
              Upload PDF
            </button>
          </label>
        </div>

        <label>
          Select user name
          <input
            type="text"
            list="usernames"
            placeholder="user name"
            value={selectedUserName}
            onChange={handleUserChange}
          />
          <datalist id="usernames">
            {apiResponse.map((user) => (
              <option key={user._id} value={user.UserName} />
            ))}
          </datalist>
        </label>

        <br />
        <button onClick={handleSubmit} className={loading?"notActive":""}>Send</button>
      </section>
    </section>
  );
};


const Components = () => {
  const [SendMessageActive, setSendMessageActive] = useState(false);
  const [uploadProfileActive, setUploadProfileActive] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
  const [apiResponseIsReserved, setApiResponseIsReserved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [activeData, setActiveData] = useState(null);
  const listRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const handleClick = (element, data) => {
    element((prev) => !prev);
    setActiveData(data);
  };

  const loadUser = async (page) => {
    try {
      const result = await GetUsers(page);
        // Don't append data if this page has already been loaded
    // if (page !== 1 && result?.page !== page) return;

      if (result?.data?.length > 0) {
      setApiResponse((prev) => {
        // Avoid duplicates (optional but recommended)
        const existingIds = new Set(prev.map((u) => u._id));
        const newData = result.data.filter((u) => !existingIds.has(u._id));
        return [...prev, ...newData];
      });
      setApiResponseIsReserved(result.reserved);
    }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rentals", err);
      setLoading(false);
    }
  };
  const filteredUsers = apiResponse.filter(user =>
    user.UserName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (
      searchTerm &&
      filteredUsers.length < 5 &&
      apiResponse.length >= 100 &&
      !loading
    ) {
      setPageNo((prev) => prev + 1);
      setLoading(true);
    }
  }, [filteredUsers, searchTerm, loading]);
  
  useEffect(() => {
    loadUser(pageNo);
  }, [pageNo]);

  const handleScroll = () => {
    const bottom =
      listRef.current.scrollHeight - listRef.current.scrollTop <=
      listRef.current.clientHeight + 50;
    if (bottom) {
      setPageNo((prev) => prev + 1);
    }
  };

  return (   
        <section className="history">
        <PopupForSendMessage
         PopupForSendMessageActive = {setSendMessageActive}
         PopupForSendMessageSetActive = {SendMessageActive}
         Data= {activeData}

         />
         <PopupForUploadProfile
            PopupForUploadProfileActive = {setUploadProfileActive}
            PopupForUploadProfileSetActive = {uploadProfileActive}

         />
            <h1>
            rental history
            </h1>
            <section className="other">
            <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageNo(1); // optional: reset if doing a fresh search
                }}
            />


              <button onClick={() => handleClick( setUploadProfileActive)}>upload profile</button>
            </section>
            {apiResponse.length === 0 && !loading &&

          <h2 className="info">
           Please, there is no user registers.
           </h2>

           }
          <section className="info">
          <div>
        
          <span>User</span>
          <span>Mobile</span>
          <span>Email</span>
          <span>Department</span>
          <span>Address</span>
          <span>Admission</span>
          <span>Level</span>
          <span>Balance</span>
          <span>Approved</span>
          <span>stat</span>

                <span >
                    check
                </span>
            </div>
            {loading && <p>Loading...</p>}
            <ul ref={listRef} onScroll={handleScroll}>
            {filteredUsers.map((data, index) => {
            return (
              <li key={index} >
                <span>{data.UserName}</span>
                <span>{data.UserMobile}</span>
                <span>{data.UserEmail}</span>
                <span>{data.Department}</span>
                <span>{data.Address}</span>
                <span>{data.Admission}</span>
                <span>{data.Level}</span>
                <span>₦{Number(data.UserAccountBalance).toLocaleString()}</span>
                <span>{data.AccountSetup?"approved":"not approved"}</span>
                <span>{data.UserStat}</span>
                <span onClick={() => handleClick(setSendMessageActive, data)}>
                    <img src="../assets/images/export.svg" alt="check" />
                </span>
              </li>
            );
          })}
            </ul>
          </section>
        </section>
    );
}

export {Components};