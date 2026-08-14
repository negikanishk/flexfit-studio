import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc/Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlexFit Studio — Gym & Fitness Class Management",
  description: "Production-grade Next.js 15 App Router Gym Management Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
