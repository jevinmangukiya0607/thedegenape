import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserTaskStatus,
  addPoints,
  checkAllTasksComplete,
} from "@/store/slices/userSlice";
import AllTasksCompletedPopup from "./TaskCompletePopup";
import {
  isTaskNameRelatedToThreadOrComment,
  generateCustomPostUrl,
  generateCustomMessage,
} from "@/utils/twitter";

export default function TaskItem({ task, isConnected }) {
  const { address: walletAddress } = useSelector((state) => state.wallet);
  const user = useSelector((state) => state.user.data);
  const userTasks = user.tasks;
  const dispatch = useDispatch();

  const isTaskCompleted =
    userTasks.find((t) => t.taskId.taskId === task.taskId)?.status || false;

  const [localCompleted, setLocalCompleted] = useState(isTaskCompleted);
  const [showNotification, setShowNotification] = useState(false);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setLocalCompleted(isTaskCompleted);
  }, [isTaskCompleted]);

  const handleTaskClick = async () => {
    if (!isConnected || !walletAddress) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      return;
    }

    try {
      let taskUrl = task.url;
      if (isTaskNameRelatedToThreadOrComment(task.name)) {
        const referralCode = user.referralCode || "defaultCode"; // Example: Retrieve the referral code from user data
        const customMessage = generateCustomMessage(referralCode);
        taskUrl = generateCustomPostUrl(task.url, customMessage);
      }

      window.open(taskUrl, "_blank");

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
          setLocalCompleted(false);
        }

        // Delay the allTasksComplete check by 2 seconds
        const result = await dispatch(
          checkAllTasksComplete(user.walletAddress)
        );
        const data = result.payload;
        if (data.allTasksComplete) {
          setShowNewNotification(true);
          setShowPopup(true);
        }
      }, 5000);
    } catch (error) {
      console.error("Error handling task click:", error);
    }
  };

  return (
    <div
      className="flex flex-row items-center justify-between px-4 py-4 gap-4 w-full bg-no-repeat bg-center bg-cover sm:h-[100px]"
      style={{
        borderRadius: "10px",
        backgroundImage: "url('/img/rectangle.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Task Name */}
      <div
        className="flex-1 max-w-[50%] text-ellipsis overflow-hidden whitespace-nowrap"
        style={{
          color: "#A45737",
        }}
      >
        <h2 className="font-bold text-sm sm:text-base md:text-lg">
          {task.name}
        </h2>
      </div>

      {/* Task Points */}
      <div
        className="flex-1 text-center"
        style={{
          color: "#A45737",
        }}
      >
        <p className="font-bold text-xs sm:text-sm md:text-base">
          Points: {task.points}
        </p>
      </div>

      {/* Task Button */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={handleTaskClick}
          className={`flex justify-center items-center w-[80px] h-[40px] sm:w-[118px] sm:h-[48px] rounded-md bg-center bg-cover ${
            localCompleted ? "cursor-not-allowed opacity-90" : ""
          }`}
          style={{
            backgroundImage: localCompleted
              ? "url('/img/complete.png')"
              : "url('/img/start.png')",
          }}
          disabled={localCompleted}
        >
          <span className="sr-only">
            {localCompleted ? "Completed" : "Start Task"}
          </span>
        </button>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          Please connect your wallet to start the task.
        </div>
      )}

      {/* Task Completion Popup */}
      {showPopup && (
        <AllTasksCompletedPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
