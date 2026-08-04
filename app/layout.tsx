import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"
import AutoLogout from "../components/AutoLogout"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Attendance System",
    // template: "%s | Inspection System",
  },
  description: "Weekly Safety Inspection System",
  icons: {
    icon: "/mipl_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AutoLogout timeout={10 * 60 * 1000} /> {/* ✅ Auto logout after 10 min */}
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
