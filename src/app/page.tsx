"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import Sidebar from "@/components/Sidebar";
import LinkCard, { LinkData } from "@/components/LinkCard";
import LinkModal from "@/components/LinkModal";
import { 
  Loader2, 
  Search, 
  Plus, 
  Filter,
  Inbox,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { links, loading: linksLoading, deleteLink } = useLinks(user?.uid, activeTab);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => {
          setEditingLink(null);
          setIsModalOpen(true);
        }} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search links, tags, or URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors hidden md:block">
              <Filter size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => {
                  setEditingLink(null);
                  setIsModalOpen(true);
                }}
                className="bg-[#37352F] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#37352F]/90 transition-all shadow-md shadow-black/5 md:hidden"
              >
                <Plus size={18} />
                Add
              </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-[#37352F] capitalize mb-1">
                  {activeTab} Links
                </h2>
                <p className="text-gray-400 text-sm">
                  {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} saved in this category
                </p>
              </div>
              
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl hidden sm:flex">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                    viewMode === "grid" ? "bg-white shadow-sm text-[#37352F]" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                    viewMode === "list" ? "bg-white shadow-sm text-[#37352F]" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  List
                </button>
              </div>
            </header>

            {linksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[240px] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : filteredLinks.length > 0 ? (
              <motion.div 
                layout
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LinkCard 
                        link={link} 
                        onDelete={deleteLink} 
                        onEdit={(link) => {
                          setEditingLink(link);
                          setIsModalOpen(true);
                        }}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  {searchQuery ? <Search size={48} className="text-gray-200" /> : <Inbox size={48} className="text-gray-200" />}
                </div>
                <h3 className="text-xl font-bold text-[#37352F] mb-2">
                  {searchQuery ? "No matches found" : "No links yet"}
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto mb-8">
                  {searchQuery 
                    ? `We couldn't find any links matching "${searchQuery}". Try a different term.`
                    : `Your ${activeTab} collection is empty. Start by adding your first important link!`}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => {
                      setEditingLink(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-[#37352F] hover:border-gray-200 transition-all shadow-sm"
                  >
                    <Plus size={18} />
                    Add Link
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <LinkModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }} 
        initialData={editingLink}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EDEDEB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D3D3D1;
        }
      `}</style>
    </div>
  );
}
