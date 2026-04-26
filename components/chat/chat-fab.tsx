import React from "react";
import { Sparkles } from "lucide-react";

interface ChatFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatFAB({ onClick, isOpen }: ChatFABProps) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Ambient glow */}
        <span className="absolute inset-0 rounded-full bg-blue-500 opacity-25 blur-lg scale-125 animate-pulse pointer-events-none" />

        <button
          onClick={onClick}
          aria-label="Open AI Assistant"
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl hover:shadow-blue-500/40 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          {/* Sparkle badge */}
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-md border border-blue-100">
            <Sparkles className="h-3 w-3 text-blue-600" />
          </span>

          {/* Bot icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        </button>

        {/* Tooltip on hover */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 text-[11px] font-semibold bg-neutral-900 text-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
          AI Assistant
        </span>
      </div>
    </div>
  );
}
