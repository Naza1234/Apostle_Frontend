"use client";

import { EditPowerBankNumber, GetAccountSummary , GetPowerBank, GetSummaryData, GetUserQuickRentalHistoryForToday } from "../Adminapicalls";
import "../css/adminDsh.css"
import { useEffect, useState } from "react";


const getTodayRange = () => {
  const today = new Date();
  return {
    startDate: today.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
};

const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);

  return {
    startDate: sunday.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
};

const getMonthRange = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    startDate: startOfMonth.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
};


const OverView = ({PopupForPowerBankActive}) =>{
  const  [apiResponse ,setApiResponse] = useState()
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const loadUser = async () => {
      const result = await GetSummaryData();
      setApiResponse(result)
      console.log(result);
      setLoading(false) 
    };
     
    loadUser();
  }, []);


    const handleClick = (elements) => {
        elements((prev) => !prev);
      
    };

    return(
        <section className="boxed_container">
         <h1>
         over view:
         </h1>
         {loading && <p>Loading...</p>}
         <section className="more">
           <div onClick={()=> handleClick(PopupForPowerBankActive)}>
            <span>
                <img src="../assets/images/shop.png" alt="" />
                <p>
                power banks
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.totalPowerBanks : "..."} <strong>pc</strong>
            </h1>
           </div>

              <a href="../Admin/ActiveRentals">
              <div>
            <span>
                <img src="../assets/images/active.svg" alt="" />
                <p>
                active rentals
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.totalActiveRentals: "..."}<strong>pc</strong>
            </h1>
           </div>
              </a>
         

              <a href="../Admin/OverDue">
           <div>
            <span>
                <img src="../assets/images/over.svg" alt="" />
                <p>
                over due
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.totalOverdueRentals : "..."}<strong>pc</strong>
            </h1>
           </div>
            </a>

            <a href="../Admin/reserved">
           <div>
            <span>
                <img src="../assets/images/rental.png" alt="" />
                <p>
                reserved
                </p>
            </span>
            <h1>
             {apiResponse? apiResponse.totalReservedRentals : "..."} <strong>pc</strong>
            </h1>
           </div>
           </a>

         </section>
        </section>
    )
}



const Account = ({  }) => {
  const [customDateActive, setCustomDateActive] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customDates, setCustomDates] = useState({ startDate: "", endDate: "" });

  const fetchData = async (timing) => {
    setLoading(true);
    try {
      const result = await GetAccountSummary(timing);
      setApiResponse(result);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultTiming = getTodayRange();
    fetchData(defaultTiming);
  }, []);

  const handleTimingClick = (type) => {
    let timing;
    if (type === "daily") timing = getTodayRange();
    else if (type === "weekly") timing = getWeekRange();
    else if (type === "monthly") timing = getMonthRange();

    fetchData(timing);
  };

  const handleCustomUpdate = () => {
    if (customDates.startDate && customDates.endDate) {
      fetchData(customDates);
      setCustomDateActive((prev) => !prev); // Close popup
    }
  };
    const handleClick = () => {
      setCustomDateActive(true);
  };
  return (
    <section className="boxed_container">
      <h1>user power info:</h1>

      <section className="timing">
        <div>
          <button onClick={() => handleTimingClick("daily")}>daily</button>
          <button onClick={() => handleTimingClick("weekly")}>weekly</button>
          <button onClick={() => handleTimingClick("monthly")}>monthly</button>
        </div>
        <button onClick={() => handleClick()}>custom</button>
      </section>

      {loading && <p>Loading...</p>}

      <section className="more">
        <div>
          <span>
            <img src="../assets/images/active.png" alt="" />
            <p>returned</p>
          </span>
          <h1>{apiResponse?.totalCompletedRentalAmount || 0} <strong>&#8358;</strong></h1>
        </div>

        <div>
          <span>
            <img src="../assets/images/over.png" alt="" />
            <p>over due</p>
          </span>
          <h1>{apiResponse?.totalOverdueLateFees || 0} <strong>&#8358;</strong></h1>
        </div>

        <div>
          <span>
            <img src="../assets/images/owed.png" alt="" />
            <p>Owed Funds</p>
          </span>
          <h1>{apiResponse?.totalMoneyOwedByUsers || 0} <strong>&#8358;</strong></h1>
        </div>
      </section>

      <PopupForCustomDate
        PopupForCustomDateActive={setCustomDateActive}
        PopupForCustomDateSetActive={customDateActive}
        setCustomDates={setCustomDates}
        handleCustomUpdate={handleCustomUpdate}
      />
    </section>
  );
};


