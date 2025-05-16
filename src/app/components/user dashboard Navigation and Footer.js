"use client";

import "../css/userNavigationAndFooter.css"
import { useEffect, useState } from "react";
import { FetchUserData } from "../UserApiCalles";
import { useRouter, usePathname } from 'next/navigation'; // ✅ import useRouter
import { WinUrl } from "../ApiUrl";
import Link from "next/link";

const Navigation = ({ setEditProfile }) => {
  const router = useRouter(); // ✅ initialize router
  const [apiResponse, setApiResponse] = useState();
  const pathname = usePathname();
  const isProfilePage = pathname === "/Dashboard/Profile";
  const isInRent = pathname === "/Dashboard/rent";

  const handleClick = () => {
    if (isProfilePage) {
      setEditProfile((prev) => !prev);
    }
  };

  useEffect(() => {
    if (apiResponse === null || apiResponse === undefined) return;
    const isBlocked = !apiResponse.AccountSetup || apiResponse.UserStat === 'blocked';
    if (isBlocked && isInRent) {
      router.push("/Dashboard"); // ✅ use router.push instead of window.location.href
    }
  }, [apiResponse]);

  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
      if (!userId) {
        router.push("/");
      }
      console.log("going");
      const result = await FetchUserData();
      if (result.status) {
        setApiResponse(result.data.user);
        if (["admin", "owner"].includes(result.data.user.UserStat)) {
          const confirmRedirect = window.confirm("Your account is an admin account. Do you want to go to the admin panel?");
          if (confirmRedirect) {
            router.push("/Admin"); // ✅ use router.push instead of window.location.href
          }
        }
      } else {
        console.warn("Fetch error:", result.message);
      }
    };

    loadUser();
  }, []);

  return (
    <nav>
      <h1>
        Ap<strong>ostle</strong>
      </h1>

      <section className="user_info">
        <div>
          <h1>
            welcome<strong> back</strong>
          </h1>
          <h2>{apiResponse?.UserName || "..."}</h2>
        </div>
        {!isProfilePage ? (
          <Link href="/Dashboard/Profile">
            <button type="button">Profile</button>
          </Link>
        ) : (
          <div className="row">
            <button type="button" onClick={handleClick}>
              Edit Profile
            </button>
            <button type="button" onClick={() => {
              localStorage.removeItem("ApostlesRentalWebsiteForPowerBanksUserId");
              window.location.href=`${WinUrl}` // ✅ use router.push instead of window.location.href
            }}>
              <p>logout</p>
              <img src="/assets/images/logout.svg" alt="logout" />
            </button>
          </div>
        )}
      </section>

      <ul>
        <li>
          <Link href="/Dashboard">
            <img src="/assets/images/home.svg" alt="home" />
          </Link>
        </li>

        <li style={{
          pointerEvents: apiResponse && (!apiResponse.AccountSetup || apiResponse.UserStat === 'blocked') ? "none" : "auto",
          opacity: apiResponse && (!apiResponse.AccountSetup || apiResponse.UserStat === 'blocked') ? 0.5 : 1
        }}>
          <Link href={apiResponse && (!apiResponse.AccountSetup || apiResponse.UserStat === 'blocked') ? "#" : "/Dashboard/rent"}>
            Rent New Power Bank
          </Link>
        </li>

        <li><Link href="/Dashboard/ActiveRentals">active rentals</Link></li>
        <li><Link href="/Dashboard/Reserve">Reserves</Link></li>
        <li><Link href="/Dashboard/RentalHistory">view rental history</Link></li>
      </ul>

      {apiResponse && !apiResponse.AccountSetup && (
        <Link href="/Dashboard/Profile">
          <h2 className="error">
            Your account has not been verified. If you have updated your profile, please visit any nearby shop to complete the verification process. You will not be able to rent a power bank until verification is complete. Click here to proceed to your profile.
          </h2>
        </Link>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer>
      <section>
        <div>
          <h1>
            Ap<strong>ostle</strong>
          </h1>
          <ul>
            <li><Link href="/ContactUs">contact us</Link></li>
            <li><Link href="/ContactUs">FAQs</Link></li>
            <li><Link href="#">pricing</Link></li>
            <li><Link href="/">how it works</Link></li>
          </ul>
        </div>
        <hr />
        <p>© 2024 Brand, Inc. • Privacy • Terms • Sitemap</p>
      </section>
    </footer>
  );
};

export { Navigation, Footer };
