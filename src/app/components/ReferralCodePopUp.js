import React from "react";

export default function ReferralCodePopup({
  referralCode,
  handleReferralInputChange,
  handleKeyDown,
  handleReferralNext,
  error,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Enter Referral Code</h2>
        <div className="flex justify-between mb-4">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`referral-input-${index}`}
              type="text"
              maxLength={1} // Restrict input to 1 character
              value={referralCode[index] || ""}
              onChange={(e) => handleReferralInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 border rounded-lg text-center text-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleReferralNext}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-indigo-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
