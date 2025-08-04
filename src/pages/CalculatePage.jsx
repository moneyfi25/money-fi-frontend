import React, { useState } from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { NumberInput, Slider, Select, SelectItem } from "@heroui/react";
import { Form } from "@heroui/form";
import { sendUserInputs } from "../services/middleware";
import {
  ShieldCheck,
  TrendingUp,
  Sun,
  Moon,
  PiggyBank,
  Calendar,
  User,
  BarChart,
} from "lucide-react";
import { useTheme } from "next-themes";
import Lottie from "lottie-react";
import planLottie from "../assets/plan.json";

// --- FieldCard Component ---
function FieldCard({ label, children, icon }) {
  return (
    <div className="w-full group">
      <div
        className={`
          relative rounded-2xl
          bg-gradient-to-b
            from-primary/5 via-white/70 to-primary/10
            dark:from-[#2e2355]/80 dark:via-[#3a2e66]/60 dark:to-[#6d5ece]/70
          border border-primary/15 dark:border-[#a789fa]/20
          backdrop-blur-md
          p-5 shadow-lg
          transition-all duration-300
          group-focus-within:ring-2 group-focus-within:ring-primary/50
          hover:scale-[1.025] hover:shadow-2xl
        `}
        style={{
          boxShadow:
            "0 2px 16px 2px rgba(124,58,237,0.11), 0 2px 30px 4px rgba(185,169,250,0.14)",
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          {icon && <span className="text-primary dark:text-[#b9a9fa]">{icon}</span>}
          <span className="block text-base font-bold text-primary dark:text-white tracking-tight drop-shadow-sm">
            {label}
          </span>
        </div>
        <div className="dark:text-white">{children}</div>
      </div>
    </div>
  );
}

// --- TopBar ---
function TopBar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 absolute top-0 left-0 z-20 bg-transparent">
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.href = "/"}
          className="text-2xl font-black text-primary dark:text-white tracking-tight"
        >
          Money-Fi
        </button>
        <TrendingUp className="text-primary dark:text-[#b9a9fa]" size={26} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className={`
          w-12 h-12 md:w-14 md:h-14
          rounded-full
          flex items-center justify-center
          bg-white/70 dark:bg-[#2c1e52]/80
          border border-transparent
          shadow
          hover:scale-110 hover:bg-primary/10 dark:hover:bg-[#38276c]/80
          hover:shadow-[0_0_16px_4px_rgba(124,58,237,0.11)]
          backdrop-blur
          transition-all duration-200
        `}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span className="relative flex items-center justify-center transition-all duration-200">
          {theme === "dark" ? (
            <Sun
              size={32}
              className="text-yellow-300 drop-shadow-[0_0_6px_rgba(250,217,136,0.44)]"
            />
          ) : (
            <Moon
              size={30}
              className="text-primary"
            />
          )}
        </span>
      </Button>
    </header>
  );
}

export const riskOptions = [
  { key: "Conservative", label: "Conservative" },
  { key: "Moderate", label: "Moderate" },
  { key: "Aggressive", label: "Aggressive" },
];

export const objectiveOptions = [
  { key: "Marriage", label: "Marriage" },
  { key: "Child Education", label: "Child Education" },
  { key: "Retirement", label: "Retirement" },
  { key: "Travel", label: "Travel" },
  { key: "Home Purchase", label: "Home Purchase" },
  { key: "Emergency Fund", label: "Emergency Fund" },
  { key: "Wealth Creation", label: "Wealth Creation" },
  { key: "Health Care", label: "Health Care" },
  { key: "Tax Saving", label: "Tax Saving" },
  { key: "Other", label: "Other" },
];

