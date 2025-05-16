"use client";

import { GetPowerBankInfo, GetUserQuickRentalHistory, GetUserRentalInfo } from "../UserApiCalles";
import "../css/dashBoard.css"
import { useEffect, useState } from "react";




const ShopInfo = () =>{
    const  [apiResponse ,setApiResponse] = useState()
    const [loading, setLoading] = useState(true);
  
  
    
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetPowerBankInfo();
        setApiResponse(result)
        console.log(result);
        setLoading(false) 
      };
       
      loadUser();
    }, []);
  
    return(
        <section className="boxed_container">
         <h1>
         shop info:
         </h1>
         {loading && <p>Loading...</p>}
         <section className="more">
           <div>
            <span>
                <img src="../assets/images/shop.png" alt="" />
                <p>
                in shop only
                </p>
            </span>
            <h1>
             {apiResponse? apiResponse.totalInStor : "..."}<strong>pc</strong>
            </h1>
           </div>


           <div>
            <span>
                <img src="../assets/images/rental.png" alt="" />
                <p>
                on rental only
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.totalOnline : "..."}<strong>pc</strong>
            </h1>
           </div>
         </section>
        </section>
    )
}



const UserInfo = () =>{
    const  [apiResponse ,setApiResponse] = useState()
    const [loading, setLoading] = useState(true);
  
  
    
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetUserRentalInfo()
        setApiResponse(result)
        console.log(result);
        setLoading(false) 
      };
       
      loadUser();
    }, []);
    return(
        <section className="boxed_container">
         <h1>
         user power info:
         </h1>
         {loading && <p>Loading...</p>}
         <section className="more">
           <div>
            <span>
                <img src="../assets/images/active.png" alt="" />
                <p>
                Active Rentals
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.activeRentals : "..."}<strong>pc</strong>
            </h1>
           </div>


           <div>
            <span>
                <img src="../assets/images/over.png" alt="" />
                <p>
                over dew Rentals
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.overdueRentals : "..."}<strong>pc</strong>
            </h1>
           </div>


           <div>
            <span>
                <img src="../assets/images/owed.png" alt="" />
                <p>
                Owed Funds
                </p>
            </span>
            <h1>
            {apiResponse? apiResponse.accountBalance : "..."}<strong>&#8358;</strong>
            </h1>
           </div>
         </section>
        </section>
    )
}




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
  
  const RentalHistory = () => {
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetUserQuickRentalHistory();
        setApiResponse(result);
        setLoading(false);
      };
      loadUser();
    }, []);
  
    
    return (
      <section className="history">
        <h1>rental history</h1>
        {loading && <p>Loading...</p>}
  
       {apiResponse.length === 0 && <h2 className="info">No rentals yet. Please rent a power bank to view history.</h2>}
  
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
              infoMessage = `Overdue by ${overdueHours} hour(s). Please return ASAP.`;
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
                  <h2>&#8358;{AmountPaid}</h2>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };






const Component = () => {
    return (
        <main>


           <section className="information">

            <ShopInfo/>
            <UserInfo/>

           </section>


           <section className="quick_history">

            <RentalHistory/>

           </section>
        </main>
    );
}

export default Component;