"use client";
import React, { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import ConnectButton from "./components/connectButton";

export default function Home() {
  const tasks = [
    { id: 1, name: "Task 1", points: 1000 },
    { id: 2, name: "Task 2", points: 1000 },
    { id: 3, name: "Task 3", points: 1000 },
  ];

  const { open } = useAppKit(); // Control the wallet modal
  const { isConnected, address } = useAppKitAccount(); // Check wallet status
  const [taskStatus, setTaskStatus] = useState(
    tasks.reduce((acc, task) => {
      acc[task.id] = { inProgress: false, completed: false };
      return acc;
    }, {})
  );
  const [totalPoints, setTotalPoints] = useState(0);

  const handleTaskClick = (taskId) => {
    if (!isConnected) {
      open({ view: "Connect" }); // Open the wallet connection modal
      return;
    }

    if (taskStatus[taskId].completed) {
      alert(
        `${tasks.find((task) => task.id === taskId).name} is already completed!`
      );
      return;
    }

    if (taskStatus[taskId].inProgress) {
      alert(
        `${
          tasks.find((task) => task.id === taskId).name
        } is already in progress!`
      );
      return;
    }

    // Mark task as in progress
    setTaskStatus((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], inProgress: true },
    }));

    alert(`${tasks.find((task) => task.id === taskId).name} is in progress!`);

    // Simulate task completion after 7 seconds
    setTimeout(() => {
      setTaskStatus((prev) => ({
        ...prev,
        [taskId]: { inProgress: false, completed: true },
      }));
      setTotalPoints(
        (prev) => prev + tasks.find((task) => task.id === taskId).points
      );
      alert(`${tasks.find((task) => task.id === taskId).name} is completed!`);
    }, 7000);
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

      <h1 className="text-4xl font-bold text-indigo-800 mb-6">Task Manager</h1>

      {/* Total Points */}
      <div className="mb-8 text-center">
        <p className="text-lg font-semibold text-gray-700">Total Points:</p>
        <p className="text-3xl font-extrabold text-indigo-600">{totalPoints}</p>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center border border-gray-200 hover:shadow-xl transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {task.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">Points: {task.points}</p>

            {/* Task Button */}
            <button
              onClick={() => handleTaskClick(task.id)}
              className={`px-5 py-3 rounded-lg font-medium text-white w-full text-center transition-all 
                ${
                  taskStatus[task.id].completed
                    ? "bg-green-500 cursor-not-allowed opacity-75"
                    : taskStatus[task.id].inProgress
                    ? "bg-yellow-500 cursor-wait opacity-75"
                    : isConnected
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed opacity-75"
                }
              `}
              disabled={
                taskStatus[task.id].completed ||
                taskStatus[task.id].inProgress ||
                !isConnected
              }
            >
              {taskStatus[task.id].completed
                ? "✔ Completed"
                : taskStatus[task.id].inProgress
                ? "In Progress..."
                : "Start Task"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
