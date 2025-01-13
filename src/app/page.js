"use client";
import React, { useState } from "react";
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

  const { open } = useAppKit(); // Control the wallet modal
  const { isConnected, address } = useAppKitAccount(); // Check wallet status
  const [taskStatus, setTaskStatus] = useState(
    tasks.reduce((acc, task) => {
      acc[task.id] = { completed: false };
      return acc;
    }, {})
  );
  const [totalPoints, setTotalPoints] = useState(0);

  const handleTaskClick = (taskId, taskUrl) => {
    if (!isConnected) {
      open({ view: "Connect" }); // Open the wallet connection modal
      return;
    }

    // Open the respective task URL in a new tab
    window.open(taskUrl, "_blank");

    // Mark task as completed and update points
    setTaskStatus((prev) => ({
      ...prev,
      [taskId]: { completed: true },
    }));
    setTotalPoints(
      (prev) => prev + tasks.find((task) => task.id === taskId).points
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex flex-col items-center justify-center py-10 px-4">
      {/* Wallet Connection Status */}
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

      {/* Total Points */}
      <div className="mb-8 text-center">
        <p className="text-lg font-semibold text-gray-700">Total Points:</p>
        <p className="text-3xl font-extrabold text-indigo-600">{totalPoints}</p>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between border border-gray-200 hover:shadow-xl transition-all"
          >
            {/* Task Name */}
            <h2 className="text-2xl font-semibold text-gray-800">
              {task.name}
            </h2>

            {/* Points */}
            <p className="text-lg font-bold text-indigo-600">
              Points: {task.points}
            </p>

            {/* Task Button */}
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
    </div>
  );
}
