import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, isConnected }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[90%] sm:max-w-2xl mx-auto">
      {tasks.map((task) => (
        <TaskItem key={task.taskId} task={task} isConnected={isConnected} />
      ))}
    </div>
  );
}
