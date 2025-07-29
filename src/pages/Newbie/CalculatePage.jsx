import React from "react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { NumberInput } from "@heroui/react";
import { useParams } from "react-router-dom";
import { Slider } from "@heroui/react";
import { Form } from "@heroui/form";
import { useState } from "react";
import { scrneer } from "../../services/middleware";

const CalculatePage = () => {
  const { goal } = useParams();

  const [formData, setFormData] = useState({
    goalAmount: 100000,
    monthlyInvestment: 1000,
    yearsToAchieve: 5,
  });
  const handleScreening = async (e) => {
    e.preventDefault();
    try {
      const response = await scrneer(formData);
      console.log(response.data);
    } catch (error) {
      console.error("Error during screening:", error);
    }
  };

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden flex items-center justify-center">
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 left-80 w-40 h-40 bg-blue-400 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-30 right-20 w-56 h-56 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-2xl"></div>

      <div className="w-1/2 z-10 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white/30">
        <h1 className="text-5xl font-bold text-blue-800 items-center justify-center">
          For{" "}
          {goal ? goal.charAt(0).toUpperCase() + goal.slice(1) : "your goal"},
        </h1>
        <p className="text-lg text-gray-700">
          Choose how much you can give to achieve your goal
        </p>
        <Form onSubmit={handleScreening}>
          <div className="flex flex-col gap-6 w-full items-start justify-center">
            <div className="flex flex-col justify-between items-start gap-3">
              <div className="text-2xl font-bold text-blue-700">
                How much do you want for {goal}?
              </div>
              <NumberInput
                className="w-1/3"
                variant="bordered"
                hideStepper
                placeholder="100,000"
                name="goalAmount"
                aria-label="Goal Amount"
                onChange={(value) =>
                  setFormData({ ...formData, goalAmount: value })
                }
              />
            </div>
            <div className="flex flex-col justify-between items-start gap-3">
              <div className="text-2xl font-bold text-blue-700">
                How much can you invest monthly?
              </div>
              <NumberInput
                className="w-1/3"
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
            <div className="flex flex-col justify-between items-start gap-3">
              <div className="text-2xl font-bold text-blue-700">
                In how many years do you want to achieve your goal?
              </div>
              <Slider
                className="max-w-md"
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
            <div className="self-end">
              <Button
                variant="shadow"
                color="primary"
                className="w-40 h-12 text-xl font-semibold"
                type="submit"
              >
                Analyse
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CalculatePage;
