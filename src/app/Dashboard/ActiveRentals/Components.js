"use client";

import { GetUserActiveRentals } from "@/app/UserApiCalles";
import "../../css/activerental.css"
import { useEffect, useState, useRef } from "react";


const Components = () => {
  const  [apiResponse ,setApiResponse] = useState()
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const loadUser = async () => {
      const result = await GetUserActiveRentals();
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
        Please, there is no active rental. Proceed to the rental page to rent a power bank.
      </h2>
    );
  }


    return (
        <section className="history">
            <h1>
            active rental
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
                amount payed
                </span>
                <span>
                payment status
                </span>
                <span>
                    
                </span>
            </div>
            <ul>
            {apiResponse.map((rental, index) => (
              <li key={index}>
                  <span> {rental.PowerBankSerialNo}</span>
                  <span> {rental.Type}</span>
                  <span>{new Date(rental.DateRented).toLocaleDateString()}</span>
                  <span> {rental.DateReturned ? new Date(rental.DateReturned).toLocaleDateString() : 'Not returned'}</span>
                  <span>{rental.RentalDuration} hour(s)</span>
                  <span>₦{rental.AmountPaid}</span>
                  <span>{rental.PaymentStatus}</span>
                  <span></span>
                </li>
              ))}
            </ul>
          </section>
        </section>
    );
}

export {Components};