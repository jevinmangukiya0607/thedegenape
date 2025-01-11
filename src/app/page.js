'use client'
import React, { useState } from "react";
import ConnectButton from "./components/connectButton";

export default function Home() {
  const tasks = [
    { id: 1, name: "Task 1", points: 1000 },
    { id: 2, name: "Task 2", points: 1000 },
    { id: 3, name: "Task 3", points: 1000 },
  ];

  const [taskStatus, setTaskStatus] = useState(
    tasks.reduce((acc, task) => {
      acc[task.id] = { inProgress: false, completed: false };
      return acc;
    }, {})
  );

  const [totalPoints, setTotalPoints] = useState(0);

  const handleTaskClick = (taskId) => {
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

    //task completion after 7 seconds
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <div className="mb-6">
        <ConnectButton />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">Task Manager</h1>

      <div className="mb-6">
        <span className="text-lg font-semibold text-gray-600">
          Total Points:{" "}
        </span>
        <span className="text-2xl font-bold text-green-500">{totalPoints}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {task.name}
            </h2>
            <p className="text-gray-600 mb-4">Points: {task.points}</p>

            <button
              onClick={() => handleTaskClick(task.id)}
              className={`px-4 py-2 rounded-lg font-medium text-white w-full transition-all 
                ${
                  taskStatus[task.id].completed
                    ? "bg-green-500 cursor-not-allowed"
                    : taskStatus[task.id].inProgress
                    ? "bg-yellow-500 cursor-wait"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
              disabled={
                taskStatus[task.id].completed || taskStatus[task.id].inProgress
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
