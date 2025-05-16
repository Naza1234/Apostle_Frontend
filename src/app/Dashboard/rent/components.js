"use client";

import { GetPowerBank, GetReserveTime, PayOutHandler } from "@/app/UserApiCalles";
import "../../css/rent.css"
import { useEffect, useState, useRef } from "react";




const Component = ({ RentOnSpotNotActive, RentOnReserveNotActive }) => {
  const toggleActive = (element) => {
    element((prev) => !prev);
  };

  return (
    <main>
      <section className="clickable" onClick={() => toggleActive(RentOnSpotNotActive)}>
        <img src="../assets/images/spot.svg" alt="" />
        <p>rent power bank on the spot</p>
      </section>

      <section className="clickable" onClick={() => toggleActive(RentOnReserveNotActive)}>
        <img src="../assets/images/reserve.svg" alt="" />
        <p>reserve a power bank for later</p>
      </section>
    </main>
  );
};



const RentOnSpot = ({ RentOnSpotNotActive, PayoutItems, ShowPayout }) => {
  const [forms, setForms] = useState([
    { type: "", quantity: 1, id: "" }
  ]);
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPowerBanks = async () => {
      const result = await GetPowerBank();
      setApiResponse(result || []);
      setLoading(false);
    };
    loadPowerBanks();
  }, []);

  const toggleActive = (setter) => {
    setter(prev => !prev);
  };

const handleAddForm = () => {
  if (forms.length >= 2) {
    alert("You can only add up to two power bank orders.");
    return;
  }

  setForms([...forms, { type: "", quantity: 1, id: "" }]);
};
  const updateFormField = (index, field, value) => {
    const updatedForms = [...forms];
    updatedForms[index][field] = field === "quantity"
      ? parseInt(value) || 1
      : value;
    setForms(updatedForms);
  };

  const handleTypeChange = (index, name, id) => {
    const updatedForms = [...forms];
    updatedForms[index].type = name;
    updatedForms[index].id = id;
    setForms(updatedForms);
  };

  const handleProceed = () => {
    PayoutItems(forms);
    toggleActive(ShowPayout);
    console.log("Selected Power Banks:", forms);
  };

  return (
    <section className="rentPower">
      <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="../assets/images/arrow-left.svg"
          alt="Go back"
          onClick={() => toggleActive(RentOnSpotNotActive)}
          style={{ cursor: "pointer" }}
        />
        Rent power bank now
      </h1>
      <br />
      <h2 className="info">
         To proceed, please visit any nearby Apostle shop to rent. Online reservations only are allowed. Thank you.
      </h2>

      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        forms.map((form, index) => (
          <div className="form" key={index}>
            <div className="row">
              {apiResponse.map((item) => (
                <label key={item._id}>
                  <input
                    type="radio"
                    name={`type-${index}`}
                    value={item.Name}
                    checked={form.type === item.Name}
                    onChange={() => handleTypeChange(index, item.Name, item._id)}
                  />
                  {item.Name} (₦{item.Price})
                </label>
              ))}
            </div>

            <label className="number">
              How many
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  updateFormField(index, "quantity", e.target.value)
                }
              />
            </label>
          </div>
        ))
      )}

      <button className="add" type="button" onClick={handleAddForm}>
        <img src="../assets/images/add.svg" alt="Add" />
      </button>

      <button type="button" onClick={handleProceed}>
        Proceed
      </button> */}
    </section>
  );
};



  const RentOnReserve = ({ RentOnReserveNotActive, PayoutItems, ShowPayout }) => {
    const [forms, setForms] = useState([{ type: "", quantity: 1, duration: 1, id: "" }]);
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetPowerBank();
        setApiResponse(result || []);
        setLoading(false);
      };
  
      loadUser();
    }, []);
  
    const toggleActive = (fn) => {
      fn((prev) => !prev);
    };
  
