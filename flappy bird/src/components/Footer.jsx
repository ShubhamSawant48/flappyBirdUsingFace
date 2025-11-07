import React from "react";
import { Github, Heart, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full mt-8 border-t border-gray-800 bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              <span className="font-[font2] text-lg font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Vault
              </span>
            </Link>
            <p className="text-gray-400 mt-3 max-w-sm">
              Innovative, accessible gaming powered by on-device intelligence
              and delightful design.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold mb-2">Explore</h4>
            <Link to="/" className="text-gray-400 hover:text-gray-200">
              Home
            </Link>
            <Link to="/games" className="text-gray-400 hover:text-gray-200">
              Games
            </Link>
            <Link to="/play" className="text-gray-400 hover:text-gray-200">
              Play
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold mb-2">Community</h4>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <span className="text-gray-500">More coming soon</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>
            © {new Date().getFullYear()} Game Vault. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-rose-400" /> for gamers
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
