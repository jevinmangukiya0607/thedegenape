import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers"; // Import headers to access cookies
import ReduxProvider from "@/store/reduxProvider"; // Redux Provider component
import ContextProvider from "@/context"; // ContextProvider component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
};

export default async function RootLayout({ children }) {
  // Extract headers and cookies asynchronously
  const headersObj = await headers(); // Await the headers object
  const cookies = headersObj.get("cookie"); // Safely get cookies

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
