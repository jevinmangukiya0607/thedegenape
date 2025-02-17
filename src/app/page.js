"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import TaskList from "./components/TaskList";
import { ConnectButton } from "./components/connectButton";

export default function Home() {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.task);
  const { isConnected } = useSelector((state) => state.wallet);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalPoints = user.points || 0;

  // Check if all tasks are completed
  const allTasksCompleted =
    user.tasks?.length > 0 && user.tasks.every((task) => task.status === true);

  const referralCode = user.referralCode || "N/A"; // Fallback in case referralCode is undefined

  return (
    <div
      className="h-screen w-full overflow-y-auto bg-cover bg-center px-2 sm:px-4"
      style={{
        backgroundImage: "url('/img/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 gap-6 sm:gap-8 w-full max-w-[100%] min-h-full mt-8 sm:mt-12">
        {/* Connect Button */}
        <div className="mt-4 sm:mt-6">
          <ConnectButton />
        </div>

        {/* Header */}
        <h1
          className="font-bold text-base sm:text-xl md:text-2xl lg:text-4xl text-center mt-6 sm:mt-8"
          style={{ color: "#EBBC78" }}
        >
          Early OG Rewards
        </h1>

        {/* Total Points */}
        <div
          className="flex justify-center items-center text-center font-regular text-lg mt-4"
          style={{
            color: "#EBBC78",
          }}
        >
          Total Points:
        </div>
        <div
          className="flex justify-center items-center text-center font-bold text-lg sm:text-xl md:text-2xl"
          style={{
            color: "#EBBC78",
          }}
        >
          {totalPoints}
        </div>

        {/* Referral Code (Shown only if all tasks are completed) */}
        {allTasksCompleted && (
          <div className="bg-yellow-200 text-yellow-800 px-6 py-4 rounded-lg text-center font-semibold text-sm sm:text-lg md:text-xl mt-6 sm:mt-8">
            🎉 Your Referral Code:{" "}
            <span className="font-bold text-lg sm:text-xl md:text-2xl">
              {referralCode}
            </span>
          </div>
        )}

        {/* Task List */}
        <div className="mt-8 sm:mt-10 w-full">
          <TaskList tasks={tasks} isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
}
