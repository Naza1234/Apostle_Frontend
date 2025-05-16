"use client";

import { useEffect, useState } from "react";


import { Footer, Navigation } from "@/app/components/user dashboard Navigation and Footer";
import {Component, PayOut, RentOnReserve, RentOnSpot} from "./components";


const page = () => {

    const [rentOnSpot, setRentOnSpot] = useState(false);
    const [reserveRent, setReserveRent] = useState(false);
    const [ShowPayout, setShowPayout] = useState(false);
    const [forms, setForms] = useState([]);
    // const [spotForms, setSpotForms] = useState([]);
   
    return (
        <>
        <Navigation/>
     
        {ShowPayout ? (
      <PayOut
        PayoutItems={forms}
        ShowPayout={setShowPayout}
      />
    ) : reserveRent ? (
      <RentOnReserve 
        RentOnReserveNotActive={setReserveRent}
        PayoutItems={setForms}
        ShowPayout={setShowPayout}
      />
    ) : rentOnSpot ? (
      <RentOnSpot 
        RentOnSpotNotActive={setRentOnSpot}
        PayoutItems={setForms}
        ShowPayout={setShowPayout}
      />
    ) : (
      <Component 
        RentOnReserveNotActive={setReserveRent} 
        RentOnSpotNotActive={setRentOnSpot}
      />
    )}

        <Footer/>
        </>
    );
}

export default page;