import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { headers } from "next/headers"; // added
import ContextProvider from "@/context";

export const metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
};

export default async function RootLayout({ children }) {
  const headersObj = headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
