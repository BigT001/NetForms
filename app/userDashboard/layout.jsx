"use client";

import React from "react";
import SideNav from "./_components/SideNav";
import { SignedIn } from "@clerk/nextjs";

function DashboardLayout({ children }) {
  return (
    <div>
      <div className="md:w-64 fixed">
        <SideNav />
      </div>

      <div className="md:ml-64">
        <SignedIn>{children}</SignedIn>
      </div>
    </div>
  )
}

export default DashboardLayout;
