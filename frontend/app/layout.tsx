import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/animations.css";

export const metadata: Metadata = {
  title: "KrishiMitra AI | Precision Crop Advisory & Post-Harvest Loss Planner",
  description: "AI-powered precision crop advisory system, disease detection, and post-harvest loss reduction planner for smallholder farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}