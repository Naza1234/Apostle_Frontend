"use client";

import { confirmPayOutHandler } from "@/app/UserApiCalles";
import "../../css/process.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ useRouter for native navigation
import { WinUrl } from "@/app/ApiUrl";

const Component = () => {
  const [stage, setStage] = useState("processing");
  const [error, setError] = useState(false);
  const router = useRouter();

  const extractUrlParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of urlParams.entries()) {
      result[key] = value;
    }

    return result;
  };

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const urlData = extractUrlParams();
        const result = await confirmPayOutHandler(urlData);

        if (result.Status === "success") {
          setStage("done");

          // ✅ Use router.push instead of window.location.href
          setTimeout(() => {
            router.push("/Dashboard");
          }, 2000);
        } else {
          console.error("Unexpected status:", result);
          setError(true);
        }
      } catch (error) {
        console.error("Error confirming payout:", error);
        setError(true);
      }
    };

    confirmPayment();
  }, [router]);

  return (
    <main className="animation-wrapper">
      {error ? (
        <p className="error">Something went wrong while processing your request. Please try again.</p>
      ) : stage === "processing" ? (
        <>
          <span className="loader"></span>
          <p>Please wait while we process your order. Do not close this page until the process is complete.</p>
        </>
      ) : (
        <>
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <p>Process complete. Thank you for using our service. Please go to the nearest shop to pick up your order before the time expires.</p>
          <p>Redirecting...</p>
        </>
      )}
    </main>
  );
};

export { Component };
