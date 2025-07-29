import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Type1Page from "./pages/Newbie/Type1Page";
import Type2Page from "./pages/Newbie/Type2Page";
import Type3Page from "./pages/Newbie/Type3Page";
import CalculatePage from "./pages/Newbie/CalculatePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/newbie" element={<Type1Page />} />
      <Route path="/intermediate" element={<Type2Page />} />
      <Route path="/expert" element={<Type3Page />} />
      <Route path="/newbie/calculate/:goal" element={<CalculatePage  />} />
    </Routes>
  );
};

export default AppRouter;
