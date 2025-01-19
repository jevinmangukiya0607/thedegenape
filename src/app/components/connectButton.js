"use client";

import React, { useState, useEffect } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUser } from "@/store/slices/userSlice";
import ReferralCodePopup from "./ReferralCodePopUp";
import { setWalletConnection } from "@/store/slices/walletSlice";

export function ConnectButton() {
  const modal = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch();

  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [referralCode, setReferralCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const { data: user } = useSelector((state) => state.user);

  // Handle the connection and disconnection
  useEffect(() => {
    dispatch(setWalletConnection({ isConnected, address }));

    if (isConnected && address) {
      dispatch(fetchUser(address)).then((action) => {
        if (!action.payload) {
          setShowReferralPopup(true);
        }
      });

      setFadeIn(true);
    } else {
      // Clear cookies
     
      setFadeIn(false);
    }
  }, [isConnected, address, dispatch]);

  // Trigger modal to connect
  function handleConnect() {
    modal.open();
  }

  // Trigger disconnect behavior
  const handleDisconnect = async () => {
    await disconnect(); // Disconnect the wallet

    // Clear cookies
    document.cookie
      .split(";")
      .forEach(
        (cookie) =>
          (document.cookie = `${cookie
            .split("=")[0]
            .trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`)
      );

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Refresh the page to reset the app
    window.location.reload();
  };

  // Referral code handling logic
  function handleReferralInputChange(value, index) {
    const updatedCode = [...referralCode];
    updatedCode[index] = value.toUpperCase();
    setReferralCode(updatedCode);

    if (value && index < referralCode.length - 1) {
      document.getElementById(`referral-input-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(e, index) {
    const key = e.key;
    const maxIndex = referralCode.length - 1;

    if (key === "ArrowRight" && index < maxIndex) {
      document.getElementById(`referral-input-${index + 1}`)?.focus();
    } else if (key === "ArrowLeft" && index > 0) {
      document.getElementById(`referral-input-${index - 1}`)?.focus();
    } else if (key === "Backspace" && index > 0 && !referralCode[index]) {
      const updatedCode = [...referralCode];
      updatedCode[index - 1] = "";
      setReferralCode(updatedCode);
      document.getElementById(`referral-input-${index - 1}`)?.focus();
    }
  }

  function handleReferralNext() {
    const enteredCode = referralCode.join("").trim();

    dispatch(
      createUser({
        walletAddress: address,
        referredBy: enteredCode || "RKPO",
      })
    ).then((action) => {
      if (!action.error) {
        setShowReferralPopup(false);
      } else {
        setError("Invalid referral code.");
      }
    });
  }

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
      {isConnected ? (
        <>
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-customGreen rounded-lg shadow transition-opacity duration-500 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleDisconnect}
          >
            <span className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#0D2C16]">
              {shortAddress}
            </p>
          </div>
        </>
      ) : (
        <button
          onClick={handleConnect}
          className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[240px] h-10 sm:h-12 md:h-14 bg-[#A45737] text-white text-sm sm:text-base md:text-lg font-semibold rounded-[50px] hover:brightness-110 transition"
        >
          Connect Wallet
        </button>
      )}

      {isConnected && showReferralPopup && (
        <ReferralCodePopup
          referralCode={referralCode}
          handleReferralInputChange={handleReferralInputChange}
          handleKeyDown={handleKeyDown}
          handleReferralNext={handleReferralNext}
          error={error}
        />
      )}
    </div>
  );
}

export default ConnectButton;
