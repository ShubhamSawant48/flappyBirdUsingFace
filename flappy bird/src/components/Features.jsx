import React from "react";
import { Smile, Zap, ShieldCheck, Trophy, Sparkles, Cpu } from "lucide-react";

function Features() {
  const features = [
    {
      icon: Smile,
      title: "Face-Control Magic",
      desc: "Smile to fly – seamless real-time control powered by vision AI.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Optimized rendering and model inference for low-latency gameplay.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: ShieldCheck,
      title: "Private by Design",
      desc: "Runs locally in your browser – your camera feed stays on device.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Trophy,
      title: "Global Leaderboards",
      desc: "Compete with friends and climb the ranks with every flight.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Cpu,
      title: "Cutting-edge Models",
      desc: "Powered by modern ML models for robust and accurate detection.",
      color: "from-sky-500 to-indigo-500",
    },
    {
      icon: Sparkles,
      title: "Polished UX",
      desc: "Fluid animations, subtle shadows, and a cohesive dark theme.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-900/0 via-gray-900/40 to-gray-900/0">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Features
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Built for performance, privacy, and pure fun – explore what makes
            this unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-gray-700/40 bg-gray-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-br ${f.color} shadow-lg shadow-black/20 mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
