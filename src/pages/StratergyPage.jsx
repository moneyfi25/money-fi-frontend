import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Example strategy data (replace with your real data)
const strategies = [
  {
    name: "Balanced Growth",
    description: "A balanced approach for moderate risk and steady growth.",
    allocation: {
      "Mutual Funds": 5000,
      ETFs: 3000,
      Bonds: 2000,
    },
    expectedReturn: "10-12%",
    riskLevel: "Moderate",
  },
  {
    name: "Aggressive Equity",
    description: "Higher equity allocation for aggressive growth seekers.",
    allocation: {
      "Mutual Funds": 7000,
      ETFs: 2500,
      Bonds: 500,
    },
    expectedReturn: "13-16%",
    riskLevel: "High",
  },
  {
    name: "Conservative Income",
    description:
      "Focuses on capital preservation and steady income with minimal risk.",
    allocation: {
      "Mutual Funds": 2000,
      ETFs: 1000,
      Bonds: 7000,
    },
    expectedReturn: "6-8%",
    riskLevel: "Low",
  },
];

function getPieData(allocation) {
  const labels = Object.keys(allocation);
  const data = Object.values(allocation);
  const colors = [
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E42", // Amber
    "#EF4444", // Red
    "#3B82F6", // Blue
  ];
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 8,
      },
    ],
  };
}

const cardColors = [
  "from-indigo-100 to-indigo-50",
  "from-emerald-100 to-emerald-50",
  "from-amber-100 to-amber-50",
  "from-blue-100 to-blue-50",
];

export default function StratergyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Investment Strategies
        </h1>
        <p className="text-gray-600 text-lg mb-10 text-center">
          Explore recommended strategies and their asset allocations.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {strategies.map((strategy, idx) => (
            <div
              key={strategy.name}
              className={`bg-gradient-to-br ${
                cardColors[idx % cardColors.length]
              } rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {strategy.name}
              </h2>
              <p className="text-gray-600 mb-4 text-center">
                {strategy.description}
              </p>
              <div className="w-48 h-48 mb-6">
                <Pie
                  data={getPieData(strategy.allocation)}
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          font: { size: 14, family: "'Inter', sans-serif" },
                          color: "#374151",
                          padding: 16,
                        },
                      },
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              </div>
              <div className="w-full grid grid-cols-3 gap-4 mt-2 mb-4">
                {Object.entries(strategy.allocation).map(([asset, amount]) => (
                  <div
                    key={asset}
                    className="bg-white rounded-xl shadow p-3 flex flex-col items-center"
                  >
                    <span className="text-sm text-gray-500">{asset}</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between w-full mt-4">
                <div>
                  <span className="block text-xs text-gray-500">
                    Expected Return
                  </span>
                  <span className="block text-base font-semibold text-green-600">
                    {strategy.expectedReturn}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">
                    Risk Level
                  </span>
                  <span className="block text-base font-semibold text-amber-600">
                    {strategy.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
