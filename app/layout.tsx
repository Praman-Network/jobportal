import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Praman Jobs — Internship & Job Board",
  description: "Find internships and jobs from real companies and recruiters, all in one place.",
  icons: {
    icon: "/praman-logo.png",
    apple: "/praman-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
