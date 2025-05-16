import React, { Suspense } from "react";
import { Footer, Navigation } from "../components/landing Page Navigation  And Footer";
import { LogInForm } from "./components";

const Page = () => {
  return (
    <>
      <Navigation />

      <Suspense fallback={<div>Loading...</div>}>
        <LogInForm />
      </Suspense>

      <Footer />
    </>
  );
};

export default Page;
