"use client";

import React from "react";

export default function NotificationPopup({ message, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between space-x-4">
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-white text-green-500 rounded-full px-3 py-1 text-xs font-bold hover:bg-gray-200 focus:outline-none focus:ring focus:ring-green-400"
        >
          Close
        </button>
      )}
    </div>
  );
}
