import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserTaskStatus, addPoints } from "@/store/slices/userSlice";

export default function TaskItem({ task, isConnected }) {
  const { address: walletAddress } = useSelector((state) => state.wallet);
  const userTasks = useSelector((state) => state.user.data.tasks);
  const dispatch = useDispatch();

  // Check the task's initial completion status from persisted user tasks
  const isTaskCompleted =
    userTasks.find((t) => t.taskId.taskId === task.taskId)?.status || false;

  const [localCompleted, setLocalCompleted] = useState(isTaskCompleted);

  useEffect(() => {
    // Sync the initial completed state from Redux
    setLocalCompleted(isTaskCompleted);
  }, [isTaskCompleted]);

  const handleTaskClick = async () => {
    if (!isConnected || !walletAddress) return;

    try {
      // Optimistically mark task as completed
      setLocalCompleted(true);

      // Update task completion in the backend
      const response = await dispatch(
        updateUserTaskStatus({
          walletAddress,
          taskId: task.taskId,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        // Add points for the task if the update was successful
        await dispatch(addPoints({ walletAddress, points: task.points }));
      } else {
        throw new Error("Task update failed");
      }
    } catch (error) {
      console.error("Error updating task:", error);

      // Revert task completion on failure
      setLocalCompleted(false);
    }
  };

  return (
    <div className="bg-[#e5c08d] shadow-lg border-2 border-black p-4 flex items-center justify-between">
      <h2 className="text-lg font-bold text-black">{task.name}</h2>
      <p className="text-md font-bold text-black">Points: {task.points}</p>
      <button
        onClick={handleTaskClick}
        className={`px-4 py-2 border-2 border-black font-bold text-black transition-all ${
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
