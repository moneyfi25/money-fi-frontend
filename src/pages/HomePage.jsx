import React, { useState } from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Sun, Moon, TrendingUp, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import LottieInvestment from "../components/LottieInvestment";

function TopBar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 absolute top-0 left-0 z-20 bg-transparent">
      <div className="flex items-center gap-2">
      <button
        onClick={() => window.location.href = "/"}
        className="text-2xl font-bold text-primary dark:text-white tracking-tight"
      > Money-Fi
      </button>
        <TrendingUp className="text-primary dark:text-primary-light" size={26} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={`
          w-12 h-12 md:w-14 md:h-14
          rounded-full
          flex items-center justify-center
          bg-white/60 dark:bg-primary-dark/50
          border border-transparent
          shadow-sm
          hover:scale-105 hover:bg-primary/10 dark:hover:bg-primary-dark/80
          hover:shadow-[0_0_10px_2px_rgba(124,58,237,0.08)]
          backdrop-blur
          transition-all duration-200
        `}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span className="relative flex items-center justify-center transition-all duration-200">
          {theme === "dark" ? (
            <Sun
              size={28}
              className="text-yellow-300 transition-all duration-200"
            />
          ) : (
            <Moon
              size={28}
              className="text-primary transition-all duration-200"
            />
          )}
        </span>
      </Button>
    </header>
  );
}




const WaveDivider = () => (
  <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full h-24 z-10 opacity-70">
    <path
      fill="#7c3aed"
      fillOpacity="0.12"
      d="M0,224L80,224C160,224,320,224,480,202.7C640,181,800,139,960,138.7C1120,139,1280,181,1360,202.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
    ></path>
  </svg>
);

const WORDS = ["Welcome to Money-fi", "Smart Investing Starts Here!"];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-light via-white to-primary/10 dark:from-primary-dark dark:via-primary/40 dark:to-primary-dark transition-colors duration-500 overflow-x-hidden flex flex-col items-center">
      <TopBar />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-2 w-96 h-96 rounded-full bg-gradient-to-br from-primary/50 to-primary-dark/30 blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-bl from-primary-light/80 to-primary/30 blur-2xl opacity-40 animate-pulse delay-300"></div>
        <div className="absolute top-40 right-2 w-40 h-40 rounded-full bg-gradient-to-tr from-primary-dark/60 to-primary/20 blur-2xl opacity-30 animate-pulse delay-700"></div>
      </div>

      {/* Main content card */}
      <main className="flex-1 flex flex-col justify-center items-center w-full pt-36 pb-20 relative z-10">
        <div className="group relative w-full max-w-2xl bg-white/90 dark:bg-primary-dark/80 border border-primary/20 dark:border-primary/40 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col items-center gap-8 overflow-hidden">
          {/* Animated shimmer highlight */}
          <span className="pointer-events-none absolute -top-8 left-1/3 w-2/3 h-20 bg-gradient-to-r from-primary/30 via-white/50 to-primary-light/0 blur-2xl opacity-60 animate-pulse group-hover:scale-110 transition-transform"></span>

          {/* Headline with dynamic font size */}
          <div className="relative w-full">
            <h1
              className={`font-black text-center text-primary dark:text-white leading-tight tracking-tight drop-shadow-sm transition-all duration-300
                ${currentIndex === 1 ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}`}
              style={{ minHeight: "2.5em" }} // Reserve space for both lines
            >
              <Typewriter
                words={WORDS}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1600}
                onLoopDone={() => setCurrentIndex(0)}
                onType={(char, { type, cursor, wordIndex }) => setCurrentIndex(wordIndex)}
              />
            </h1>
          </div>

          {/* Lottie animation */}
          <div className="w-36 md:w-44 mx-auto mb-2">
            <LottieInvestment height={200} width={200} />
          </div>

          {/* Tagline with icon */}
          <div className="flex flex-row items-center justify-center gap-3">
            <ShieldCheck className="text-primary dark:text-white" size={28} />
            <span className="text-lg md:text-2xl font-semibold text-primary dark:text-white">
              Safe. Simple. For You.
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-zinc-700 dark:text-primary-light/90 text-center font-medium">
            Trusted by many users to achieve their <span className="font-semibold text-primary dark:text-primary-light">goals</span>.
            Get personalized mutual fund advice and more.
          </p>

          {/* Main CTA */}
          <Button
            color="primary"
            className="mt-2 w-full md:w-2/3 h-14 text-lg font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:bg-primary/90 focus:ring-2 focus:ring-primary/60"
            onPress={() => navigate("/input")}
          >
            <span className="flex items-center gap-2">
              Start Investing
              <TrendingUp size={22} />
            </span>
          </Button>
        </div>
      </main>

      {/* Wave divider at the bottom */}
      <WaveDivider />

      {/* Trusted section */}
      <section className="z-20 mb-10 text-center w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 mx-auto">
            <ShieldCheck size={20} className="text-green-500" />
            <span className="font-medium text-zinc-600 dark:text-primary-light">Personalized Advice, Backed by Regulations</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-primary/10"></div>
          <div className="flex items-center gap-2 mx-auto">
            <TrendingUp size={20} className="text-violet-600" />
            <span className="font-medium text-zinc-600 dark:text-primary-light">Tons of Advised Investments</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
