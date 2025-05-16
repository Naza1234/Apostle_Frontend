"use client";

import { GetAccountRentalDetailsForReserve, ReturnPowerBank } from "@/app/Adminapicalls";
import "../../css/return.css"
import { useEffect, useState, useRef } from "react";





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





  const Confirmation = () => {
    const [step, setStep] = useState(1);
    const [pin, setPin] = useState(["", "", "", ""]);
    const [formData, setFormData] = useState([]); // will store selected IDs
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const resetForm = () => {
      setStep(1);
      setPin(["", "", "", ""]);
      setFormData([]);
      setApiResponse(null);
    };
  
    const handlePinSubmit = async () => {
      const requestPreview = {
        UserPin: pin.join("")
      };
  
      try {
        const results = await GetAccountRentalDetailsForReserve(requestPreview);
        setApiResponse(results);
  
        const ids = [
          ...results.activeRentals.map(item => ({ _id: item._id, Type: item.Type,category: "active",rentedOn:item.DateRented })),
          ...results.overdueRentals.map(item => ({ _id: item._id, Type: item.Type, category: "overdue",rentedOn:item.DateRented})),
        ];
  
        setFormData(ids);
        setStep(2);
      } catch (error) {
        alert("Wrong pin, please enter the correct one");
        console.error("Error fetching rental details:", error);
      }
    };
  
    const removeItem = (idToRemove) => {
      setFormData(prev => prev.filter(item => item._id !== idToRemove));
    };
  
    const handleFinalSubmit = async () => {
      const idsToSubmit = formData.map(item => item._id);
      console.log("Submitting these rental IDs to the server:", idsToSubmit);
      // Example: await sendToServer(idsToSubmit);
      setLoading(true);
  
      try {
        const response = await ReturnPowerBank(idsToSubmit);
        console.log("Final Submission:", idsToSubmit);
        console.log("Server Response:", response);
      } catch (error) {
        console.error("Error during final submission:", error);
        alert(error?.message || "unexpected error contact developer");
      }
    
      setLoading(false);
      resetForm(); // Reset form
    };
  
    return (
      <main>
        <section className="main-content">
          <section className="form-it active">
            {step === 1 && (
              <>
                <h1>To start, enter user pin</h1>
                <br />
                <PinInput pin={pin} setPin={setPin} />
                <br />
                <div className="row buttons sub">
                  <button onClick={handlePinSubmit}>Proceed</button>
                </div>
                <br />
              </>
            )}
  
            {step === 2 && apiResponse && (
              <>
                <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src="../assets/images/arrow-left.svg"
                    alt="Go back"
                    onClick={() => setStep(1)}
                    style={{ cursor: "pointer" }}
                  />
                  Information
                </h1>
                <br />
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
                      <strong>&#8358;</strong>
                      {Math.max(Number(apiResponse.totalFee) - Number(apiResponse.userInfo.accountBalance), 0).toLocaleString()}
                    </p>
                  </div>
  
                  <section className="row">
                    <img src={apiResponse.profileImg.FilePath} alt="profile" width="200px" height="250px" />
                    <label>
                      Name
                      <input type="text" value={apiResponse.userInfo.name} readOnly />
                    </label>
                    <label>
                      Ready For Rental
                      <input
                        type="text"
                        value={apiResponse.userInfo.accountApproved ? "approved" : "not approved"}
                        readOnly
                      />
                    </label>
                  </section>
  
                  <h2>All Rentals</h2>
                  {formData.length === 0 ? (
                    <p>No rentals to display.</p>
                  ) : (
                    formData.map((item, index) => (
                      <label key={index} className={item.category === "active"?"active":"notActive"}>
                        {item.Type}
                        <img
                          src="../assets/images/close-square.svg"
                          alt="remove"
                          className="remove"
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                          onClick={() => removeItem(item._id)}
                        />
                        <section className="row">
                          <input
                            type="text"
                            value={`Date Rented: ${new Date(item.rentedOn).toLocaleString()}`}
                            readOnly
                          />
                        </section>
                      </label>
                    ))
                  )}
  
                  <section className="row">
                    <button
                      onClick={handleFinalSubmit}
                      className={formData.length === 0 || loading ? "notActive" : ""}
                    >
                      Proceed
                    </button>
                    <button onClick={resetForm}>Cancel</button>
                  </section>
                </section>
              </>
            )}
          </section>
        </section>
      </main>
    );
  };
export { PinInput, Confirmation}