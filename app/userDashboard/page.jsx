import { Button } from "@/components/ui/button";
import React from "react";
import CreateForm from "./_components/CreateForm";
import { UserButton } from "@clerk/nextjs";

function UserDashboard() {
  return (
    <div>
      <div className="">
        <h2 className="font-bold text-2xl flex items-center justify-between">
          Dashboard
          <CreateForm />
        </h2>
      </div>
    </div>
  );
}

export default UserDashboard;