function calculateDueDate(dateRented) {
  const dueDate = new Date(dateRented);
  const hour = dueDate.getHours();

  if (hour < 14) {
    dueDate.setHours(22, 0, 0, 0); // same day, 10PM
  } else {
    dueDate.setDate(dueDate.getDate() + 1); // next day
    dueDate.setHours(10, 0, 0, 0); // 10AM
  }

  return dueDate;
}

function calculateOverdueHours(dueDate, returnedAt = new Date()) {
  const diff = returnedAt.getTime() - dueDate.getTime();
  return Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
}



const RentalHistory = () =>{
  const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetUserQuickRentalHistoryForToday();
        setApiResponse(result);
        setLoading(false);
      };
      loadUser();
    }, []);
  
    
    return (
      <section className="history">
        <h1>history for the day</h1>
        {loading && <p>Loading...</p>}
  
       {!loading && apiResponse.length === 0 && <h2 className="info">No rentals yet. for the day.</h2>}
  
        <ul>
          {apiResponse.map((rental, index) => {
            const {
              PowerBankSerialNo,
              DateRented,
              DateReturned,
              AmountPaid,
              RentalStatus,
            } = rental;
  
            const dueDate = calculateDueDate(DateRented);
            const hasReturned = !!DateReturned;
            const now = new Date();
            const isOverdue = !hasReturned && now > dueDate;
            const overdueHours = isOverdue ? calculateOverdueHours(dueDate) : 0;
  
            let infoMessage = '';
            let statusColor = '';
  
            if (hasReturned) {
              infoMessage = 'Power bank returned successfully.';
              statusColor = 'green';
            } else if (isOverdue) {
              infoMessage = `Overdue by ${overdueHours} hour(s).`;
              statusColor = 'red';
            } else {
              infoMessage = `Rent is still active. Return on or before ${dueDate.toLocaleString()}.`;
              statusColor = 'goldenrod';
            }
  
            return (
              <li key={index}>
                <span>
                  <p><strong>{PowerBankSerialNo}</strong></p>
                  <p>{new Date(DateRented).toLocaleString()}</p>
                </span>
                <section>
                  <div>
                    <p>• {infoMessage}</p>
                    <p style={{ color: statusColor }}>
                      status: {hasReturned ? 'returned' : isOverdue ? 'overdue' : 'active'}
                    </p>
                  </div>
                  <h2>&#8358; {AmountPaid}</h2>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
    )
}


const PopupForPowerBank = ({ PopupForPowerBankActive, PopupForPowerBankSetActive }) => {
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await GetPowerBank(); // Assumed to return array of power bank objects with _id, Name, etc.
      setPowerBanks(result);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleClick = (element) => {
    element((prev) => !prev);
  };

  // Generic update function
  const updateQuantity = (index, field, type) => {
    setPowerBanks((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: type === "increase"
                ? item[field] + 1
                : Math.max(0, item[field] - 1),
            }
          : item
      )
    );
  };

  const handleInputChange = (index, field, value) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      setPowerBanks((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: parsed } : item
        )
      );
    }
  };

  const handleUpdate = async () => {
    try {
      // Step 1: Prepare payload
      const updated = powerBanks.map(({ _id, NumberInStor, NumberOnLine }) => ({
        _id,
        NumberInStor,
        NumberOnLine,
      }));
  
      console.log("Updating power banks:", updated);
  
      // Step 2: Indicate loading
      setLoading(true);
  
      // Step 3: Send request to backend
      const result = await EditPowerBankNumber(updated); // this should POST or PUT to the controller
  
      // Optional: Handle result (e.g., show success toast, update UI)
      console.log("Update result:", result);
  
      // Step 4: Turn off loading and close popup
      setLoading(false);
      PopupForPowerBankActive((prev) => !prev);
    } catch (error) {
      console.error("Update failed:", error);
      setLoading(false);
      // Optional: Show error feedback
    }
  };
  

  return (
    <section className={PopupForPowerBankSetActive ? "popup active" : "popup"}>
      <section className="content">
        <h1>
          Power Banks
          <img
            src="../assets/images/close-square.svg"
            alt="close"
            onClick={() => handleClick(PopupForPowerBankActive)}
          />
        </h1>

        {loading ? <p>Loading...</p> : (
          <>
            <br />
            <p>In Store</p>
            <div className="row">
              {powerBanks.map((bank, index) => (
                <label key={bank._id}>
                  <h2>{bank.Name}</h2>
                  <div>
                    <h3>
                      <input
                        type="text"
                        value={bank.NumberInStor}
                        onChange={(e) => handleInputChange(index, "NumberInStor", e.target.value)}
                      /> <strong>pc</strong>
                    </h3>
                    <span>
                      <img
                        src="../assets/images/arrow-square-down.svg"
                        alt="reduce"
                        onClick={() => updateQuantity(index, "NumberInStor", "decrease")}
                      />
                      <img
                        src="../assets/images/arrow-square-up.svg"
                        alt="increase"
                        onClick={() => updateQuantity(index, "NumberInStor", "increase")}
                      />
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <p>Online</p>
            <div className="row">
              {powerBanks.map((bank, index) => (
                <label key={bank._id}>
                  <h2>{bank.Name}</h2>
                  <div>
                    <h3>
                      <input
                        type="text"
                        value={bank.NumberOnLine}
                        onChange={(e) => handleInputChange(index, "NumberOnLine", e.target.value)}
                      /> <strong>pc</strong>
                    </h3>
                    <span>
                      <img
                        src="../assets/images/arrow-square-down.svg"
                        alt="reduce"
                        onClick={() => updateQuantity(index, "NumberOnLine", "decrease")}
                      />
                      <img
                        src="../assets/images/arrow-square-up.svg"
                        alt="increase"
                        onClick={() => updateQuantity(index, "NumberOnLine", "increase")}
                      />
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <br />
            <button onClick={handleUpdate} className={loading?"notActive":""}>update</button>
          </>
        )}
      </section>
    </section>
  );
};


const PopupForCustomDate = ({
  PopupForCustomDateActive,
  PopupForCustomDateSetActive,
  setCustomDates,
  handleCustomUpdate,
}) => {
  const handleClick = (element) => {
    element((prev) => !prev);
  };

  return (
    <section className={PopupForCustomDateSetActive ? "popup active" : "popup"}>
      <section className="content">
        <h1>
          custom date
          <img
            src="../assets/images/close-square.svg"
            alt="close"
            onClick={() => handleClick(PopupForCustomDateActive)}
          />
        </h1>
        <br />
        <div className="row custom">
          <label>
            set start date
            <input
              type="date"
              onChange={(e) =>
                setCustomDates((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </label>
          <label>
            set end date
            <input
              type="date"
              onChange={(e) =>
                setCustomDates((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </label>
        </div>
        <br />
        <button onClick={handleCustomUpdate}>update</button>
      </section>
    </section>
  );
};



const Component = () => {
    const [powerBankActive, setPowerBankActive] = useState(false);

    return (
        <main>
           
           <PopupForPowerBank
           PopupForPowerBankActive = {setPowerBankActive}
           PopupForPowerBankSetActive = {powerBankActive}

           />

           {/* <PopupForCustomDate
           PopupForCustomDateActive = {setCustomDateActive}
           PopupForCustomDateSetActive = {customDateActive}

           /> */}

           <section className="information">

            <OverView 
            PopupForPowerBankActive = {setPowerBankActive}
            />
            <Account
            // PopupForCustomDateActive = {setCustomDateActive}
            />

           </section>


           <section className="quick_history">

            <RentalHistory/>

           </section>
        </main>
    );
}


export default Component;