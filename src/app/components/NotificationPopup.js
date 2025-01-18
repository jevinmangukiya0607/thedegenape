"use client";

import React, { useEffect } from "react";

export default function NotificationPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 10000); // Auto-close after 10 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <div className="fixed bottom-4  bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between space-x-4">
      <span className="text-sm font-medium">{message}</span>
      
    </div>
  );
}
