"use client";


import { Footer, Navigation} from "@/app/components/Admin Page Navigation And Footer";
import { Confirmation} from "./components";
import { useEffect, useState, useRef } from "react";



const page = () => {
 
    return (
        <>
        <Navigation/>

            <Confirmation/>

        <Footer/>
        </>
    );
}

export default page;