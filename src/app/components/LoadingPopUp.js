import React from "react";

export default function LoadingPopup({ isProcessing }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 text-center">
        {isProcessing ? (
          <div className="loader mb-4 animate-spin border-t-4 border-indigo-600 border-solid rounded-full w-12 h-12"></div>
        ) : (
          <h2 className="text-xl font-semibold mb-4">Processing...</h2>
        )}
      </div>
    </div>
  );
}
