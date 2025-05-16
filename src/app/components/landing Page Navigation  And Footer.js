"use client";

import "../css/LandingNavAndFooter.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ExportInput } from "./Inputs";

const Navigation = () => {
  const [pathname, setPathname] = useState("");
  const [isMenuActive, setMenuActive] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setPathname(window.location.pathname);
    const storedUserId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
    setUserId(storedUserId);
  }, []);

  const handleMenuClick = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <section className="container">
      <nav className="landinG_nav">
        <div>
          <div className="logo">
            <strong>Ap</strong>ostle
          </div>
          <ul className={isMenuActive ? 'active' : ''}>
            
              <Link href="/" className={pathname === "/" ? "active" : ""}>
              <li>
                How it works
                </li>
              </Link>
           
          
              <Link href="/ContactUs" className={pathname === "/ContactUs" ? "active" : ""}>
              <li>
                Contact us
                </li>
              </Link>
           
          </ul>
        </div>
        <div>
          <Link href={userId ? "/Dashboard" : "/LogIn"} className="button">
            <img src="../assets/images/key.svg" alt="" />
            <strong>rent now</strong>
          </Link>
          <label
            htmlFor="menu"
            className={`icon ${isMenuActive ? 'active' : ''}`}
            onClick={handleMenuClick}
          >
            <div className="menu"></div>
          </label>
        </div>
      </nav>
    </section>
  );
};

const Footer = () => {
  const [inputData, setInputData] = useState({ type: '', value: '' });

  const handleInputChange = ({ type, value }) => {
    setInputData({ type, value });
    console.log('Input changed:', type, value);
  };

  return (
    <section className="footerContainer">
      <footer>
        <div className="subscribe">
          <h1>Subscribe to our newsletter</h1>
          <div>
            <label>
              <img src="../assets/images/sms.svg" alt="" />
              <ExportInput
                type="email"
                value={inputData.value}
                onChange={handleInputChange}
                placeholder="input your email"
              />
            </label>
            <button>subscribe</button>
          </div>
        </div>
        <div className="other_info">
          <div className="top">
            <div className="logo">
              <strong>Ap</strong>ostle
            </div>
            <ul>
              <li>
                <Link href="/ContactUs">contact us</Link>
              </li>
              <li>
                <Link href="/ContactUs">FAQs</Link>
              </li>
              <li>
                <Link href="#">pricing</Link>
              </li>
              <li>
                <Link href="/">how it works</Link>
              </li>
            </ul>
          </div>
          <hr />
          <p>© 2024 Brand, Inc. • Privacy • Terms • Sitemap</p>
        </div>
      </footer>
    </section>
  );
};

export { Footer, Navigation };
