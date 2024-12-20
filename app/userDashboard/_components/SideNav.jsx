"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateForm from "./CreateForm";
import Link from "next/link";
// import Responses from "@_components/Responses";

function SideNav({ isOpen, setIsOpen }) {
  const menuList = [
    { id: 1, name: "My Forms", icon: "", path: "/userDashboard" },
    { id: 2, name: "Responses", icon: "", path: "/userDashboard/responses" },
    { id: 3, name: "Analytics", icon: "", path: "/userDashboard/analytics" },
    // { id: 4, name: "Upgrade", icon: "🚀", path: "/dashboard/upgrade" },
    // { id: 5, name: "Admin", icon: "👑", path: "/admin/adminDashboard" },
  ];

  const path = usePathname();
  const router = useRouter();

  const handleNavigation = (menuPath) => {
    router.push(menuPath);
    setIsOpen(false);
  };

  const handleCreateForm = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed h-full left-0 z-[1000] w-52 md:w-64 bg-white backdrop-blur-lg shadow-md 
      border-r transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 top-14 h-[calc(100vh-3.5rem)]`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center mt-2 border-b-2 justify-between mb-2 lg:hidden">
          <h1 className="ml-5 font-semibold text-xl">Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul className="ml-2 space-y-2 md:mt-5">
            {menuList.map((menu, index) => (
              <li key={menu.id}>
                {index === 0 && (
                  <div className="flex items-center justify-between mb-2 lg:hidden">
                    <button
                      onClick={() => handleNavigation(menu.path)}
                      className={`flex items-center hover:text-secondary gap-3 
                      rounded-md transition-colors ${
                        path === menu.path
                          // ? " text-black"
                          // : "text-gray-700 hover:scale-105"
                      }`}
                    >
                      <span className="text-xl">{menu.icon}</span>
                      <span className="">{menu.name}</span>
                    </button>
                  </div>
                )}
                {(index !== 0 || !isOpen) && (
                  <button
                    onClick={() => handleNavigation(menu.path)}
                    className={`w-full flex items-center gap-3 hover:text-secondary rounded-md transition-colors ${
                      path === menu.path
                        // ? "bg-primary text-white"
                        // : "text-gray-700 hover:scale-105"
                    }`}
                  >
                    <span className="text-xl">{menu.icon}</span>
                    <span className="font-medium">{menu.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="w-full mb-24 text-center">
            <CreateForm setIsOpen={setIsOpen} />
          </div>

          {/* <div>
            <p className="text-gray-700 text-center">
              Developer: <br />
              <Link href="www.samuelstanley.com" target="_blank">
                <span className="text-gray-600">Samuel Stanley</span>
              </Link>
            </p>
          </div> */}

          {/* <div className="mb-2">
            <progress
              className="progress progress-primary w-full"
              value="60"
              max="100"
            ></progress>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>3</strong> out of <strong>5</strong> forms created
          </p>
          <p className="text-xs text-gray-500">
           
            Upgrade for unlimited AI form builds
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default SideNav;
