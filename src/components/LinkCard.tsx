"use client";

import React from "react";
import { ExternalLink, Copy, Trash2, Instagram, Github, Link as LinkIcon, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LinkData {
  id: string;
  userId: string;
  url: string;
  title: string;
  type: "general" | "instagram" | "github";
  tags: string[];
  imageUrl?: string;
  createdAt: any;
}

interface LinkCardProps {
  link: LinkData;
  onDelete: (id: string) => void;
  onEdit: (link: LinkData) => void;
  viewMode?: "grid" | "list";
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onEdit, viewMode = "grid" }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.url);
  };

  const getIcon = () => {
    switch (link.type) {
      case "instagram":
        return <Instagram size={16} className="text-[#E1306C]" />;
      case "github":
        return <Github size={16} className="text-[#24292e]" />;
      default:
        return <LinkIcon size={16} className="text-blue-500" />;
    }
  };

  const getBadgeColor = () => {
    switch (link.type) {
      case "instagram":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "github":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  return (
    <div className={cn(
      "group bg-white border border-[#EDEDEB] rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 relative flex",
      viewMode === "grid" ? "flex-col h-full" : "flex-row items-center p-4 gap-6"
    )}>
      {link.imageUrl && (
        <div className={cn(
          "relative overflow-hidden border-[#EDEDEB]",
          viewMode === "grid" ? "h-40 w-full border-b" : "h-24 w-40 rounded-lg border flex-shrink-0"
        )}>
          <img 
            src={link.imageUrl} 
            alt={link.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className={cn(
        "flex-1 flex flex-col",
        viewMode === "grid" ? "p-5" : "p-0"
      )}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-2 rounded-lg border", getBadgeColor())}>
              {getIcon()}
            </div>
            {viewMode === "list" && (
               <div className="space-y-1">
                <h3 className="font-bold text-[#37352F] leading-tight line-clamp-1">
                  {link.title || "Untitled Link"}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span className="truncate max-w-[150px]">{new URL(link.url).hostname}</span>
                  <span>•</span>
                  <span>{link.type.charAt(0).toUpperCase() + link.type.slice(1)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(link)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              title="Edit Link"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              title="Copy URL"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Link"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-[#37352F] leading-tight line-clamp-2 min-h-[3rem]">
              {link.title || "Untitled Link"}
            </h3>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="truncate max-w-[180px]">{new URL(link.url).hostname}</span>
              <span>•</span>
              <span>{link.type.charAt(0).toUpperCase() + link.type.slice(1)}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {link.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {link.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#37352F] text-xs font-medium rounded-lg border border-gray-100 transition-colors ml-4"
            >
              Open
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {viewMode === "grid" && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full py-2 bg-gray-50 hover:bg-gray-100 text-[#37352F] text-sm font-medium rounded-lg border border-gray-100 transition-colors"
          >
            Open Link
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
