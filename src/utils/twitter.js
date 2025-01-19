// Utility to check if a task name matches specific keywords
export const isTaskNameRelatedToThreadOrComment = (taskName) => {
  if (typeof taskName !== "string") {
    console.error(
      "[isTaskNameRelatedToThreadOrComment] Invalid task name:",
      taskName
    );
    return false; // Return false for invalid task names
  }

  const keywords = ["thread", "comment"]; // Keywords to check
  console.log("[isTaskNameRelatedToThreadOrComment] Task name:", taskName);

  const isRelated = keywords.some((keyword) =>
    taskName.toLowerCase().includes(keyword)
  );

  console.log("[isTaskNameRelatedToThreadOrComment] Is related:", isRelated);
  return isRelated;
};

// Utility to encode the custom message into the URL
export const generateCustomPostUrl = (baseUrl, customMessage) => {
  console.log("[generateCustomPostUrl] Base URL:", baseUrl);
  console.log("[generateCustomPostUrl] Custom message:", customMessage);

  // Encode the custom message
  const encodedMessage = encodeURIComponent(customMessage);
  console.log("[generateCustomPostUrl] Encoded message:", encodedMessage);

  // Append the custom message to the URL
  const finalUrl = `${baseUrl}text=${encodedMessage}`;
  console.log("[generateCustomPostUrl] Final URL:", finalUrl);

  return finalUrl;
};

// Function to generate the custom message
export const generateCustomMessage = (referralCode) => {
  const domain = "degenapes"; // Constant domain
  console.log("[generateCustomMessage] Referral code:", referralCode);
  console.log("[generateCustomMessage] Domain:", domain);

  const customMessage = `Swing into the alpha jungle 🐒🌴\n\nuse my code: ${referralCode}\n\n👉 ${domain}`;
  console.log(
    "[generateCustomMessage] Generated custom message:",
    customMessage
  );

  return customMessage;
};
