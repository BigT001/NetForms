"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateForm from "./CreateForm";
// import Responses from "@_components/Responses";

function SideNav({ isOpen, setIsOpen }) {
  const menuList = [
    { id: 1, name: "My Forms", icon: "📝", path: "/userDashboard" },
    { id: 2, name: "Responses", icon: "💬", path: "/userDashboard/responses" },
    { id: 3, name: "Analytics", icon: "📊", path: "/dashboard/analytics" },
    { id: 4, name: "Upgrade", icon: "🚀", path: "/dashboard/upgrade" },
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
      className={`fixed left-0 z-[1000] w-64 bg-white/75 backdrop-blur-lg shadow-md border-r transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 top-14 h-[calc(100vh-3.5rem)]`}
    >
      <div className="h-full flex flex-col">
        <nav className="flex-grow overflow-y-auto">
          <ul className="p-4 space-y-2">
            {menuList.map((menu, index) => (
              <li key={menu.id}>
                {index === 0 && (
                  <div className="flex items-center justify-between mb-2 lg:hidden">
                    <button
                      onClick={() => handleNavigation(menu.path)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        path === menu.path
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:scale-105"
                      }`}
                    >
                      <span className="text-xl">{menu.icon}</span>
                      <span className="font-medium">{menu.name}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                )}
                {(index !== 0 || !isOpen) && (
                  <button
                    onClick={() => handleNavigation(menu.path)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      path === menu.path
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:scale-105"
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
        <div className="w-full mb-4 text-center">
          <CreateForm setIsOpen={setIsOpen} />
         
        </div>

          <div className="mb-2">
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
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
