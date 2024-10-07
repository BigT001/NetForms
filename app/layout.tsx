import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ControlVisibilityProvider } from "@/contexts/ControlVisibilityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NetForms",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ControlVisibilityProvider>
        <html lang="en" data-theme="light">
          <body className={inter.className}>
            <Header />
            <Toaster />
            {children}
          </body>
        </html>
      </ControlVisibilityProvider>
    </ClerkProvider>
  );
}
