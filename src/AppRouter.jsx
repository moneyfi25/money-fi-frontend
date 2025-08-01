import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalculatePage from "./pages/CalculatePage";
import Recommendations from "./pages/Recommendations";
import InvestmentReportPage from "./pages/InvestmentReport";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calculate" element={<CalculatePage />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/investment-report" element={<InvestmentReportPage />} />
    </Routes>
  );
};

export default AppRouter;
