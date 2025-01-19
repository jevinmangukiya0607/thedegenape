export const isTaskNameRelatedToThreadOrComment = (taskName) => {
  if (typeof taskName !== "string") return false;

  const keywords = ["thread", "comment"];
  return keywords.some((keyword) => taskName.toLowerCase().includes(keyword));
};

export const generateCustomPostUrl = (baseUrl, customMessage) => {
  const encodedMessage = encodeURIComponent(customMessage);
  return `${baseUrl}text=${encodedMessage}`;
};

export const generateCustomMessage = (referralCode) => {
  const domain = "degenapes";
  return `Swing into the alpha jungle 🐒🌴\n\nUse my code: ${referralCode}\n\n👉 ${domain}`;
};
