"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import { checkAllTasksComplete } from "@/store/slices/userSlice"; // Import the thunk
import TaskList from "./components/TaskList";
import TotalPoints from "./components/TotalPoints";
import { ConnectButton } from "./components/connectButton";
import AllTasksCompletedPopup from "./components/TaskCompletePopup";
import NotificationPopup from "./components/NotificationPopup";

export default function Home() {
  const dispatch = useDispatch();

  // Redux state for user, tasks, and wallet
  const { data: user, loading: userLoading } = useSelector(
    (state) => state.user
  );
  const { tasks, loading: tasksLoading } = useSelector((state) => state.task);
  const { isConnected } = useSelector((state) => state.wallet);

  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    // Fetch tasks on page load
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    // Check if all tasks are completed using the API
    const isPopupShown = localStorage.getItem("popupShown");

    if (user.walletAddress) {
      dispatch(checkAllTasksComplete(user.walletAddress)).then((result) => {
        if (result.payload?.allTasksComplete) {
          setReferralCode(user.referralCode); // Set referral code from user data

          // Show the popup and notification only if they haven't been displayed before
          if (!isPopupShown) {
            setShowNotification(true);
            setShowPopup(true);
            localStorage.setItem("popupShown", "true"); // Mark popup as shown
          }
        }
      });
    }
  }, [dispatch, user.walletAddress, user.referralCode]);

  const totalPoints = user.points || 0;

  return (
    <div
      className="h-screen w-full bg-fixed bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/img/bg.png')",
      }}
    >
      <div
        className="h-screen w-full bg-fixed bg-cover bg-center flex justify-center items-center flex-col px-4 sm:px-8 gap-6"
        style={{
          backgroundImage: "url('/img/main.png')",
        }}
      >
        {/* Header */}
        <h1 className="text-black font-bold text-lg sm:text-2xl md:text-3xl mb-4 text-center">
          Early OG Rewards
        </h1>

        {/* Connect Wallet Button */}
        <div className="z-10 mb-4">
          <ConnectButton />
        </div>

        {/* Total Points */}
        <div className="w-full flex justify-center">
          <TotalPoints totalPoints={totalPoints} />
        </div>

        {/* Referral Code */}
        {referralCode && (
          <div className="w-full flex justify-center mt-4">
            <p className="text-black font-medium text-lg">
              🎉 Your Referral Code:{" "}
              <span className="font-bold text-blue-600">{referralCode}</span>
            </p>
          </div>
        )}

        {/* Task List */}
        <div className="w-full">
          <TaskList tasks={tasks} isConnected={isConnected} />
        </div>
      </div>

      {/* All Tasks Completed Popup */}
      {showPopup && (
        <AllTasksCompletedPopup onClose={() => setShowPopup(false)} />
      )}
      {showNotification && (
        <NotificationPopup
          message="🎉 You are eligible for Early OG Rewards!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
