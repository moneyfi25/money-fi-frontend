// LanguageGate.jsx
import React from "react";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const LS_KEY = "moneyfi_lang";

export default function LanguageGate({ onChoose }) {
  const { t } = useTranslation();

  const choose = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LS_KEY, lng);
    document.documentElement.setAttribute("lang", lng);
    onChoose?.(lng);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[92%] max-w-md rounded-2xl p-6 bg-white dark:bg-[#241e39] border border-primary/20 dark:border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
          {t("brand") || "Money-Fi"}
        </h2>

        {/* English line */}
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          {t("lang_choose_title") || "Choose your language"}
        </p>
        {/* Hindi line just below */}
        <p className="text-sm text-zinc-700 dark:text-zinc-200 mb-6">
          {"अपनी भाषा चुनें"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            className="h-12 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold shadow"
            onClick={() => choose("en")}
          >
            {t("lang_english") || "English"}
          </button>
          <button
            className="h-12 rounded-xl bg-white dark:bg-[#2d2650] text-primary dark:text-white font-semibold border border-primary/20"
            onClick={() => choose("hi")}
          >
            {t("lang_hindi") || "हिंदी"}
          </button>
        </div>
      </div>
    </div>
  );
}
