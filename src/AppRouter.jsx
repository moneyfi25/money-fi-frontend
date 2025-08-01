import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalculatePage from "./pages/CalculatePage";
import Recommendations from "./pages/Recommendations";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/input" element={<CalculatePage />} />
      <Route path="/recommendations" element={<Recommendations />} />
    </Routes>
  );
};

export default AppRouter;
