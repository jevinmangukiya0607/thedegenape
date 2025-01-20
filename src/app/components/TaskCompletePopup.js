"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints } from "@/store/slices/userSlice";

export default function AllTasksCompletedPopup({ onClose }) {
  const dispatch = useDispatch();
  const { data: user, loading, error } = useSelector((state) => state.user);

  const [step, setStep] = useState(0); // Tracks the current step (0, 1, 2)
  const [isLoading, setIsLoading] = useState(true); // Show loader during processing
  const [showFinalMessage, setShowFinalMessage] = useState(false); // Show final message
  const stepPoints = [50, 50, 50]; // Points for each step

  useEffect(() => {
    if (!user?.walletAddress) return;

    let stepsTimer;

    const processSteps = () => {
      if (step < 2) {
        setStep((prev) => prev + 1);
      } else {
        clearInterval(stepsTimer);
        setIsLoading(false);
      }
    };

    stepsTimer = setInterval(processSteps, 1500);

    return () => clearInterval(stepsTimer);
  }, [step, user?.walletAddress]);

  useEffect(() => {
    if (!isLoading && step === 2) {
      dispatch(addPoints({ walletAddress: user.walletAddress, points: 1900 }))
        .unwrap()
        .then(() => console.log("Points successfully updated"))
        .catch((err) => console.error("Failed to update points:", err));
    }
  }, [dispatch, isLoading, step, user?.walletAddress]);

  const handleClose = () => {
    if (onClose) onClose();
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 text-center">
        {!showFinalMessage ? (
          <>
            <h2 className="text-xl font-bold mb-4">🎉 All Tasks Completed!</h2>

            {isLoading ? (
              <div className="mb-4">
                <div className="loader mb-4 animate-spin border-t-4 border-indigo-600 border-solid rounded-full w-12 h-12 mx-auto"></div>
                <p className="text-gray-300">Processing...</p>
              </div>
            ) : (
              <p className="text-green-500 mb-4">✅ Process Complete!</p>
            )}

            <ol className="text-left list-decimal pl-5 mb-4 text-gray-300">
              <li className={step >= 0 ? "text-green-400" : "text-gray-500"}>
                Balance Rewards: {step >= 0 ? "100" : "0"}
              </li>
              <li className={step >= 1 ? "text-green-400" : "text-gray-500"}>
                Transaction Rewards: {step >= 1 ? "200" : "0"}
              </li>
              <li className={step >= 2 ? "text-green-400" : "text-gray-500"}>
                OG Reward: {step >= 2 ? "1600 points" : "0"}
              </li>
            </ol>

            {!isLoading && (
              <button
                onClick={() => setShowFinalMessage(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 transition-all"
              >
                Got It!
              </button>
            )}

            {error && (
              <p className="text-red-500 mt-4">
                Error updating points: {error}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-yellow-400">
              🎉 You are eligible for Early OG Rewards!
            </h2>
            <button
              onClick={handleClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition-all"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

