import React from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

const Type1Page = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen w-full bg-white overflow-hidden flex items-center justify-center">
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 left-80 w-40 h-40 bg-blue-400 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-30 right-20 w-56 h-56 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-2xl"></div>

      <div className="w-2/3 z-10 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white/30">
        <h1 className="text-5xl font-bold text-blue-800 items-center justify-center">
          As you are new to Investing,
        </h1>
        <h2 className="text-3xl font-semibold text-blue-800 items-center justify-center">
          It's important to start with a goal in mind
        </h2>
        <p className="text-lg text-gray-700">
          Choose your investment goal to get started
        </p>
        <Button
          variant="ghost"
          color="primary"
          className="w-80 h-12 text-base font-semibold"
          onPress={() => navigate("/newbie/calculate/retirement")}
        >
          Retirement 👴🏻
        </Button>
        <Button
          variant="ghost"
          color="primary"
          className="w-80 h-12 text-base font-semibold"
          onPress={() => navigate("/newbie/calculate/marriage")}
        >
          Marriage 💍
        </Button>
        <Button
          variant="ghost"
          color="primary"
          className="w-80 h-12 text-base font-semibold"
          onPress={() => navigate("/newbie/calculate/education")}
        >
          Education 🎓
        </Button>
        <Button
          variant="ghost"
          color="primary"
          className="w-80 h-12 text-base font-semibold"
          onPress={() => navigate("/newbie/calculate/house")}
        >
          House 🏠
        </Button>
      </div>
    </div>
  );
};

export default Type1Page;
