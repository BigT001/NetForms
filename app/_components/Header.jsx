"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SideNav from "../userDashboard/_components/SideNav";
import { Menu } from "lucide-react";

function Header() {
  const { user, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const path = usePathname();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    console.log(path);
  }, [path]);

  if (path.includes('netform')) {
    return null;
  }

  const handleSignOut = () => {
    signOut(() => {
      window.location.href = "/";
    });
  };

  const getEmailInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : '#';
  };

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const emailInitial = getEmailInitial(userEmail);

  const AvatarComponent = () => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      {user?.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <span className="text-sm font-bold">{emailInitial}</span>
      )}
    </div>
  );

  const handleManageAccount = () => {
    openUserProfile();
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const isUserDashboardPage = path === '/userDashboard';

  return (
    <>
      <div className="border-b sticky z-[100] h-14 inset-x-0 top-0 w-full border-gray-200 bg-white/75 backdrop-blur-lg translation-all">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-5">
          <Link href="/" className="z-40 font-bold">
            <span className="bg-blue-900 text-white">Net</span>
            <span className="font-bold text-red-800">Forms</span>
          </Link>

          {isSignedIn ? (
            <div className="flex items-center gap-5">
              {isUserDashboardPage ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSideNav}
                  className="lg:hidden"
                >
                  <Menu size={24} />
                </Button>
              ) : (
                <Link href="/userDashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              )}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <AvatarComponent />
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-white rounded-lg w-64 border border-gray-200">
                  <li className="text-sm text-gray-600 border-b border-gray-200">
                    <div className="flex items-center gap-2 p-2">
                      <AvatarComponent />
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    </div>
                  </li>
                  <li>
                    <a onClick={handleManageAccount} className="p-3 hover:bg-gray-100 transition-colors mt-4 text-md">
                      Manage account
                    </a>
                  </li>
                  <li><a onClick={handleSignOut} className="p-3 hover:bg-gray-100 transition-colors text-red-600">Sign out</a></li>
                </ul>
              </div>
            </div>
           ) : (
            <SignInButton>
              <Button>Get Started</Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Side Navigation */}
      {isUserDashboardPage && (
        <SideNav isOpen={isSideNavOpen} setIsOpen={setIsSideNavOpen} />
      )}

      {/* Overlay */}
      {isSideNavOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSideNav}
        ></div>
      )}
    </>
  );
}

export default Header;