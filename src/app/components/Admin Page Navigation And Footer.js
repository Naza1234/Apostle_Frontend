"use client";

import "../css/AdminNavAndFooter.css"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'; // ✅ import useRouter
import { FetchAdminData } from "../Adminapicalls";
import { WinUrl } from "../ApiUrl";

const Navigation = () => {
  const [apiResponse, setApiResponse] = useState();
  const router = useRouter(); // ✅ initialize router
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem("ApostlesRentalWebsiteForPowerBanksUserId");
      if (!userId) {
        router.push("/");
        return;
      }
      const result = await FetchAdminData();
      if (result.status) {
        setApiResponse(result.data.user);
        if (result.data.user.UserStat !== "admin") {
          router.push("/"); // ✅ use router.push instead of window.location.href
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

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("ApostlesRentalWebsiteForPowerBanksUserId");
            router.push("/"); // ✅ use router.push instead of window.location.href
          }}
        >
          <p>logout</p>
          <img src="/assets/images/logout.svg" alt="logout" />
        </button>
      </section>

      <ul>
        <li>
          <Link href="/Admin">
            <img src="/assets/images/home.svg" alt="home" />
          </Link>
        </li>
        <li>
          <Link href="/Admin/Rent">rent</Link>
        </li>
        <li>
          <Link href="/Admin/Return">return</Link>
        </li>
        <li>
          <Link href="/Admin/ActiveRentals">active</Link>
        </li>
        <li>
          <Link href="/Admin/OverDue">overDue</Link>
        </li>
        <li>
          <Link href="/Admin/reserved">reserved</Link>
        </li>
        <li>
          <Link href="/Admin/History">history</Link>
        </li>
        <li>
          <Link href="/Admin/Users">users</Link>
        </li>
        <li>
          <Link href="/Admin/Pricing">pricing</Link>
        </li>
      </ul>
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
      </section>
    </footer>
  );
};

export { Navigation, Footer };
