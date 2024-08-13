"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: "📝",
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Responses",
      icon: "💬",
      path: "/dashboard/responses",
    },
    {
      id: 3,
      name: "Analytics",
      icon: "📊",
      path: "/dashboard/analytics",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: "🚀",
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="">
      <div className="h-screen shadow-md border">
        <div className="p-5">
          {menuList.map((menu, index) => (
            <h2
              key={menu.id}
              className="flex text-gray-700 items-center gap-2 p-2 
              font-semibold rounded-lg hover:bg-primary 
              hover:text-white cursor-pointer "
            >
              <span className="">{menu.icon}</span>
              {menu.name}
            </h2>
          ))}
        </div>
        <div className="fixed bottom-30 mt-40 p-6 w-64">
          <Button className="w-full">+ Create Form</Button>

          <div className="pt-5">
            <Progress value={60} />
            <h2 className="text-gray-600 text-sm mt-2">
              <strong>3 </strong> out of <strong>5</strong> files created
            </h2>
            <p className="text-sm mt-5 text-gray-500">
              Upgrade for your plan for unlimted Ai form build
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
