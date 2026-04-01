import React from "react";
import "./loadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="mx-auto mb-6 flex items-center justify-center gap-2">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-maroon">MM</span>
            <span className="text-[#D4AF37] ml-1">Tamil</span>
          </span>
        </div>

        <div className="loading-message">
          Just a moment &mdash; we&apos;re getting things ready
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
