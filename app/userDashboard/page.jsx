import { Button } from "@/components/ui/button";
import React from "react";
import CreateForm from "./_components/CreateForm";
import { UserButton } from "@clerk/nextjs";
import FormList from "./FormList";

function UserDashboard() {
  return (
    <div>
      <div className="p-10">
        <h2 className="font-bold text-2xl flex items-center justify-between mb-5">
         My Forms
          <CreateForm />
        </h2>
        <div>
           {/* list of forms */}
           <FormList/>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
