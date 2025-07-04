import React from "react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-2">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-xl">NomadRem</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block">Welcome, User!</span>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">U</div>
      </div>
    </header>
  );
}; 