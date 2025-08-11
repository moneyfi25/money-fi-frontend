// main.jsx
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./components/theme-provider.jsx";
import "./i18n";           // ✅ ensure i18n is initialized
import i18n from "./i18n"; // (optional) for syncing <html lang>

if (typeof document !== "undefined") {
  document.documentElement.setAttribute("lang", i18n.language || "en");
  i18n.on("languageChanged", (lng) => {
    document.documentElement.setAttribute("lang", lng);
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ThemeProvider defaultTheme="system" attribute="class">
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </ThemeProvider>
    </HeroUIProvider>
  </StrictMode>
);
