import React from "react";

export default function TotalPoints({ totalPoints }) {
  return (
    <div className="bg-[#e5c08d] shadow-lg border-2 border-black p-4 flex flex-col items-center justify-between max-w-[90%] sm:max-w-[80%] md:max-w-[60%] w-full">
      <h2 className="text-sm sm:text-base md:text-lg font-bold text-black text-center">
        To claim your early rewards, connect your wallet and complete these
        tasks.
      </h2>
      <p className="text-xs sm:text-sm md:text-md font-bold text-black mt-2">
        Total Points: {totalPoints}
      </p>
    </div>
  );
}
