"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="border-b sticky z-[100] h-14 inset-x-0 top-0 w-full border-gray-200 bg-white/75 backdrop-blur-lg translation-all">
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-5">
        <Link href="/" className="z-40 font-bold">
          <span className="bg-blue-900 text-white">Net</span>
          <span className="font-bold text-red-800">Forms</span>
        </Link>

        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <Link href={"/userDashboard"}>
              <Button variant="outline">Dashboard</Button>
            </Link>

            <UserButton asChild />
          </div>
        ) : (
          <SignInButton>
            <Button>Get Started</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default Header;
