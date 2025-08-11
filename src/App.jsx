import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRouter from "./AppRouter";
import LanguageGate from "./components/LanguageGate";
import i18n from "./i18n";

const LS_KEY = "moneyfi_lang";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [lang, setLang] = useState("");

  // 1) Boot: read localStorage and optional ?langGate=1
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("langGate") === "1") {
      localStorage.removeItem(LS_KEY);
    }
    const saved = localStorage.getItem(LS_KEY) || "";
    setLang(saved);
    setBooted(true);
  }, []);

  // 2) Keep <html lang> + i18n in sync whenever lang changes
  useEffect(() => {
    if (!lang) return;
    document.documentElement.setAttribute("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const handleChoose = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LS_KEY, lng);
    document.documentElement.setAttribute("lang", lng);
    setLang(lng);
  };

  // Don’t render until we know if a language is saved
  if (!booted) return null;

  // No language chosen yet → show gate and block app
  if (!lang) {
    return (
      <>
        <ToastContainer />
        <LanguageGate onChoose={handleChoose} />
      </>
    );
  }

  // Language is chosen → render the app
  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRouter />
    </BrowserRouter>
  );
}
