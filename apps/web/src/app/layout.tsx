import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { SyncProvider } from "@/components/SyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindLab Play",
  description: "Train your brain with fun challenges",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1f2937",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SyncProvider />
        {children}
      </body>
    </html>
  );
}
