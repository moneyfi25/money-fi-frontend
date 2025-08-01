import React from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  BarElement,
  ArcElement,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MutualFundReturns({ mutualFunds }) {
  // Data for Bar Chart (5-Year Returns)
  const barData = {
    labels: mutualFunds.map((f) => f.name.split(" ").slice(0, 3).join(" ")), // Truncate long names
    datasets: [
      {
        label: "5-Year Return (%)",
        data: mutualFunds.map((f) => f.return_5y),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Data for Pie Chart (Equal allocation for visualization)
  const pieData = {
    labels: mutualFunds.map((f) => f.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        data: new Array(mutualFunds.length).fill(1), // Equal allocation
        backgroundColor: [
          "#10B981", // Emerald
          "#3B82F6", // Blue
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#8B5CF6", // Violet
          "#06B6D4", // Cyan
          "#84CC16", // Lime
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 8,
      },
    ],
  };

  // Data for Radar Chart (Expense Ratios)
  const radarData = {
    labels: mutualFunds.map((f) => f.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Expense Ratio (%)",
        data: mutualFunds.map((f) => (f.expense_ratio ? f.expense_ratio : 0)),
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(239, 68, 68, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Mutual Fund Analysis
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Comprehensive performance overview of your recommended funds
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              5-Year Returns
            </h3>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Fund Distribution
            </h3>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Radar Chart - Full Width */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Expense Ratio Comparison
          </h3>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        <div className="h-64 md:h-96 flex justify-center">
          <div className="w-full max-w-md">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {mutualFunds.length}
            </p>
            <p className="text-sm text-gray-600">Total Funds</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {(
                mutualFunds.reduce((sum, f) => sum + f.return_5y, 0) /
                mutualFunds.length
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Return</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {(
                mutualFunds
                  .filter((f) => f.expense_ratio)
                  .reduce((sum, f) => sum + f.expense_ratio, 0) /
                mutualFunds.filter((f) => f.expense_ratio).length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Expense</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.max(...mutualFunds.map((f) => f.return_5y)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Best Return</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MutualFundReturns;
