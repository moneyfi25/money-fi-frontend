import React from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { form, NumberInput } from "@heroui/react";
import { useParams } from "react-router-dom";
import { Slider } from "@heroui/react";
import { Form } from "@heroui/form";
import { useState } from "react";
import { sendUserInputs } from "../services/middleware";
import { Select, SelectItem } from "@heroui/react";

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
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    monthlyInvestment: 10000,
    yearsToAchieve: 5,
    age: 25,
    objective: "",
    risk: "",
  });

  const handleScreening = async (e) => {
    e.preventDefault();

    console.log("🚀 Starting analysis...");
    console.log("📋 Form data before submission:", formData);

    try {
      setIsLoading(true);

      // Update formData with current selections
      const finalFormData = {
        ...formData,
        objective: objective,
        risk: risk,
      };

      console.log("📤 Sending data to backend:", finalFormData);

      const response = await sendUserInputs(finalFormData);

      console.log("🎉 Analysis completed!");
      console.log("📊 Complete response:", response);
      console.log("💰 Agent recommendations:", response.result);

      // Check if the response is successful
      if (response.status === "completed" || response.status === "success") {
        // Store data in localStorage as backup
        localStorage.setItem(
          "investment_recommendations",
          JSON.stringify(response)
        );
        localStorage.setItem("user_profile", JSON.stringify(finalFormData));

        console.log("🔄 Navigating to recommendations page...");

        // Navigate to recommendations page with data
        navigate("/recommendations", {
          state: {
            recommendations: response,
            userProfile: finalFormData,
          },
        });
      } else {
        console.error("❌ Backend returned unsuccessful response:", response);
        // You can show an error message here
        alert("Analysis failed. Please try again.");
      }
    } catch (error) {
      console.error("💥 Error during screening:", error);

      // Handle different types of errors
      if (error.message.includes("timeout")) {
        console.error("⏰ The analysis is taking longer than expected");
        alert("Analysis is taking longer than expected. Please try again.");
      } else if (error.message.includes("Task not found")) {
        console.error("🔍 Task was not found on the server");
        alert("Task not found. Please try again.");
      } else {
        console.error("🚨 Unexpected error occurred");
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-auto flex items-center justify-center">
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 left-80 w-40 h-40 bg-blue-400 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-30 right-20 w-56 h-56 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-2xl"></div>

      <div className="w-full max-w-4xl z-10 flex flex-col items-center justify-center gap-4 p-6 md:p-8 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white/30">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 text-center">
          Get Your Investment Recommendations
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center">
          Choose how much you can give to achieve your goal
        </p>
        <Form onSubmit={handleScreening}>
          <div className="flex flex-col gap-6 w-full items-center md:items-start justify-center">
            <div className="flex flex-col justify-between items-center md:items-start gap-3 w-full">
              <div className="text-xl md:text-xl font-bold text-blue-700 text-center md:text-left">
                What is your objective?
              </div>
              <Select
                className="w-full md:w-2/3"
                variant="bordered"
                placeholder="Select Objective"
                name="objective"
                aria-label="Objective"
                selectedKeys={objective}
                onSelectionChange={(value) => setObjective(value)}
              >
                {objectiveOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col justify-between items-center md:items-start gap-3 w-full">
              <div className="text-xl md:text-xl font-bold text-blue-700 text-center md:text-left">
                How much can you invest monthly?
              </div>
              <NumberInput
                className="w-full md:w-1/3"
                variant="bordered"
                hideStepper
                placeholder="10,000"
                name="monthlyInvestment"
                aria-label="Monthly Investment"
                onChange={(value) =>
                  setFormData({ ...formData, monthlyInvestment: value })
                }
              />
            </div>
            <div className="flex flex-col justify-between items-center md:items-start gap-3 w-full">
              <div className="text-xl md:text-xl font-bold text-blue-700 text-center md:text-left">
                What is your age?
              </div>
              <NumberInput
                className="w-full md:w-1/3"
                variant="bordered"
                hideStepper
                placeholder="25"
                name="age"
                aria-label="Age"
                onChange={(value) => setFormData({ ...formData, age: value })}
              />
            </div>
            <div className="flex flex-col justify-between items-center md:items-start gap-3 w-full">
              <div className="text-xl md:text-xl font-bold text-blue-700 text-center md:text-left">
                In how many years do you want to achieve your goal?
              </div>
              <Slider
                className="w-full md:max-w-md"
                defaultValue={5}
                label="Years"
                name="yearsToAchieve"
                aria-label="Years to Achieve"
                maxValue={40}
                minValue={1}
                step={1}
                onChange={(value) =>
                  setFormData({ ...formData, yearsToAchieve: value })
                }
              />
            </div>
            <div className="flex flex-col justify-between items-center md:items-start gap-3 w-full">
              <div className="text-xl md:text-xl font-bold text-blue-700 text-center md:text-left">
                How much risk are you willing to take?
              </div>
              <Select
                className="w-full md:w-1/2"
                variant="bordered"
                placeholder="Select Risk Level"
                name="risk"
                aria-label="Risk Level"
                selectedKeys={risk}
                onSelectionChange={(value) => setRisk(value)}
              >
                {riskOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="self-center md:self-end">
              <Button
                variant="shadow"
                color="primary"
                className="w-32 md:w-40 h-10 md:h-12 text-lg md:text-xl font-semibold"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyse"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CalculatePage;

// user_inputs = {
//   "objective": "Marriage",
//   "horizon": "5 years",
//   "age": 25,
//   "monthly_investment": 15000,
//   "risk": "Conservative",
//   "fund_type": "-",
//   "special_prefs": "-"
// }
