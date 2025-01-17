"use client";

import React, { useState, useEffect } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUser } from "@/store/slices/userSlice";
import ReferralCodePopup from "./ReferralCodePopUp";
import { setWalletConnection } from "@/store/slices/walletSlice";

export function ConnectButton() {
  const modal = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const dispatch = useDispatch();

  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [referralCode, setReferralCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const { data: user, loading } = useSelector((state) => state.user);

  // Sync wallet connection status and fetch user data
  useEffect(() => {
    // Update wallet state in Redux
    dispatch(setWalletConnection({ isConnected, address }));

    if (isConnected && address) {
      dispatch(fetchUser(address)).then((action) => {
        // Show referral popup if user is not found
        if (!action.payload) {
          setShowReferralPopup(true);
        }
      });
    }
  }, [isConnected, address, dispatch]);

  function handleConnect() {
    modal.open(); // Open wallet modal
  }

  // Handle keyboard navigation and input logic for referral code
  function handleKeyDown(e, index) {
    const key = e.key;
    const maxIndex = 3; // Max length of the referral code

    if (key === "ArrowRight" && index < maxIndex) {
      document.getElementById(`referral-input-${index + 1}`)?.focus();
    } else if (key === "ArrowLeft" && index > 0) {
      document.getElementById(`referral-input-${index - 1}`)?.focus();
    } else if (key === "Backspace" && index > 0 && !referralCode[index]) {
      const updatedCode = [...referralCode];
      updatedCode[index - 1] = ""; // Clear the previous input
      setReferralCode(updatedCode);
      document.getElementById(`referral-input-${index - 1}`)?.focus();
    }
  }

  // Handle referral popup submission
  function handleReferralNext() {
    const enteredCode = referralCode.join("").trim(); // Combine referral code

    dispatch(
      createUser({
        walletAddress: address,
        referredBy: enteredCode || "RKPO", // Use default referral code if none is entered
      })
    ).then((action) => {
      if (!action.error) {
        setShowReferralPopup(false); // Close referral popup
      } else {
        setError("Invalid referral code."); // Show error message
      }
    });
  }

  // Trimmed wallet address: Show first 6 and last 4 characters
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Show wallet connection status or connect button */}
      {isConnected ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg shadow">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-lg font-bold text-green-700">{shortAddress}</p>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="btn-connect w-full md:w-64 lg:w-[320px] lg:h-[55px] text-xl font-black text-[#163900] bg-[#d8f8bc] border-2 border-black rounded-lg shadow-md hover:brightness-110 transition"
        >
          CONNECT WALLET
        </button>
      )}

      {/* Referral code popup */}
      {isConnected && showReferralPopup && (
        <ReferralCodePopup
          referralCode={referralCode}
          handleReferralInputChange={(value, index) => {
            const updatedCode = [...referralCode];
            updatedCode[index] = value.toUpperCase(); // Convert input to uppercase
            setReferralCode(updatedCode);
          }}
          handleKeyDown={handleKeyDown}
          handleReferralNext={handleReferralNext}
          error={error}
        />
      )}
    </div>
  );
}

export default ConnectButton;
