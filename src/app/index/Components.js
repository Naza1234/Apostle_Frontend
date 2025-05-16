"use client";

import "../css/index.css"
import { useEffect, useState, useRef } from "react";
import { ExportSelect } from "../components/Inputs";




import {userReviews} from "../data"; // import your data
import { ApiUrl } from "../ApiUrl";



const HeroSection = () => {
    return (
        <section className="hero">
            <h1>
            power up anytime, <br/> anywhere!
            </h1>
            <p>
            Convenient, portable power at your fingertips.
            </p>
            <div>
                <a href="../SingUp">
                join us now
                </a>
                <a href="../LogIn">
                request demo
                </a>
            </div>
        </section>
    );
}






const IntroVideo = () =>{
    const videoRef = useRef(null);

    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        // video.playbackRate = 2; // Set speed to 2x
        video.loop = true;      // Enable looping
        video.play();           // Auto-play on load
      }
    }, []);
  
    const togglePlayPause = () => {
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    };
  
    return (
      <div onClick={togglePlayPause} className="intro_video">
        <video
          ref={videoRef}
          src= {`${ApiUrl}/image/file-1747376450520-531854352.mp4`} // ensure this has correct extension
          // src="../assets/images/introvedio.mp4" // ensure this has correct extension
          muted
          autoPlay
          loop
          playsInline
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    );
}





const HowItWorks = () =>{
       return(
         <section className="HowItWorks">
            <h1>
            Rental Process Steps
            </h1>
              <ul >
              <li>
                <img src="../assets/images/station.png" alt="" />
                <h2>
                Choose a Station 
                </h2>
                <p>
                Find a nearby station to start your rental process.
                </p>
              </li>
              <li>
                <img src="../assets/images/bank.png" alt="" />
                <h2>
                Choose a bank
                </h2>
                <p>
                find a power Bank to suit your power needs.
                </p>
              </li>
              <li>
                <img src="../assets/images/payment.png" alt="" />
                <h2>
                make payment
                </h2>
                <p>
                make payment to iad in retaining the power bank.
                </p>
              </li>
              <li>
                <img src="../assets/images/power.png" alt="" />
                <h2>
                Enjoy Your Power 
                </h2>
                <p>
                pick up the power bank before time is up and enjoy
                </p>
              </li>
        </ul>
         </section>
       ) 
}


const Location = () =>{
    const [selectedCountry, setSelectedCountry] = useState("");

    const handleInputChange = (value) => {
      setSelectedCountry(value);
      console.log("Selected country:", value);
    };
  
    return (
      <section className="location">
        <h1>Locator for Rental Stations</h1>
  
        <div className="map"><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d219.2007949732686!2d8.145120067945331!3d6.141312310100517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sng!4v1745967685500!5m2!1sen!2sng"  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
  
        <div className="select_location">
          <img src="../assets/images/location-tick.svg" alt="" />
  
          <ExportSelect
            value={selectedCountry}
            onChange={handleInputChange}
            options={[
              { label: "Select Country", value: "" },
              { label: "Nigeria", value: "ng" },
              { label: "Ghana", value: "gh" },
              { label: "Kenya", value: "ke" },
            ]}
            className=""
          />
        </div>
      </section>
    );
}


const UserReviews = () => {
    const [activeIndex, setActiveIndex] = useState(0);
  
    // auto-rotate every 5 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % userReviews.length);
      }, 15000);
  
      return () => clearInterval(interval); // cleanup
    }, []);
  
    // manually switch to selected review
    const handleReviewClick = (index) => {
      setActiveIndex(index);
    };
  
    const activeReview = userReviews[activeIndex];
  
    return (
      <section className="reviews">
        <h1>What our users think</h1>
        <ul>
          <li className="active">
            <img src={activeReview.imageUrl} alt="profile" className="profile" />
            <section className="information">
              <div className="stars row">
                {Array.from({ length: activeReview.stars }).map((_, i) => (
                  <img key={i} src="../assets/images/crown.svg" alt="star" />
                ))}
              </div>
              <p>{activeReview.note}</p>
              <h2>{activeReview.userName}</h2>
  
              <div className="no_of_reviews row">
                {userReviews.map((_, i) => (
                  <span
                    key={i}
                    className={i === activeIndex ? "active" : ""}
                    onClick={() => handleReviewClick(i)}
                  ></span>
                ))}
              </div>
            </section>
          </li>
        </ul>
      </section>
    );
  };
  



export {HeroSection, IntroVideo, HowItWorks, Location, UserReviews};