const CalculatePage = () => {
  const navigate = useNavigate();
  const [objective, setObjective] = useState("");
  const [risk, setRisk] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthlyInvestment: 10000,
    yearsToAchieve: 5,
    age: 25,
    objective: "",
    risk: "",
  });

  const handleScreening = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const finalFormData = { ...formData, objective, risk };
      const response = await sendUserInputs(finalFormData);
      if (response.status === "completed" || response.status === "success") {
        localStorage.setItem("investment_recommendations", JSON.stringify(response));
        localStorage.setItem("user_profile", JSON.stringify(finalFormData));
        navigate("/recommendations", {
          state: { recommendations: response, userProfile: finalFormData },
        });
      } else {
        alert("Analysis failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-primary-light via-white to-primary/10 dark:from-[#232048] dark:via-[#372c67] dark:to-[#2c184d] transition-colors flex items-center justify-center">
      <TopBar />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-4 w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-[#533fc8]/30 blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-gradient-to-bl from-primary-light/70 to-primary/30 blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-[#a789fa]/50 to-[#533fc8]/20 blur-2xl opacity-20 animate-pulse"></div>
      </div>

      {/* Glass card */}
      <div className="w-full max-w-2xl z-10 flex flex-col items-center justify-center gap-4 p-6 md:p-10 rounded-3xl bg-white/80 dark:bg-[#241e39]/95 backdrop-blur-xl border border-primary/15 dark:border-[#a789fa]/15 shadow-2xl relative">

        {/* Lottie animation */}
        <div className="w-48 h-48 md:w-72 md:h-72 mx-auto mb-1 mt-1 flex-shrink-0 overflow-hidden flex items-center justify-center">
          <Lottie
            animationData={planLottie}
            loop
            autoplay
            style={{
              width: "230%",
              height: "230%",
              transform: "scale(1.3) translateY(1%)",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Headline + glowing accent bar */}
        <div className="w-full flex flex-col items-center gap-2 mb-4 mt-0">
          <div
            className="
              w-16 h-2 rounded-xl mb-2
              bg-gradient-to-r
              from-primary to-primary-dark
              dark:from-[#b9a9fa] dark:to-[#a789fa]
              shadow dark:shadow-lg
              transition-all
              drop-shadow-[0_2px_12px_rgba(186,136,250,0.32)]
              "
            style={{
              boxShadow:
                "0 2px 10px 1px rgba(124,58,237,0.18), 0 0 16px 4px rgba(185,169,250,0.24)",
            }}
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary dark:text-white tracking-tight text-center drop-shadow-[0_2px_8px_rgba(124,58,237,0.10)]">
            Plan Your Investment
          </h1>
          <p className="text-base md:text-lg text-zinc-700 dark:text-white text-center font-medium">
            Personalized advice to reach your financial goals faster.
          </p>
        </div>

        {/* Sexy glass fields */}
        <Form onSubmit={handleScreening} className="w-full">
          <div className="flex flex-col gap-7 w-full items-center md:items-start justify-center">

            <FieldCard label="What is your objective?" icon={<PiggyBank size={20}/>}>
              <Select
                className="w-full mt-2 dark:text-white"
                variant="bordered"
                placeholder="Select Objective"
                name="objective"
                aria-label="Objective"
                selectedKeys={objective}
                onSelectionChange={setObjective}
              >
                {objectiveOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </FieldCard>

            <FieldCard label="How much can you invest monthly?" icon={<BarChart size={20}/>}>
            <NumberInput
              className="w-full mt-2 dark:text-white"
              variant="bordered"
              hideStepper
              placeholder="10,000"
              name="monthlyInvestment"
              aria-label="Monthly Investment"
              value={formData.monthlyInvestment}
              min={0}
              onChange={value => {
                const numValue = Number(String(value).replace(/,/g, ""));
                if (!isNaN(numValue) && numValue >= 0) {
                  setFormData(prev => ({
                    ...prev,
                    monthlyInvestment: numValue
                  }));
                }
              }}
            />
          </FieldCard>

            <FieldCard label="What is your age?" icon={<User size={20}/>}>
            <NumberInput
              className="w-full mt-2 dark:text-white"
              variant="bordered"
              hideStepper
              placeholder="25"
              name="age"
              aria-label="Age"
              value={formData.age}
              min={0}
              onChange={value => {
                const numValue = Number(String(value).replace(/,/g, ""));
                if (!isNaN(numValue) && numValue >= 0) {
                  setFormData(prev => ({
                    ...prev,
                    age: numValue
                  }));
                }
              }}
            />
          </FieldCard>

            <FieldCard label="In how many years do you want to achieve your goal?" icon={<Calendar size={20}/>}>
              <Slider
                className="w-full mt-2 dark:text-white"
                defaultValue={5}
                value={formData.yearsToAchieve}
                label="Years"
                name="yearsToAchieve"
                aria-label="Years to Achieve"
                maxValue={40}
                minValue={1}
                step={1}
                onChange={value => setFormData(prev => ({ ...prev, yearsToAchieve: value }))}
              />
              <span className="text-sm text-primary dark:text-white font-semibold text-right mt-2 block">
                {formData.yearsToAchieve} {formData.yearsToAchieve === 1 ? "year" : "years"}
              </span>
            </FieldCard>

            <FieldCard label="How much risk are you willing to take?" icon={<BarChart size={20}/>}>
              <Select
                className="w-full mt-2 dark:text-white"
                variant="bordered"
                placeholder="Select Risk Level"
                name="risk"
                aria-label="Risk Level"
                selectedKeys={risk}
                onSelectionChange={setRisk}
              >
                {riskOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </FieldCard>

            {/* SUBMIT */}
            <div className="w-full flex justify-center mt-4">
              <Button
                color="primary"
                className="w-full md:w-56 h-14 text-xl font-bold rounded-2xl shadow-xl bg-gradient-to-r from-primary to-primary-dark hover:bg-primary/80 dark:bg-gradient-to-r dark:from-[#a789fa] dark:to-[#8255e7] transition-all"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Show My Plan"}
              </Button>
            </div>
          </div>
        </Form>

        {/* Trust message */}
        <div className="w-full mt-7 flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-white">
          <ShieldCheck size={17} className="text-green-500" />
          <span>Your information stays private and secure.</span>
        </div>
      </div>
    </div>
  );
};

export default CalculatePage;
