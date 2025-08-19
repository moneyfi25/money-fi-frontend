import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalculatePage from "./pages/CalculatePage";
import InvestmentReportPage from "./pages/InvestmentReport";
import StratergyPage from "./pages/StratergyPage";
import FundDetailsPage from "./pages/FundDetails";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calculate" element={<CalculatePage />} />
      <Route path="/investment-report" element={<InvestmentReportPage />} />
      <Route path="/stratergy" element={<StratergyPage />} />
      <Route path="/fund-details/:fundName" element={<FundDetailsPage />} />
    </Routes>
  );
};

export default AppRouter;
