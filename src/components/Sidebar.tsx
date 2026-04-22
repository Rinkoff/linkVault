"use client";


import React from "react";
import { 
  LayoutGrid, 
  Instagram, 
  Github, 
  Plus, 
  LogOut,
  Settings,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onAddClick }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: "general", label: "General", icon: LayoutGrid },
    { id: "instagram", label: "Instagram", icon: Instagram },
    { id: "github", label: "GitHub", icon: Github },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-[#F7F7F5] border-r border-[#EDEDEB] p-4 text-[#37352F]">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <div className="bg-[#37352F] text-white p-1.5 rounded-lg">
          <Bookmark size={20} />
        </div>
        <h1 className="font-bold text-lg tracking-tight">LinkVault</h1>
      </div>

      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium",
              activeTab === item.id
                ? "bg-[#EBEBE9] text-[#37352F]"
                : "hover:bg-[#EBEBE9] text-[#37352F]/70"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-4 pt-4 border-t border-[#EDEDEB]">
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 w-full bg-[#37352F] text-white px-3 py-2 rounded-md hover:bg-[#37352F]/90 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Link</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-8 h-8 rounded-full border border-[#EDEDEB]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#37352F]/10 flex items-center justify-center text-xs font-bold">
              {user?.displayName?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">
              {user?.displayName || "Guest User"}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 hover:bg-[#EBEBE9] rounded-md text-[#37352F]/60 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
