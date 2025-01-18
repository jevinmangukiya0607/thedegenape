import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserTaskStatus, addPoints } from "@/store/slices/userSlice";

export default function TaskItem({ task, isConnected }) {
  const { address: walletAddress } = useSelector((state) => state.wallet);
  const userTasks = useSelector((state) => state.user.data.tasks);
  const dispatch = useDispatch();

  const isTaskCompleted =
    userTasks.find((t) => t.taskId.taskId === task.taskId)?.status || false;

  const [localCompleted, setLocalCompleted] = useState(isTaskCompleted);

  useEffect(() => {
    setLocalCompleted(isTaskCompleted);
  }, [isTaskCompleted]);

  const handleTaskClick = async () => {
    if (!isConnected || !walletAddress) return;

    try {
      window.open(task.url, "_blank");

      setTimeout(async () => {
        setLocalCompleted(true);

        try {
          const response = await dispatch(
            updateUserTaskStatus({
              walletAddress,
              taskId: task.taskId,
            })
          );

          if (response.meta.requestStatus === "fulfilled") {
            await dispatch(addPoints({ walletAddress, points: task.points }));
          } else {
            throw new Error("Task update failed");
          }
        } catch (error) {
          console.error("Error updating task:", error);
          setLocalCompleted(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Error handling task click:", error);
    }
  };

  return (
    <div className="bg-[#e5c08d] shadow-lg border-2 border-black p-2 lg:p-4 flex flex-col items-center sm:flex-row sm:justify-between gap-2 lg:gap-4 text-center sm:text-left lg:max-w-4xl">
      {/* Task Name */}
      <h2 className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-black">
        {task.name}
      </h2>

      {/* Task Points */}
      <p className="text-xs sm:text-sm lg:text-lg xl:text-xl font-bold text-black">
        Points: {task.points}
      </p>

      {/* Task Button */}
      <button
        onClick={handleTaskClick}
        className={`w-full sm:w-auto lg:w-1/3 px-2 lg:px-4 py-1 lg:py-2 text-xs sm:text-sm lg:text-base xl:text-lg border-2 border-black font-bold text-black transition-all ${
          localCompleted
            ? "bg-gray-400 cursor-not-allowed"
            : isConnected
            ? "bg-[#d8f8bc] hover:brightness-110"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={localCompleted || !isConnected}
      >
        {localCompleted ? "✔ Completed" : "START TASK"}
      </button>
    </div>
  );
}
