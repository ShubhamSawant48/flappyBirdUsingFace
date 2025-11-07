import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bird, Smile, Zap, Trophy } from "lucide-react";

function HomePage() {
  return (
    <main className="w-full min-h-[calc(100vh-60px)] flex flex-col items-stretch justify-start px-4 sm:px-8 lg:px-24 xl:px-32 pb-20 sm:pb-32 bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-6 items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 pl-0 lg:pl-2 text-center lg:text-left">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tight m-0">
            <span className="bg-linear-to-r from-orange-400  to-red-500 bg-clip-text text-transparent font-black">
              Smile
            </span>
            <span className="mx-3 font-black">&</span>
            <span className="bg-linear-to-r from-amber-500  to-red-500 bg-clip-text text-transparent font-black">
              Fly
            </span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto lg:mx-0">
            A revolutionary flappy bird game that responds to your smile! Use
            your camera to detect your smile and make the bird soar through the
            sky.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
            <Link
              to="/play"
              className="btn-hero btn-hero-primary inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white no-underline px-6 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Playing
              <ArrowRight size={18} />
            </Link>
            <a
              href="#learn"
              className="btn-hero btn-hero-secondary inline-flex items-center text-red-500 bg-transparent px-6 py-3 rounded-2xl border-2 border-red-200 font-bold text-base hover:border-orange-400 hover:text-pink-500 hover:bg-orange-50 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-2 max-w-2xl mx-auto lg:mx-0">
            <div className="flex flex-col gap-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-500">
                100%
              </div>
              <div className="text-slate-500 font-semibold text-sm sm:text-base">
                Fun Guaranteed
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-500">
                ∞
              </div>
              <div className="text-slate-500 font-semibold text-sm sm:text-base">
                Endless Levels
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-500">
                0ms
              </div>
              <div className="text-slate-500 font-semibold text-sm sm:text-base">
                Lag Free
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative min-h-80 sm:min-h-96 lg:min-h-[420px] flex items-center justify-center mt-4 lg:mt-0"
          aria-hidden
        >
          <div className="absolute w-96 sm:w-[500px] lg:w-[620px] h-96 sm:h-[500px] lg:h-[620px] rounded-full bg-gradient-radial from-red-300/35 via-orange-300/22 to-yellow-300/10 blur-sm" />
          <div className="absolute w-72 sm:w-80 lg:w-96 h-72 sm:h-80 lg:h-96 rounded-full bg-conic-gradient from-red-400/55 via-orange-300/35 to-red-400/55 blur-2xl opacity-90" />
          <div className="absolute w-80 sm:w-96 lg:w-[460px] h-80 sm:h-96 lg:h-[460px] rounded-full shadow-[0_0_140px_42px_rgba(244,63,94,0.28)]" />
          <Bird
            className="relative text-red-500 animate-float"
            size={180}
            strokeWidth={1.8}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto my-12 sm:my-16 lg:my-20 px-6 sm:px-8">
        <div className="text-center mb-6 sm:mb-8  animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black m-0 mb-2">
            Why You'll Love It
          </h2>
          <p className="text-slate-500 text-lg sm:text-xl">
            Experience gaming like never before with cutting-edge smile
            detection technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            className="animate-slide-up p-6 rounded-2xl bg-white border border-gray-200 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-orange-400 hover:shadow-xl"
            aria-label="Smile Detection"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Smile size={28} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-black m-0 mb-2">Smile Detection</h3>
            <p className="text-slate-600 m-0 text-sm sm:text-base">
              Advanced camera technology detects your smile in real-time and
              controls the bird's flight.
            </p>
          </div>

          <div
            className="animate-slide-up p-6 rounded-2xl bg-white border border-gray-200 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-orange-400 hover:shadow-xl"
            aria-label="Lightning Fast"
          >
            <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
              <Zap size={28} className="text-cyan-500" />
            </div>
            <h3 className="text-lg font-black m-0 mb-2">Lightning Fast</h3>
            <p className="text-slate-600 m-0 text-sm sm:text-base">
              Instant response time ensures your smile is captured and processed
              without any lag.
            </p>
          </div>

          <div
            className="animate-slide-up p-6 rounded-2xl bg-white border border-gray-200 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-orange-400 hover:shadow-xl md:col-span-2 lg:col-span-1"
            aria-label="Leaderboards"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
              <Trophy size={28} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-black m-0 mb-2">Leaderboards</h3>
            <p className="text-slate-600 m-0 text-sm sm:text-base">
              Compete with friends and climb the global leaderboards to prove
              your smile power!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 sm:px-8 py-12 sm:py-16">
        <div className="relative max-w-6xl mx-auto rounded-3xl p-8 sm:p-10 lg:p-12 bg-linear-to-r from-orange-400  to-red-500 overflow-hidden shadow-2xl">
          <div className="absolute w-96 h-96 bg-white opacity-12 rounded-full blur-3xl -top-32 -left-32" />
          <div className="absolute w-96 h-96 bg-white opacity-12 rounded-full blur-3xl -bottom-32 -right-32" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white m-0 mb-3">
              Ready to Smile Your Way to Victory?
            </h2>
            <p className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto mb-6">
              Join thousands of players who are already having fun with Flappy
              Face. Start your journey today!
            </p>
            <Link
              to="/play"
              className="inline-flex items-center gap-2 bg-white text-blue-600 no-underline px-6 py-4 rounded-full font-bold text-base shadow-2xl hover:shadow-3xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              Play Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black m-0 mb-2">
            Top Smilers
          </h2>
          <p className="text-slate-500 text-lg sm:text-xl">
            Check out the best smile-powered players on the leaderboard
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-orange-400  to-red-500 text-white p-4 sm:p-5 text-lg font-bold">
            <div className="grid grid-cols-3 gap-3">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-right">Score</div>
            </div>
          </div>
          <div>
            {[
              { rank: 1, name: "SmileMaster", score: 8750, medal: "🥇" },
              { rank: 2, name: "HappyFlyer", score: 7920, medal: "🥈" },
              { rank: 3, name: "JoyfulBird", score: 7450, medal: "🥉" },
              { rank: 4, name: "GrinGamer", score: 6890, medal: "4️⃣" },
              { rank: 5, name: "BeamBoss", score: 6320, medal: "5️⃣" },
            ].map((p, i) => (
              <div
                key={i}
                className="animate-slide-up p-4 border-t border-gray-200 transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div className="text-xl">{p.medal}</div>
                  <div className="font-semibold text-sm sm:text-base">
                    {p.name}
                  </div>
                  <div className="text-right text-blue-600 font-black text-sm sm:text-base">
                    {p.score.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 p-4">
            <Link
              to="/play"
              className="inline-flex items-center gap-2 text-blue-600 no-underline font-bold text-sm sm:text-base hover:text-blue-700 transition-colors duration-200"
            >
              View Full Leaderboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
