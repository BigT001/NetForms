import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./FormList";

function UserDashboard() {
  return (
    <div>
      <div className="p-5 md:p-10">
        <h2 className="font-bold text-2xl flex items-center justify-between mb-5">
         My Forms
          <CreateForm />
        </h2>
        <div>
           <FormList/>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
