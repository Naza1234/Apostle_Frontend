"use client";

import { GetAccountRentalDetails, GetAccountRentalDetailsForReserve, GetPowerBank, RentOutPowerBank, RentOutPowerBankForReserve } from "@/app/Adminapicalls";
import "../../css/return.css"
import { useEffect, useState, useRef } from "react";










const FormForRental = ({ rentNowActive }) => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState(["", "", "", ""]);
  // formData will hold order array and other user-related info
  const [formData, setFormData] = useState({
    orders: [{ serialNo: "", selectedType: "" , price:"" }], // allow multiple orders
    userId: "",
  });
  
  const [apiResponse, setApiResponse] = useState([]);
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch power bank options from server on first load
  useEffect(() => {
    const loadData = async () => {
      const result = await GetPowerBank(); // Replace with your actual API
      setPowerBanks(result);
      setLoading(false);
    };
    loadData();
  }, []);

  // Reset form when rental popup closes
  useEffect(() => {
    if (!rentNowActive) {
      setStep(0);
    }
  }, [rentNowActive]);

  // Update a field inside a specific order
  const handleOrderChange = (index, key, value) => {
    const updatedOrders = [...formData.orders];
    updatedOrders[index][key] = value;
    setFormData((prev) => ({
      ...prev,
      orders: updatedOrders,
    }));
  };

  // Add another order input group (up to 2 max)
  const handleAddOrder = () => {
    if (formData.orders.length < 2) {
      setFormData((prev) => ({
        ...prev,
        orders: [...prev.orders, { serialNo: "", selectedType: "" }],
      }));
    } else {
      alert("You can only add up to 2 orders.");
    }
  };






  // Handle final submission at step 0 before going to PIN
  const handleNext = async () => {
    if (step === 0) {
      console.log("Current Orders:", formData); // Log orders
      setStep(1); // Move to next step
    } else if (step === 1) {
      const requestPreview = {
        UserPin: pin.join(""),
        orders: formData.orders
      };
  
      try {
        const results = await GetAccountRentalDetails(requestPreview);
        console.log("Request Preview:\n", results);
  
        setApiResponse(results);
  
        // Update formData with new powerBanks and userId
        setFormData((prev) => ({
          ...prev,
          orders: results.powerBanks, // updated power bank list with prices
          userId: results.userInfo.id // store user ID
        }));
  
        setStep(2);
      } catch (error) {
        console.error("Error fetching rental details:", error);
        alert("wrong pin pls enter the correct pin");
      }
    }
  };
  






  // Reset the form completely
  const handleCancel = () => {
    setFormData({
      orders: [{ serialNo: "", selectedType: "",price : "" }],
      userId: "",
    
    });
    setPin(["", "", "", ""]);
    setStep(0);
    setLoading()
  };

  // Move one step back
  const handleBack = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Final submission logic
  const handleFinalSubmit = async (paymentMethod) => {
    const requestPreview = {
      userId: formData.userId,
      orders: formData.orders
    };
  
    // ✅ Validate serialNo and price for each order
    const hasEmptyFields = formData.orders.some(order =>
      order.serialNo.trim() === "" || order.price === ""
    );
  
    if (hasEmptyFields) {
      alert("Please make sure all orders have both Serial Number and Price filled out.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await RentOutPowerBank(requestPreview);
      console.log("Final Submission:", requestPreview);
      console.log("Server Response:", response);
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Submission failed. Please try again.");
    }
  
    setLoading(false);
    handleCancel(); // Reset form
  };
  

  return (
    <section className={`form-it ${rentNowActive ? "active" : ""}`}>
      {/* Step 0: Order Entry */}
      {step === 0 && (
        <section className="form-it active">
          <h1>Start Process</h1>
          {loading && <p>Loading...</p>}
          {formData.orders.map((order, index) => (
            <>
              <label>
                Serial No
                <input
                  type="text"
                  placeholder="sn-120"
                  value={order.serialNo}
                  onChange={(e) =>
                    handleOrderChange(index, "serialNo", e.target.value)
                  }
                />
              </label>
              <br />
              <label>
                Type
                <select
                  value={order.selectedType}
                  onChange={(e) =>
                    handleOrderChange(index, "selectedType", e.target.value)
                  }
                >
                  <option value="">Select a type</option>
                  {powerBanks.map((data) => (
                    <option key={data._id} value={data.Name}>
                      {data.Name}
                    </option>
                  ))}
                </select>
              </label>
              <br />
            </>
          ))}

          {/* Add Button - Add more orders */}
          <button onClick={handleAddOrder}>Add</button>
           <br/>
          <div className="row buttons sub">
            <button onClick={handleNext}>Proceed</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </section>
      )}

      {/* Step 1: Enter PIN */}
      {step === 1 && (
        <section className="form-it active">
          <h1>
            <img
              src="../assets/images/arrow-left.svg"
              alt="Go back"
              onClick={handleBack}
              style={{ cursor: "pointer" }}
            />
            User Pin
          </h1>
          <PinInput pin={pin} setPin={setPin} />
          <br/>
          <div className="row buttons sub">
            <button onClick={handleNext}>Proceed</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </section>
      )}

      {/* Step 2: Review and Final Submission */}
      {step === 2 && apiResponse && (
        <section className="form-it active">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="../assets/images/arrow-left.svg"
              alt="Go back"
              onClick={handleBack}
              style={{ cursor: "pointer" }}
            />
            Information
          </h1>
          <br/>
          <section className="more">
          
          <div>
  <h2>Account Balance</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.userInfo.accountBalance).toLocaleString()}
  </p>
</div>

<div>
  <h2>Overdue Fee</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.overdueFee).toLocaleString()}
  </p>
