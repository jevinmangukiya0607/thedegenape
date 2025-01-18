"use client";

import React from "react";

export default function LoadingComponent() {
  return (
    <div
      className="h-screen w-full bg-fixed bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/img/bg.png')", // Replace with your green background image
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Loading Spinner with Wood Texture */}
        <div className="flex items-center justify-center">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-4 rounded-full animate-spin"
            style={{
              borderColor: "transparent transparent #deb887 #deb887", // Wood texture-inspired color
            }}
          ></div>
        </div>

        {/* Loading Text with Wood Texture */}
        <p
          className="text-center font-medium text-xs sm:text-sm lg:text-base"
          style={{
            color: "#deb887", // Wood texture color
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
