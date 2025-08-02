import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./components/theme-provider.jsx"; // shadcn/ui

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ThemeProvider defaultTheme="system" attribute="class">
        <App />
      </ThemeProvider>
    </HeroUIProvider>
  </StrictMode>
);
