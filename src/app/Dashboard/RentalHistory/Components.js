"use client";

import { GetUserRentalHistory } from "@/app/UserApiCalles";
import "../../css/rentalHistory.css"
import { useEffect, useState, useRef } from "react";



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
  return Math.max(Math.floor(diff / (1000 * 60 * 60)), 0); // hours
}

const Components = () => {
  const  [apiResponse ,setApiResponse] = useState()
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const loadUser = async () => {
      const result = await GetUserRentalHistory();
      setApiResponse(result.slice().reverse());
      console.log(result);
      setLoading(false) 
    };
     
    loadUser();
  }, []);


  if (loading) return <p>Loading...</p>;

  if (apiResponse.length === 0) {
    return (
      <h2 className="info">
        Please, there is no rental. Proceed to the rental page to rent a power bank.
      </h2>
    );
  }
    return (
        <section className="history">
            <h1>
            rental history
            </h1>
          <section className="info">
          <div>
                <span>
                power bank ID
                </span>
                <span>
                type
                </span>
                <span>
                date rented
                </span>
                <span>
                Date Returned
                </span>
                <span>
                Rental Duration
                </span>
                <span>
                Confided
                </span>
                <span>
                Rental Status
                </span>
                <span>
                amount payed
                </span>
                <span>
                payment status
                </span>
                <span>
                    
                </span>
            </div>
            <ul>
      {apiResponse.map((rental, index) => {
        const {
          PowerBankSerialNo,
          Type,
          DateRented,
          DateReturned,
          RentalDuration,
          ReturnConfirmation,
          RentalStatus,
          AmountPaid,
          PaymentStatus,
        } = rental;

        const dueDate = calculateDueDate(DateRented);
        const now = new Date();
        const hasReturned = !!DateReturned;
        const isOverdue = !hasReturned && now > dueDate;

        return (
          <li key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <span>{PowerBankSerialNo}</span>
            <span>{Type}</span>
            <span>{new Date(DateRented).toLocaleString()}</span>
            
              {hasReturned ? (
                <span> {new Date(DateReturned).toLocaleString()}</span>
              ) : isOverdue ? (
                <span style={{ color: 'red' }}>
                  Overdue by {calculateOverdueHours(dueDate)} hour(s)
                </span>
              ) : (
                <span style={{ color: 'green' }}>Rent is still active</span>
              )}


            <span>{RentalDuration} hrs</span>
            <span>{ReturnConfirmation ? 'Yes' : 'No'}</span>
            <span>{RentalStatus}</span>
            <span>₦{AmountPaid}</span>
            <span>{PaymentStatus}</span>
            <span></span>
          </li>
        );
      })}
    </ul>
          </section>
        </section>
    );
}

export {Components};