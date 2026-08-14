import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/animations.css";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "FasalDrishti AI | Precision Crop Advisory & Post-Harvest Loss Planner",
  description: "AI-powered precision crop advisory system, disease detection, and post-harvest loss reduction planner for smallholder farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-white antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}