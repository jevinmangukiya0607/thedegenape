"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import TaskList from "./components/TaskList";
import TotalPoints from "./components/TotalPoints";
import { ConnectButton } from "./components/connectButton";

export default function Home() {
  const dispatch = useDispatch();

  // Redux state for user, tasks, and wallet
  const { data: user } = useSelector((state) => state.user);
  const { tasks } = useSelector((state) => state.task);
  const { isConnected } = useSelector((state) => state.wallet);

  useEffect(() => {
    // Fetch tasks on page load
    dispatch(fetchTasks());
  }, [dispatch]);

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

        {/* Task List */}
        <div className="w-full">
          <TaskList tasks={tasks} isConnected={isConnected} />
        </div>
      </div>
    </div>
  );
}
