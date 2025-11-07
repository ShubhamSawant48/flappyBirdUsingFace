import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Gamepad2 } from "lucide-react";

function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] flex items-center justify-between px-5 sm:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg shadow-black/20 z-50">
      <Link
        to="/"
        className="font-[font2] text-xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
      >
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          <span>Game Vault</span>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/")
              ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          <span>Home</span>
        </Link>
        <Link
          to="/games"
          className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/games")
              ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          <span>Games</span>
        </Link>
        <Link
          to="/play"
          className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
            isActive("/play")
              ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
              : "text-gray-300 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          <span>Play</span>
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub repository"
          title="GitHub"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
        >
          <Github size={18} strokeWidth={2} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
