"use client";

import React, { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUser } from "@/store/slices/userSlice";
import ReferralCodePopup from "./ReferralCodePopUp";
import ConnectButton from "./connectButton";
import { setWalletConnection } from "@/store/slices/walletSlice";

export default function WalletConnection({ open }) {
  const { isConnected, address } = useAppKitAccount();
  const dispatch = useDispatch();
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [referralCode, setReferralCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const userState = useSelector((state) => state.user);
  const { data: user, loading } = userState;

  useEffect(() => {
    dispatch(setWalletConnection({ isConnected, address }));
    if (isConnected && address) {
      dispatch(fetchUser(address)).then((action) => {
        if (!action.payload) {
          setShowReferralPopup(true);
        }
      });
    }
  }, [isConnected, address, dispatch]);

  const handleReferralNext = () => {
    const enteredCode = referralCode.join("").trim();
    dispatch(
      createUser({ walletAddress: address, referredBy: enteredCode || "RKPO" })
    ).then((action) => {
      if (!action.error) setShowReferralPopup(false);
      else setError("Invalid referral code.");
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected ? (
        <>
          <p className="text-lg font-bold text-green-700 bg-green-100 px-4 py-2 rounded-lg shadow">
            Wallet Connected: <span className="font-mono">{address}</span>
          </p>

          {showReferralPopup && (
            <ReferralCodePopup
              referralCode={referralCode}
              handleReferralInputChange={(value, index) => {
                const updatedCode = [...referralCode];
                updatedCode[index] = value.toUpperCase();
                setReferralCode(updatedCode);
              }}
              handleKeyDown={(e, index) => {
                if (e.key === "Backspace") {
                  const updatedCode = [...referralCode];
                  updatedCode[index] = "";
                  setReferralCode(updatedCode);
                }
              }}
              handleReferralNext={handleReferralNext}
              error={error}
            />
          )}
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
