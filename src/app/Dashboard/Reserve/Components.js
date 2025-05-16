"use client";


import { GetReserves } from "@/app/UserApiCalles";
import "../../css/userReserve.css"
import { useEffect, useState, useRef } from "react";





const Components = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeData, setActiveData] = useState(null);

  const handleClick = (element, data) => {
   
  };

  const loadUser = async (page) => {
    try {
      const result = await GetReserves();
    
        setApiResponse(result)
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rentals", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);


  return (   
        <section className="history">
      
            <h1>
            reserved 
            </h1>
            {apiResponse.length === 0 && !loading &&

             <h2 className="info">
              Please, there is no reserve rental.
             </h2>

             }

          <section className="info">
          <div>
          <span>Type</span>
          <span>Reserved</span>
          <span>Rent</span>
          <span>Duration</span>
          <span>Amount</span>
          <span>Payment</span>
                <span>
                    
                </span>
            </div>
            {loading && <p>Loading...</p>}
            <ul>
            {apiResponse.map((data, index) => {
            return (
              <li key={index} >
                <span>{data.Type}</span>
                <span>{new Date(data.Reserved).toLocaleString()}</span>
                <span>{data.Rent}</span>
                <span>{data.Duration}</span>
                <span>₦{data.Amount}</span>
                <span>{data.Payment}</span>
              
                <span onClick={() => handleClick(setSendMessageActive, data)}>
                    <img src="../assets/images/check.svg" alt="check" />
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