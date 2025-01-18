'use client'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import { checkAllTasksComplete } from "@/store/slices/userSlice";
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
    // Fetch the task completion status when the user connects
    if (user.walletAddress) {
      dispatch(checkAllTasksComplete(user.walletAddress));
    }
  }, [dispatch, user.walletAddress]);

  useEffect(() => {
    // Watch for changes in task completion and the oneTimeTask field
    const isPopupShown = localStorage.getItem("popupShown");

    if (user.allTasksComplete) {
      setReferralCode(user.referralCode); // Set referral code from user data

      if (!user.oneTimeTask && !isPopupShown) {
        setShowNotification(true);
        setShowPopup(true);
        localStorage.setItem("popupShown", "true"); // Mark popup as shown
      }
    }
  }, [user.allTasksComplete, user.oneTimeTask, user.referralCode]);

  const totalPoints = user.points || 0;

  return (
    <div
      className="h-screen w-full bg-fixed bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/img/bg.png')",
      }}
    >
      <div
        className="h-full w-full bg-fixed bg-cover bg-center flex justify-center items-center flex-col px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 lg:gap-8"
        style={{
          backgroundImage: "url('/img/main.png')",
        }}
      >
        {/* Header */}
        <h1 className="text-black font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl mb-2 sm:mb-4 lg:mb-6 text-center leading-tight sm:leading-normal lg:leading-snug">
          Early OG Rewards
        </h1>

        {/* Connect Wallet Button */}
        <div className="z-10 mb-4 lg:mb-6">
          <ConnectButton className="px-3 py-2 text-xs sm:text-sm md:text-base lg:text-lg sm:px-4 sm:py-2 md:px-6 md:py-3" />
        </div>

        {/* Total Points */}
        <div className="w-full flex justify-center">
          <TotalPoints totalPoints={totalPoints} />
        </div>

        {/* Referral Code */}
        {referralCode && (
          <div className="w-full flex justify-center mt-2 sm:mt-4 lg:mt-6">
            <p className="text-black font-medium text-xs sm:text-sm md:text-base lg:text-lg text-center">
              🎉 Your Referral Code:{" "}
              <span className="font-bold text-blue-600">{referralCode}</span>
            </p>
          </div>
        )}

        {/* Task List */}
        <div className="w-full max-w-3xl lg:max-w-5xl px-2 lg:px-4">
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
