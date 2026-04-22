"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Link as LinkIcon, Tag, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { LinkData } from "./LinkCard";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LinkData | null;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, initialData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"general" | "instagram" | "github">("general");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url);
      setTitle(initialData.title);
      setType(initialData.type);
      setTags(initialData.tags.join(", "));
      setImageUrl(initialData.imageUrl || "");
    } else {
      setUrl("");
      setTitle("");
      setType("general");
      setTags("");
      setImageUrl("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith("http")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const linkData = {
        userId: user.uid,
        url: formattedUrl,
        title: title.trim() || formattedUrl,
        type,
        tags: tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
        imageUrl: imageUrl.trim(),
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        await updateDoc(doc(db, "links", initialData.id), linkData);
      } else {
        await addDoc(collection(db, "links"), {
          ...linkData,
          createdAt: serverTimestamp(),
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving link:", error);
      alert("Failed to save link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-[#37352F]">
                {initialData ? "Edit Link" : "Save New Link"}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  URL
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My favorite link"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="general">General</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tags
                  </label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="dev, cool"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#37352F] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#37352F]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  initialData ? "Update Link" : "Save Link"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LinkModal;
