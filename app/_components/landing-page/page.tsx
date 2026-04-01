"use client";

import React from "react";
import LandingPage from "./landing-page";
import VerifiedProfiles from "./verified-profiles";
import HowItWorks from "./how-it-works";

const LandingMain = () => {
  return (
    <div className="flex flex-col">
      <LandingPage />
      <VerifiedProfiles />
      <HowItWorks />
    </div>
  );
};

export default LandingMain;

