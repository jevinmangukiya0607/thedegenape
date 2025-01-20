import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, isConnected }) {
  return (
    <div
      className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full max-w-[100%] sm:max-w-3xl mx-auto md:scale-110 overflow-y-auto"
      style={{
        transition: "transform 0.3s ease", // Smooth transition
        maxHeight: "calc(100vh - 300px)", // Prevent overflow
      }}
    >
      {tasks.map((task) => (
        <TaskItem key={task.taskId} task={task} isConnected={isConnected} />
      ))}
    </div>
  );
}