const handleAddForm = () => {
  if (forms.length >= 2) {
    alert("You can only add up to two power bank orders.");
    return;
  }

  setForms([...forms, { type: "", quantity: 1, duration: 1, id: "" }]);
};
  
    const handleTypeChange = (index, value, id) => {
      const updatedForms = [...forms];
      updatedForms[index].type = value;
      updatedForms[index].id = id;
      setForms(updatedForms);
    };
  
    const handleQuantityChange = (index, value) => {
      const updatedForms = [...forms];
      updatedForms[index].quantity = parseInt(value) || 1;
      setForms(updatedForms);
    };
  
    const handleDurationChange = (index, value) => {
      const updatedForms = [...forms];
      updatedForms[index].duration = parseInt(value) || 1;
      setForms(updatedForms);
    };
  
    const handleProceed = () => {
      const hasEmptyType = forms.some((item) => item.type === "");
      if (hasEmptyType) {
        alert("Select a power bank please");
        return; // early return to stop further execution
      }
      
      PayoutItems(forms);
      toggleActive(ShowPayout);
      console.log("Selected Power Banks:", forms );
    };
  
    return (
      <section className="rentPower">
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="../assets/images/arrow-left.svg"
            alt="Go back"
            onClick={() => toggleActive(RentOnReserveNotActive)}
            style={{ cursor: "pointer" }}
          />
          Reserve power bank now
        </h1>
  
        {loading ? (
          <p>Loading...</p>
        ) : (
          forms.map((form, index) => (
            <div className="form" key={index}>
              <div className="row">
                {apiResponse.map((label) => (
                  <label key={label._id}>
                    <input
                      type="radio"
                      name={`type-${index}`}
                      value={label.Name}
                      checked={form.type === label.Name}
                      onChange={() => handleTypeChange(index, label.Name, label._id)}
                    />
                    {label.Name}
                  </label>
                ))}
              </div>
  
              <label className="number">
                How many
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </label>
  
              <label className="number">
                How long (hours)
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => handleDurationChange(index, e.target.value)}
                />
              </label>
            </div>
          ))
        )}
  
        <button className="add" type="button" onClick={handleAddForm}>
          <img src="../assets/images/add.svg" alt="Add" />
        </button>
  
        <button type="button" onClick={handleProceed}>
          Proceed
        </button>
      </section>
    );
  };

  

  const PayOut = ({ PayoutItems, ShowPayout }) => {
    const [apiResponse, setApiResponse] = useState([]);
    const [apiResponseForReservePrice, setApiResponseForReservePrice] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payOutResult , setPayoutResult] =useState([])
    const [payOutResultGotten , setPayoutResultGotten] =useState(false)
    const toggleActive = (element) => {
      element((prev) => !prev);
    };
  
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetPowerBank(); // Power bank info
        const priceResult = await GetReserveTime(); // Rental time prices
        setApiResponse(result || []);
        setApiResponseForReservePrice(priceResult || []);
        setLoading(false);
      };
  
      loadUser();
    }, []);
  
    const getDevicePrice = (type) => {
      const match = apiResponse.find((pb) => pb.Name === type);
      return match ? match.Price : 0;
    };
  
    const getDurationPrice = (type) => {
      const match = apiResponseForReservePrice.find((rt) => rt.Name === type);
      return match ? match.Price : 0;
    };
      
      const handlePayOut = async () => {
        try {
          if (!PayoutItems || PayoutItems.length === 0) {
            alert("No items to pay for.");
            return;
          }
          setLoading(true)
          const itemsToSend = PayoutItems.map(({ id, duration }) => ({
            id,
            duration: duration || 0,
          }));
      
          const response = await PayOutHandler(itemsToSend);
          console.log("Payment response:", response);
          setPayoutResult(response)
          setPayoutResultGotten(true)
          setLoading(false)
          // Optional: Redirect user to Paystack authorization URL
          // if (response?.paymentResults?.data?.authorization_url) {
          //   window.location.href = response.paymentResults.data.authorization_url;
          // } else {
          //   alert("Failed to get payment URL.");
          // }
        } catch (error) {
          console.error("Error in handlePayOut:", error);
          alert("An error occurred while processing your payout. Please try again.");
        }
      };



    return (
      <section className="rentPower priv">
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="../assets/images/arrow-left.svg"
            alt="Go back"
            onClick={() => toggleActive(ShowPayout)}
            style={{ cursor: "pointer" }}
          />
          Payout slip
        </h1>
        <br />
         { payOutResultGotten?(
          <div className="form">
           <h4>
          active rentals
           </h4>
           <br/>
           {
            payOutResult.activeRentals.length > 0 ?(           
            payOutResult.activeRentals.map((item) => (
             <label className="number" key={item._id}>
             {item.Type}
             <input
               type="text"
               className="number"
               value={`Date Rented: ${new Date(item.DateRented).toLocaleString()}`}
              readOnly
             />
           </label>
           
           ))
         
          ):(   <h2 className="info">
                there is no active rental
              </h2>)
           }

           <br/>


           <h4>
          over due rentals
           </h4>
           <br/>
           {
            payOutResult.overdueRentals.length > 0 ?(
           
            payOutResult.overdueRentals.map((item) => (
             <label className="number" key={item._id}>
             {item.Type}
             <input
               type="text"
               className="number"
               value={`Date Rented: ${new Date(item.DateRented).toLocaleString()}`}
              readOnly
             />
           </label>
           ))         
          ):(   <h2 className="info">
                there is no over due rental
              </h2>)
           }
            <br/>
            <h2 className="error" style={{ width: "100%" }}>
              Note: This is a two-step payment process. After making payment, you would be returned to this page to complete it. If you’re not redirected back, contact the admin.
            </h2>
            <br/>
            <a href={payOutResult.paymentResults.data.authorization_url}>
              <button>
                make payment now 
              </button>
            </a>
          </div>
         ) : loading ? (
          <p>Loading, please wait...</p>
        ) : (
          <>
            <div className="play-out">
              <h1>Item</h1>
              <span>Unit</span>
              <span>Price</span>
            </div>
    
            {PayoutItems && PayoutItems.length > 0 ? (
              (() => {
                let grandTotal = 0;
    
                return (
                  <>
                    {PayoutItems.map((order, index) => {
                      const { type, quantity } = order;
                      const duration = order.duration || 0;
    
                      const unitPrice = getDevicePrice(type);
                      const deviceCost = unitPrice * quantity;
    
                      const hourlyRate = getDurationPrice(type);
                      const durationCost = duration * quantity * hourlyRate;
    
                      const total = deviceCost + durationCost;
                      grandTotal += total;
    
                      return (
                        <div key={index}>
                          <div className="play-out-cont">
                            <h1>{type}</h1>
                            <span>{quantity}</span>
                            <span>₦{deviceCost.toLocaleString()}</span>
                          </div>
    
                          {duration > 0 && (
                            <div className="play-out-cont">
                              <h1>Reserve Duration</h1>
                              <span>{duration * quantity} hr</span>
                              <span>₦{durationCost.toLocaleString()}</span>
                            </div>
                          )}
    
                          <br />
                        </div>
                      );
                    })}
    
                    <div className="play-out-cont">
                      <h1>Grand Total</h1>
                      <span>-</span>
                      <span>₦{grandTotal.toLocaleString()}</span>
                    </div>
                  </>
                );
              })()
            ) : (
              <p>No orders to display.</p>
            )}
    
            <br />
            <button onClick={handlePayOut} className={loading?"notActive":""}>PayOut</button>
          </>
        )}
        
      </section>
    );
    
  };
  
  
  
export {Component, RentOnReserve, RentOnSpot, PayOut};


