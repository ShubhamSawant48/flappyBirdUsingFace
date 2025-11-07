import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Gamepad2, Smile, Zap, Trophy, Sparkles } from "lucide-react";
import Footer from "../Footer";

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const games = [
    {
      id: 1,
      title: "Flappy Face",
      description:
        "Control the bird with your smile! Use face detection to navigate through pipes.",
      category: "Face Control",
      icon: Smile,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      link: "/play",
      features: ["Smile Detection", "Real-time Control", "Leaderboard"],
    },
    {
      id: 2,
      title: "Gesture Master",
      description:
        "Coming soon! Control games with hand gestures and body movements.",
      category: "Gesture Control",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      link: "#",
      features: ["Hand Tracking", "Motion Control", "Multiplayer"],
      comingSoon: true,
    },
    {
      id: 3,
      title: "Voice Commander",
      description:
        "Coming soon! Play games using voice commands and speech recognition.",
      category: "Voice Control",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      link: "#",
      features: ["Voice Commands", "Speech Recognition", "Accessibility"],
      comingSoon: true,
    },
    {
      id: 4,
      title: "Eye Tracker",
      description:
        "Coming soon! Control games with your eye movements and gaze tracking.",
      category: "Eye Control",
      icon: Gamepad2,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      link: "#",
      features: ["Eye Tracking", "Gaze Control", "Precision"],
      comingSoon: true,
    },
  ];

  const categories = [
    "All",
    "Face Control",
    "Gesture Control",
    "Voice Control",
    "Eye Control",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Game Vault
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Discover innovative games powered by cutting-edge technology. From
            face detection to gesture recognition, experience gaming like never
            before.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredGames.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.id}
                  className={`group relative overflow-hidden rounded-2xl border ${
                    game.borderColor
                  } ${
                    game.bgColor
                  } p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    game.comingSoon ? "opacity-75" : ""
                  }`}
                >
                  {game.comingSoon && (
                    <div className="absolute top-4 right-4 bg-gray-800/90 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-400/30">
                      Coming Soon
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`p-4 rounded-xl bg-linear-to-br ${game.color} shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {game.title}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700">
                        {game.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {game.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-lg border border-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {game.comingSoon ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-800/50 text-gray-500 rounded-xl font-semibold cursor-not-allowed border border-gray-700"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <Link
                      to={game.link}
                      className={`block w-full py-3 bg-linear-to-r ${game.color} text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300`}
                    >
                      Play Now
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">
              No games found matching your search.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-blue-400 mb-2">
              {games.filter((g) => !g.comingSoon).length}+
            </div>
            <div className="text-gray-400">Available Games</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-purple-400 mb-2">4</div>
            <div className="text-gray-400">Game Categories</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-pink-400 mb-2">∞</div>
            <div className="text-gray-400">Fun Guaranteed</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Games;
