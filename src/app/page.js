"use client";
import React, { useState, useEffect } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import ConnectButton from "./components/connectButton";

export default function Home() {
  const tasks = [
    {
      id: 1,
      name: "Follow @DegenApesNFT",
      points: 30000,
      url: "https://x.com/intent/follow?screen_name=DegenApesNFT",
    },
    {
      id: 2,
      name: "Tweet the Message",
      points: 15000,
      url: "https://twitter.com/intent/tweet?text=Join%20The%20Tribe%20%F0%9F%8D%8C%20%F0%9F%90%92%0A%0AThe%20next%20big%20thing%20is%20here%20on%20%40apecoin%0A%0AJoin%20the%20tribe%20and%20secure%20your%20spot:%20https://www.thedegenape.xyz/%20https://x.com/DegenApesNFT/status/1865441906601443491",
    },
    {
      id: 3,
      name: "Reply to the Thread",
      points: 30000,
      url: "https://x.com/intent/post?in_reply_to=1872311422023037190&text=%E2%9C%B3%EF%B8%8F%2B%20%F0%9F%91%BB%20=%20@Abstract_Ghosts%0A%0ADon%27t%20miss%20the%20alpha%2C%20use%20my%20code%3A%0A%0Aabstractghosts.com",
    },
  ];

  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  const [taskStatus, setTaskStatus] = useState(
    tasks.reduce((acc, task) => {
      acc[task.id] = { completed: false };
      return acc;
    }, {})
  );
  const [totalPoints, setTotalPoints] = useState(0);

  const [isReferralPopupOpen, setReferralPopupOpen] = useState(false);
  const [referralCode, setReferralCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoadingPopupOpen, setLoadingPopupOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array(4)
      .fill("")
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  };

  useEffect(() => {
    if (isConnected && !isReferralPopupOpen) {
      setUserReferralCode(generateRandomCode());
      setReferralPopupOpen(true);
    }
  }, [isConnected]);

  const handleReferralNext = () => {
    if (referralCode.some((char) => char === "")) {
      setError("Please enter a valid 4-digit referral code.");
      return;
    }

    setError("");
    setReferralPopupOpen(false);
    setLoadingPopupOpen(true);

    setTimeout(() => {
      setIsProcessing(false);
      setTimeout(() => {
        setTotalPoints((prev) => prev + 1600);
        setLoadingPopupOpen(false);
        setNotification(
          "Congratulations! You are eligible for EARLY OG REWARD."
        );
      }, 1000);
    }, 1000);
  };

  const handleTaskClick = (taskId, taskUrl) => {
    if (!isConnected) {
      open({ view: "Connect" });
      return;
    }

    window.open(taskUrl, "_blank");

    setTaskStatus((prev) => ({
      ...prev,
      [taskId]: { completed: true },
    }));
    setTotalPoints(
      (prev) => prev + tasks.find((task) => task.id === taskId).points
    );
  };

  const handleReferralInputChange = (value, index) => {
    const updatedCode = [...referralCode];
    updatedCode[index] = value.toUpperCase().slice(0, 1);
    setReferralCode(updatedCode);

    if (value && index < 3) {
      document.getElementById(`referral-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !referralCode[index]) {
      document.getElementById(`referral-input-${index - 1}`).focus();
    }
  };

  // Check if all tasks are completed
  const allTasksCompleted = tasks.every(
    (task) => taskStatus[task.id].completed
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="mb-6">
        {isConnected ? (
          <p className="text-lg font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg shadow">
            Wallet Connected: <span className="font-mono">{address}</span>
          </p>
        ) : (
          <button
            onClick={() => open({ view: "Connect" })}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          >
            <ConnectButton />
          </button>
        )}
      </div>

      <h1 className="text-4xl font-bold text-indigo-800 mb-6">
        EARLY OG REWARDS
      </h1>

      <div className="mb-8 text-center">
        <p className="text-lg font-semibold text-gray-700">Total Points:</p>
        <p className="text-3xl font-extrabold text-indigo-600">{totalPoints}</p>
      </div>

      {/* Referral Code Box Above Task List */}
      {allTasksCompleted && (
        <div className="mb-8 p-6 bg-green-100 border border-green-500 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Your Referral Code:
          </h2>
          <p className="text-4xl font-extrabold text-green-800">
            {userReferralCode}
          </p>
        </div>
      )}

      {/* Task List */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between border border-gray-200 hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {task.name}
            </h2>
            <p className="text-lg font-bold text-indigo-600">
              Points: {task.points}
            </p>
            <button
              onClick={() => handleTaskClick(task.id, task.url)}
              className={`px-5 py-3 rounded-lg font-medium text-white transition-all w-full sm:w-auto 
        ${
          taskStatus[task.id].completed
            ? "bg-green-500 cursor-not-allowed opacity-75"
            : isConnected
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed opacity-75"
        }
      `}
              disabled={taskStatus[task.id].completed || !isConnected}
            >
              {taskStatus[task.id].completed ? "✔ Completed" : "Start Task"}
            </button>
          </div>
        ))}
      </div>

      {isReferralPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 scale-95 transform transition-transform duration-300 ease-in-out">
            <h2 className="text-xl font-semibold mb-4">Enter Referral Code</h2>
            <div className="flex justify-between mb-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`referral-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={referralCode[index] || ""}
                  onChange={(e) =>
                    handleReferralInputChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-14 border rounded-lg text-center text-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleReferralNext}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-indigo-700 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isLoadingPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 text-center">
            {isProcessing ? (
              <div className="loader mb-4 animate-spin border-t-4 border-indigo-600 border-solid rounded-full w-12 h-12"></div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Processing...</h2>
                <ol className="text-left list-decimal pl-5">
                  <li className="text-green-600 font-bold">
                    OG Reward: 1600 points
                  </li>
                  <li className="text-gray-400">Transaction Rewards: 0</li>
                  <li className="text-gray-400">Balance Rewards: 0</li>
                </ol>
              </>
            )}
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
}
