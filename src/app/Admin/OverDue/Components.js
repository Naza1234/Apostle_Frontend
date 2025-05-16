"use client";

import { GetRentalOverDue,SendMessageHandler } from "@/app/Adminapicalls";
import "../../css/Adminactiverentals.css"
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
  return Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
}


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
      const result = await GetRentalOverDue(page);
      if (result?.data?.length > 0) {
        setApiResponse((prev) => [...prev, ...result.data]);
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
            Over due rentals
            </h1>
            {apiResponse.length === 0 && !loading &&

             <h2 className="info">
             Please, there is no over due rental.
             </h2>

            }
          <section className="info">
          <div>
          <span>ID</span>
          <span>User</span>
          <span>Type</span>
          <span>Rented</span>
          <span>Due</span>
          <span>Duration</span>
          <span>Amount</span>
          <span>Payment</span>

                <span >
                   
                </span>
            </div>
            {loading && <p>Loading...</p>}
            <ul ref={listRef} onScroll={handleScroll}>
          {apiResponse.map((rental, index) => {
            const {
              PowerBankSerialNo,
              UserName, // Assuming this is populated from the populated User model
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
              <li key={index} >
                <span>{PowerBankSerialNo}</span>
                <span>{UserName || "N/A"}</span>
                <span>{Type}</span>
                <span>{new Date(DateRented).toLocaleString()}</span>
                <span>{new Date(dueDate).toLocaleString()}</span>
                <span style={{ color: "red" }}>{calculateOverdueHours(dueDate) }hrs</span>
                <span>₦{AmountPaid}</span>
                <span>{PaymentStatus}</span>
                <span onClick={() => handleClick(setSendMessageActive, rental)}>
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