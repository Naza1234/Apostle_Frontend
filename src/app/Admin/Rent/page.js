"use client";


import { Footer, Navigation} from "@/app/components/Admin Page Navigation And Footer";
import { useEffect, useState, useRef } from "react";
import { ChoseType } from "./components";



const page = () => {
 
    return (
        <>
        <Navigation/>


        <ChoseType/>
         

        <Footer/>
        </>
    );
}

export default page;