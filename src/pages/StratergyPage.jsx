import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Alert } from "@heroui/react";
import { getReportByType } from "../services/middleware";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function getPieData(allocation) {
  // Filter out percentage keys
  const filtered = Object.entries(allocation).filter(
    ([key]) => !key.endsWith("%")
  );
  const labels = filtered.map(([key]) => key);
  const data = filtered.map(([, value]) => value);
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
  const location = useLocation();
  const strategies = location.state?.strategy?.[0]?.strategies || [];

  const navigate = useNavigate();

  const handleClick = async (e, strategy) => {
    e.preventDefault();
    let type = location.state?.strategy?.[0]?.type || 32;
    if (strategy.riskLevel == "Low") type = (type * 10) + 1;
    else if (strategy.riskLevel == "Moderate") type = (type * 10) + 2;
    else if (strategy.riskLevel == "High") type = (type * 10) + 3;

    try {
      const response = await getReportByType(type);
      console.log(response.data.report)
      navigate("/investment-report", {
        state: { reportData: response.data.report },
      });
    } catch (error) {
      alert("Failed to fetch report.");
    }
    
  };

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
              onClick={(e) => handleClick(e, strategy)}
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
                {Object.entries(strategy.allocation)
                  .filter(([key]) => !key.endsWith("%"))
                  .map(([asset, amount]) => (
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
              <div className="w-full mt-4 flex flex-col items-center">
                <span className="block text-xs text-gray-500">
                  Projected Maturity Amount
                </span>
                <span className="block text-xl font-bold text-blue-700">
                  {Array.isArray(strategy.maturityAmount)
                    ? `₹${Number(
                        strategy.maturityAmount[0]
                      ).toLocaleString()} - ₹${Number(
                        strategy.maturityAmount[1]
                      ).toLocaleString()}`
                    : strategy.maturityAmount !== undefined &&
                      strategy.maturityAmount !== null
                    ? `₹${Number(strategy.maturityAmount).toLocaleString()}`
                    : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