</div>

<div>
  <h2>Rental Fee</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.totalPowerBankFee).toLocaleString()}
  </p>
</div>

<div>
  <h2>Amount To Pay</h2>
  <p>
    <strong>&#8358;</strong>{Math.max(Number(apiResponse.totalFee) - Number(apiResponse.userInfo.accountBalance), 0).toLocaleString()}
  </p>
</div>
            <section className="row">
              <img src={apiResponse.profileImg.FilePath} alt="" width="200px" height="250px"/>
              <label>
                
                  name
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={apiResponse.userInfo.name}
                    readOnly
                  />
              
              </label>
              <label>
                
                  Ready For Rental
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={apiResponse.userInfo.accountApproved?"approved":"not approved"}
                    readOnly
                  />
              
              </label>
            </section>
            <h2>overdue rentals</h2>
            { apiResponse.overdueRentals.length < 1 ?(
              <h2 className="info">
                there is no over due rental
              </h2>
            ) : 
            apiResponse.overdueRentals.map((bank, index) => (
              <label key={index}>
                {bank.Type}
                <section className="row">
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={`Date Rented: ${new Date(bank.DateRented).toLocaleString()}`}
                    readOnly
                  />
                </section>
              </label>
            ))                

            }
             <h2>Active rentals</h2>
            { apiResponse.activeRentals.length < 1 ?(
              <h2 className="info">
                there is no active rental
              </h2>
            ) : 
            apiResponse.activeRentals.map((bank, index) => (
              <label key={index}>
                {bank.selectedType}
                <section className="row">
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={`Date Rented: ${new Date(bank.DateRented).toLocaleString()}`}
                    readOnly
                  />
                </section>
              </label>
            ))
            }

             <h2>order</h2>
            { apiResponse.powerBanks.length < 1 ?(
              <h2 className="info">
                there is no active rental
              </h2>
            ) : 
            apiResponse.powerBanks.map((bank, index) => (
              <label key={index}>
                {bank.selectedType}
                <section className="row">
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={`₦${bank.price}`}
                    readOnly
                  />
                </section>
              </label>
            ))
            }
            

            <section className="row">
            <button
             onClick={() => handleFinalSubmit("proceed")}
             className={
               !apiResponse.userInfo.accountApproved || loading ? "notActive" : ""
              }
            >
              Proceed
            </button>
              <button onClick={handleCancel} >Cancel</button>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};





