"use client";

import { useEffect, useState } from "react";

import { Footer, Navigation } from "../../components/user dashboard Navigation and Footer";
import { Component } from "./Components";



export default function App() {

  return (
    <>
      <Navigation/>

      <Component/>

      <Footer />
    </>
  );
}