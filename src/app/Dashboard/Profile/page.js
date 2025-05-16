"use client";

import { useEffect, useState } from "react";

import { Footer, Navigation } from "../../components/user dashboard Navigation and Footer";
import { Component, EditUserProfile, ViewPin } from "./Components";




export default function App() {
    const [editProfile, setEditProfile] = useState(false);
    const [viewPin, setViewPin] = useState(false);
    // const [editUserActive, setEditUserActive] = useState(false);
    // const [viewPinActive, setViewPinActive] = useState(false);
  // Reload the page if either editUserActive or viewPinActive is false
  
  return (
    <>
      <Navigation setEditProfile={setEditProfile} />

      {/* Show Edit User Profile if active */}
      {editProfile ? (
        <EditUserProfile setEditUserActive={setEditProfile} />
      ) : viewPin ? (
        <ViewPin setViewPinActive={setViewPin} />
      ) : (
        <Component setViewPin={setViewPin} />
      )}

      <Footer />
    </>
  );
}