const OnReserve = ({ rentNowActive }) => {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState(["", "", "", ""]);
  // formData will hold order array and other user-related info
  const [formData, setFormData] = useState({
    orders: [{ serialNo: "", selectedType: "" , price:"" }], // allow multiple orders
    userId: "",
  });
  
  const [apiResponse, setApiResponse] = useState([]);
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    setStep(1);
    setPin(['', '', '', '']);
    setInfo({ accountBalance: 0, charges: 0, title: '', userId: '' });
  };

  const handlePinSubmit = async () => {
    const requestPreview = {
      UserPin: pin.join("")
    };

    try {
      const results = await GetAccountRentalDetailsForReserve(requestPreview);
      console.log("Request Preview:\n", results);

      setApiResponse(results);

      // Update formData with new powerBanks and userId
      setFormData((prev) => ({
        ...prev,
        orders: results.powerBanks, // updated power bank list with prices
        userId: results.userInfo.id // store user ID
      }));
      setLoading(false)
      setStep(2);
    } catch (error) {
      console.error("Error fetching rental details:", error);
      alert("wrong pin pls enter the correct pin");
    }
  };

  const handleFinalSubmit = async () => {
    const requestPreview = {
      userId: formData.userId,
      orders: formData.orders
    };
  
    // Check for any order with missing serialNo
    const hasMissingSerial = formData.orders.some(order => order.serialNo.trim() === "");
  
    if (hasMissingSerial) {
      alert("Please input serial number for all power banks.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await RentOutPowerBankForReserve(requestPreview);
      console.log("Final Submission:", requestPreview);
      console.log("Server Response:", response);
    } catch (error) {
      console.error("Error during final submission:", error);
      alert("Submission failed. Please try again.");
    }
  
    setLoading(false);
    resetForm(); // Reset form
  };
  

  return (
    <section className={`form-it ${!rentNowActive ? 'active' : ''}`}>
      {step === 1 && (
        <section className="form-it active">
          <h1>To start, enter user pin</h1>
          <br />
          <PinInput pin={pin} setPin={setPin} />
          <br />
          <div className="row buttons sub">
            <button onClick={handlePinSubmit}>Proceed</button>
            <button onClick={resetForm}>Cancel</button>
          </div>
        </section>
      )}

{step === 2 && apiResponse && (
        <section className="form-it active">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="../assets/images/arrow-left.svg"
              alt="Go back"
              onClick={()=> setStep(1)}
              style={{ cursor: "pointer" }}
            />
            Information
          </h1>
          <br/>
          <section className="more">
          
          <div>
  <h2>Account Balance</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.userInfo.accountBalance).toLocaleString()}
  </p>
</div>

<div>
  <h2>Overdue Fee</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.overdueFee).toLocaleString()}
  </p>
</div>

<div>
  <h2>Rental Fee</h2>
  <p>
    <strong>&#8358;</strong>{Number(apiResponse.totalPowerBankFee).toLocaleString()}
  </p>
</div>

<div>
  <h2>Amount To Pay</h2>
  <p>
    <strong>&#8358;</strong>{Math.max(Number(apiResponse.totalFee) - Number(apiResponse.userInfo.accountBalance), 0).toLocaleString()}
  </p>
