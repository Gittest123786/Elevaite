
import React from "react";
import "./globals.css";

export const metadata = {
  title: "elevAIte | Global Talent Intelligence",
  description: "AI-powered career engine for global talent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased font-['Plus_Jakarta_Sans'] selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
