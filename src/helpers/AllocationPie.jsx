import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

function AllocationPie({ allocations }) {
  const totalAmount = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );

  const colors = [
    "#8B5CF6", // Purple
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F472B6", // Pink
  ];

  const data = {
    labels: Object.keys(allocations),
    datasets: [
      {
        data: Object.values(allocations),
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 12,
        hoverBorderWidth: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13, weight: "500" },
        callbacks: {
          label: function (context) {
            const label = context.label;
            const value = context.parsed;
            const percentage = ((value / totalAmount) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    layout: {
      padding: 20,
    },
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 shadow-xl border border-purple-100 rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">
            Investment Allocation
          </h3>
        </div>
        <div className="flex items-center space-x-2 bg-purple-100 border border-purple-200 px-4 py-2 rounded-full">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-purple-700">
            ₹{totalAmount.toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Side - Chart */}
        <div className="flex items-center justify-center order-2 xl:order-1">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <div className="h-64 sm:h-72 md:h-80">
              <Pie data={data} options={options} />
            </div>

            {/* Center Text for Donut Chart */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg border border-purple-100">
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-purple-600 font-medium">
                  Monthly Total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Breakdown and Summary */}
        <div className="space-y-6 order-1 xl:order-2">
          {/* Allocation Breakdown */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Asset Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(allocations).map(([category, amount], index) => {
                const percentage = ((amount / totalAmount) * 100).toFixed(1);

                return (
                  <div
                    key={category}
                    className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: colors[index] }}
                        ></div>
                        <div
                          className="absolute inset-0 w-4 h-4 rounded-full opacity-30 group-hover:animate-pulse"
                          style={{ backgroundColor: colors[index] }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {category}
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{amount.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: colors[index],
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-xl font-extrabold text-emerald-600">
                  {Object.keys(allocations).length}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  Asset Classes
                </p>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <p className="text-xl font-extrabold text-blue-600">
                  ₹{(totalAmount * 12).toLocaleString()}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  Annual Total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllocationPie;
