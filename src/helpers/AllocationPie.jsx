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

  const data = {
    labels: Object.keys(allocations),
    datasets: [
      {
        data: Object.values(allocations),
        backgroundColor: [
          "#10B981", // Emerald
          "#3B82F6", // Blue
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#8B5CF6", // Violet
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend since we're creating custom breakdown
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
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
    cutout: "50%", // Creates a donut chart for better visual appeal
    layout: {
      padding: 10,
    },
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Investment Allocation
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            Monthly: ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Content - Left Right Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Breakdown and Summary */}
        <div className="space-y-6">
          {/* Allocation Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(allocations).map(([category, amount], index) => {
                const percentage = ((amount / totalAmount) * 100).toFixed(1);
                const colors = [
                  "#10B981",
                  "#3B82F6",
                  "#F59E0B",
                  "#EF4444",
                  "#8B5CF6",
                ];

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Summary
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {Object.keys(allocations).length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Annual Investment</span>
                <span className="text-sm font-semibold text-blue-600">
                  ₹{(totalAmount * 12).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Distribution</span>
                <span className="text-sm font-semibold text-amber-600">
                  {Math.max(...Object.values(allocations)) ===
                  Math.min(...Object.values(allocations))
                    ? "Equal"
                    : "Varied"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            <div className="h-64 md:h-80">
              <Pie data={data} options={options} />
            </div>

            {/* Center Text for Donut Chart */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  ₹{totalAmount.toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  Total Monthly
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
