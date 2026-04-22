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
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-[#F7F7F5] border-r border-[#EDEDEB] p-4 text-[#37352F]">
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

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#EDEDEB] px-6 py-3 flex items-center justify-between z-50">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === item.id ? "text-[#37352F]" : "text-[#37352F]/40"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onAddClick}
          className="bg-[#37352F] text-white p-3 rounded-full shadow-lg transform -translate-y-6"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={logout}
          className="flex flex-col items-center gap-1 text-[#37352F]/40"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Exit</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
