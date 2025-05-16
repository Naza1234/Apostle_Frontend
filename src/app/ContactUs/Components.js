"use client";


import { ContactUsHandler } from "../UserApiCalles";
import { ExportInput } from "../components/Inputs";
import "../css/ContactUs.css"
import { faqsData } from "../data";
import { useEffect, useState, useRef } from "react";


const ContactForm = async () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  
    const handleInputChange = ({ type, value }) => {
      setFormData((prev) => ({
        ...prev,
        [type]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate: basic example
      if (!formData.email || !formData.message) {
        alert("Please fill in all required fields (email and message).");
        return;
      }
      const data ={
        UserName : `${formData.firstName} ${formData.lastName}`,
        Email : formData.email ,
        PhNo : formData.phone,
        SubJect : formData.subject,
        Message : formData.message
      }
      // Example: send formData to console or an API
      console.log("Form submitted:", formData);
       await ContactUsHandler(data)
      // Reset form (optional)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    };
  
    return (
      <section className="form">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>
              First Name
              <ExportInput
                type="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </label>
  
            <label>
              Last Name
              <ExportInput
                type="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </label>
          </div>
  
          <div className="row">
            <label>
              Email
              <ExportInput
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </label>
  
            <label>
              Phone Number
              <ExportInput
                type="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </label>
          </div>
  
          <label>
            Subject
            <ExportInput
              type="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter the subject"
            />
          </label>
  
          <label>
            Message
            <ExportInput
              type="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type your message"
            />
          </label>
  
          <button type="submit">Send Message</button>
        </form>
      </section>
    );
  };

const ContactUs = () =>{
    return(
    <section className="contact_us_content">
        <h1>
        contact us today!
        </h1>
        <p>
        Any question or remarks? Just write us a message!
        </p>

        <section className="contact_us_prop">
         <div className="physical">
       <div className="info_head">
       <h2>
          Contact Information
          </h2>
          <p>
          Say something to start a live chat!
          </p>
       </div>
          <ul className="physical_info">
            <li>
                <img src="../assets/images/phone.svg" alt="" />
                <p>
                +1012 3456 789
                </p>
            </li>
            <li>
                <img src="../assets/images/email.svg" alt="" />
                <p>
                demo@gmail.com
                </p>
            </li>
            <li>
                <img src="../assets/images/location.svg" alt="" />
                <p>
                132 Dartmouth Street Boston, Massachusetts 02156 United States
                </p>
            </li>
          </ul>
          <ul className="sos">
            <a href="">
                <li>
                    <img src="../assets/images/x.svg" alt="" />
                </li>
            </a>
            <a href="">
                <li>
                <img src="../assets/images/insta.svg" alt="" />
                </li>
            </a>
          </ul>
         </div>

        <ContactForm/>

        </section>
    </section>
    )
}




const FAQsSection = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    const toggleActive = (index) => {
      setActiveIndex(index === activeIndex ? -1 : index);
    };


     return(
        <section className="FAQS">
            <h1>
                Frequently ask questions 
            </h1>
            <ul>
                {faqsData.map((faq, index) => (
        <li
          key={index}
          className={activeIndex === index ? "active" : ""}
          onClick={() => toggleActive(index)}
        >
          <img
            src={
              activeIndex === index
                ? "../assets/images/close.svg"
                : "../assets/images/expand.svg"
            }
            alt=""
          />
          <div>
            <h2>{faq.question}</h2>
              <p>{faq.answer}</p>
          </div>
        </li>
      ))}
            </ul>
        </section>
     )
}




export {ContactUs, FAQsSection}