"use client";

import { GetReserves ,SendMessageHandler  } from "@/app/Adminapicalls";
import "../../css/Adminactiverentals.css"
import { useEffect, useState, useRef } from "react";



const PopupForSendMessage = ({ PopupForSendMessageActive, PopupForSendMessageSetActive, Data }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = (element) => {
    element((prev) => !prev);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in both subject and message.");
      return;
    }

    const data ={
      UserId : Data.UserId, 
      SubJect : subject, 
      Message :message
    }
   
    await SendMessageHandler(data)

    handleClick(PopupForSendMessageActive)
    setMessage("")
    setSubject("")
    // You can also call a prop or API here to send the message
  };

  return (
    <section className={PopupForSendMessageSetActive ? "popup active" : "popup"}>
      <section className="content">
        <h1>
          Send Custom Notification
          <img
            src="../assets/images/close-square.svg"
            alt="close"
            onClick={() => handleClick(PopupForSendMessageActive)}
          />
        </h1>

        <label>
          Subject
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        <label>
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <button onClick={handleSend}>Send</button>
      </section>
    </section>
  );
};


const Components = () => {
  const [SendMessageActive, setSendMessageActive] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
  const [apiResponseIsReserved, setApiResponseIsReserved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [activeData, setActiveData] = useState(null);
  const listRef = useRef();

  const handleClick = (element, data) => {
    element((prev) => !prev);
    setActiveData(data);
  };

  const loadUser = async (page) => {
    try {
      const result = await GetReserves(page);
      if (result?.data?.length > 0) {
        setApiResponse((prev) => [...prev, ...result.data]);
        setApiResponseIsReserved(result.reserved)
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rentals", err);
      setLoading(false);
    }
  };

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
         Data = {activeData}
         />
            <h1>
            reserved 
            </h1>
            {apiResponse.length === 0 && !loading &&

             <h2 className="info">
              Please, there is no over due rental.
             </h2>

             }

            {apiResponseIsReserved &&
             <h2 className="info">
              Please, there is no over due rental.
             </h2>

             }
          <section className="info">
          <div>
          <span>User</span>
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
            <ul ref={listRef} onScroll={handleScroll}>
            {apiResponse.map((data, index) => {
            return (
              <li key={index} >
                <span>{data.UserName}</span>
                <span>{data.Type}</span>
                <span>{new Date(data.Reserved).toLocaleString()}</span>
                <span>{data.Rent}</span>
                <span>{data.Duration}</span>
                <span>₦{data.Amount}</span>
                <span>{data.Payment}</span>
              
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