// src/components/pages/Games.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, Hand } from 'lucide-react';

function Games() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-5xl font-black mb-12">Choose Your Game</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Flappy Face Card */}
        <Link to="/play" className="group flex flex-col items-center p-8 bg-gray-800 rounded-3xl border-2 border-transparent hover:border-purple-500 transition-all shadow-xl hover:-translate-y-2">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Smile size={40} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Flappy Face</h2>
          <p className="text-gray-400 text-center">Control the bird by smiling into your webcam!</p>
        </Link>

        {/* Gesture Dino Card */}
        <Link to="/play-dino" className="group flex flex-col items-center p-8 bg-gray-800 rounded-3xl border-2 border-transparent hover:border-emerald-500 transition-all shadow-xl hover:-translate-y-2">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Hand size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Gesture Dino</h2>
          <p className="text-gray-400 text-center">Make the Dino jump by quickly raising your hand!</p>
        </Link>
      </div>
    </div>
  );
}

export default Games;