import React from "react";
import RotatingText from "../RotatingText";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import SplineScene from "../SplineScene";
import Features from "../Features";
import Footer from "../Footer";

const Home = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Spline */}
      <div className="absolute spline-bg h-full opacity-80">
        <SplineScene />
      </div>
      <div className="phone-bg absolute opacity-20 h-screen w-screen -z-1">
        <img className="h-full w-full" src="/phone-bg.png" alt="" />
      </div>

      <div>
        {/* Hero content on top */}
        <div className="-mt-20 sm:mt-0 hero font-[font1] pointer-events-none relative text-gray-300 flex flex-col w-screen h-screen justify-center items-center px-4">
          {/* Static word + Rotating badge */}
          <div className="flex items-center gap-1  text-center">
            <span className="text-gray-300 text-[4vw] sm:text-[3vh]">
              Next-Gen
            </span>
            <RotatingText
              texts={[
                "Gaming",
                "Experience",
                "Innovation",
                "Entertainment",
                "Adventure",
                "Excellence",
              ]}
              mainClassName="px-2 cursor-target sm:px-3 bg-linear-to-r from-blue-500 to-purple-500 text-white text-[4vw] sm:text-[3vh] overflow-hidden py-1 rounded-lg shadow-lg shadow-blue-500/50"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>

          {/* Subheading */}
          <h2 className="text-[3vw] md:text-[2vw] lg:text-[2vw] pt-6 text-center text-gray-400">
            🎮 Welcome to the future of interactive gaming
          </h2>

          {/* Main Heading */}
          <h1 className="text-[10vw] sm:text-[8vw] md:text-[8vw] lg:text-[9vw] bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-[font1] tracking-wider mt-1 mb-5 uppercase font-bold text-center leading-tight">
            Game Vault
          </h1>

          {/* Description */}
          <h3 className="text-[12px] sm:text-base md:text-2xl text-center -mt-5 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] text-gray-400">
            Immerse yourself in a revolutionary collection of games powered by
            cutting-edge AI and computer vision technology.
            <br className="hidden sm:block" />
            Control games with your face, gestures, and voice - experience
            gaming reimagined.
          </h3>

          {/* Icon */}
          <img
            className="h-6 sm:h-8 md:h-10 text-white mt-6 opacity-60"
            src="https://cdn-icons-png.flaticon.com/512/8213/8213476.png"
            alt="arrow-down"
          />

          {/* Button */}
          <div className="w-full pointer-events-auto p-4 flex justify-center">
            <Link
              to="/games"
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white  rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300 "
            >
              Explore Games
            </Link>
          </div>

          {/* Scroll down hint */}
          <div className="-mt-24 sm:mt-0 absolute bottom-5 right-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-300 py-2 px-5 rounded-lg shadow-lg">
            <h3 className="flex gap-2 items-center">
              <ArrowDown className="w-4 h-4" /> Scroll Down
            </h3>
          </div>
        </div>

        {/* Content sections */}
        <div className="pointer-events-auto">
          <Features />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