</div>
            <section className="row">
              <img src={apiResponse.profileImg.FilePath} alt="" width="200px" height="250px"/>
              <label>
                
                  name
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={apiResponse.userInfo.name}
                    readOnly
                  />
              
              </label>
              <label>
                
                  Ready For Rental
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={apiResponse.userInfo.accountApproved?"approved":"not approved"}
                    readOnly
                  />
              
              </label>
            </section>
            <h2>overdue rentals</h2>
            { apiResponse.overdueRentals.length < 1 ?(
              <h2 className="info">
                there is no over due rental
              </h2>
            ) : 
            apiResponse.overdueRentals.map((bank, index) => (
              <label key={index}>
                {bank.Type}
                <section className="row">
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={`Date Rented: ${new Date(bank.DateRented).toLocaleString()}`}
                    readOnly
                  />
                </section>
              </label>
            ))                

            }
             <h2>Active rentals</h2>
            { apiResponse.activeRentals.length < 1 ?(
              <h2 className="info">
                there is no active rental
              </h2>
            ) : 
            apiResponse.activeRentals.map((bank, index) => (
              <label key={index}>
                {bank.Type}
                <section className="row">
                  <input
                    type="text"
                    placeholder="e.g., Rental Title"
                    value={`Date Rented: ${new Date(bank.DateRented).toLocaleString()}`}
                    readOnly
                  />
                </section>
              </label>
            ))
            }
            <h2>order</h2>
           {apiResponse.powerBanks.length < 1 ? (
            <h2 className="info">there is no order rental</h2>
            ) : (
              apiResponse.powerBanks.map((bank, index) => (
                <label key={index}>
                  {bank.selectedType}
                  <img
  src="../assets/images/close-square.svg"
  alt="remove"
  className="remove"
  style={{ cursor: "pointer", marginLeft: "10px" }}
  onClick={() => {
    const updatedOrders = [...formData.orders];
    const updatedPowerBanks = [...apiResponse.powerBanks];

    updatedOrders.splice(index, 1);        // remove from formData
    updatedPowerBanks.splice(index, 1);    // remove from display (apiResponse)

    setFormData({ ...formData, orders: updatedOrders });
    setApiResponse({ ...apiResponse, powerBanks: updatedPowerBanks });
  }}
/>
                  <section className="row">
                    {/* Editable input for serial number */}
                    <input
                      type="text"
                      placeholder="Enter Serial Number"
                      value={formData.orders[index]?.serialNo || ""}
                      onChange={(e) => {
                        const updatedOrders = [...formData.orders];
                        updatedOrders[index].serialNo = e.target.value; // update serialNo at the correct index
                        setFormData({ ...formData, orders: updatedOrders }); // update the full formData
                      }}
                    />
            
                    {/* Read-only input for price */}
                    <input
                      type="text"
                      placeholder="Price"
                      value={`reserved for: ${bank.duration}hour(s)`}
                      readOnly
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={`₦${bank.price}`}
                      readOnly
                    />
                 
                  </section>
                </label>
              ))
            )}

            

            <section className="row">
            <button
             onClick={() => handleFinalSubmit("proceed")}
             className={
              apiResponse.powerBanks.length < 1 || loading ? "notActive" : ""
              }
            >
              Proceed
            </button>
              <button onClick={resetForm} >Cancel</button>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};



const ChoseType = () => {
  const [rentNowActive, setRentNowActive] = useState(true);

  return (
    <main>
      <div className="row buttons">
        <button
          className={rentNowActive ? 'active' : ''}
          onClick={() => setRentNowActive(true)}
        >
          on spot
        </button>
        <button
          className={!rentNowActive ? 'active' : ''}
          onClick={() => setRentNowActive(false)}
        >
          reserved
        </button>
      </div>

      <section className="main-content">

        <FormForRental rentNowActive={rentNowActive} />

        <OnReserve rentNowActive={rentNowActive} />

      </section>
    </main>
  );
};




const PinInput = ({ pin, setPin }) => {
    const inputs = useRef([]);
  
    const handleChange = (e, index) => {
      const value = e.target.value.replace(/\D/g, '');
      if (!value) return;
      const updatedPin = [...pin];
      updatedPin[index] = value[0];
      setPin(updatedPin);
      if (index < 3) inputs.current[index + 1].focus();
    };
  
    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace') {
        const updatedPin = [...pin];
  
        // If the current box has a value, clear it
        if (updatedPin[index]) {
          updatedPin[index] = '';
          setPin(updatedPin);
        }
        // If empty and not the first box, move back and clear that one
        else if (index > 0) {
          updatedPin[index - 1] = '';
          setPin(updatedPin);
          inputs.current[index - 1].focus();
        }
      }
    };
  
    const handleButtonClick = (digit) => {
      const nextIndex = pin.findIndex((val) => val === '');
      if (nextIndex !== -1) {
        const updatedPin = [...pin];
        updatedPin[nextIndex] = digit;
        setPin(updatedPin);
        if (nextIndex < 3) inputs.current[nextIndex + 1].focus();
      }
    };
  
    const handleClear = () => {
      const lastIndex = pin.findLastIndex((val) => val !== '');
      if (lastIndex !== -1) {
        const updatedPin = [...pin];
        updatedPin[lastIndex] = '';
        setPin(updatedPin);
        inputs.current[lastIndex].focus();
      }
    };
  
    return (
      <section className="pin-wrapper">
        <div className="pin-inputs">
          {[0, 1, 2, 3].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              className="pin-input"
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={pin[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <br />
        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="pin-btn"
              onClick={() => handleButtonClick(String(num))}
            >
              {num}
            </button>
          ))}
          <button className="pin-clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </section>
    );
  };



export { ChoseType}