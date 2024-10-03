"use client";

import React, { useState } from "react";
import SideNav from "./_components/SideNav";
import { SignedIn } from "@clerk/nextjs";

function DashboardLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="relative">
      <div className="flex">
        <SideNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />

        <div className="flex-1 md:ml-64">
          <SignedIn>{children}</SignedIn>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
