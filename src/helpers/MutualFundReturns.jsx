import React from "react";
import { Bar, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getMutualFundDetails } from "../services/middleware";
import { useNavigate } from "react-router-dom";

// Register required components
ChartJS.register(
  BarElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MutualFundReturns({ mutualFunds }) {
  const navigate = useNavigate();
  const handleFundClick = async (fund) => {
    try {
      const encodedName = encodeURIComponent(fund.name);
      navigate(`/fund-details/${encodedName}`);
    } catch (err) {
      alert("Failed to fetch fund details.");
    }
  };
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

  // Data for Scatter Chart (Risk vs Returns)
  const scatterData = {
    datasets: mutualFunds.map((f, index) => ({
      label: f.name || `Fund ${index + 1}`, // Use fund name or fallback to "Fund X"
      data: [
        {
          x: f.key_metrics?.["Sharpe Ratio"] || Math.random() * 10, // Extract Sharpe Ratio
          y: f.return_5y || 0, // Extract 5-Year CAGR
        },
      ],
      backgroundColor: `hsl(${index * 50}, 70%, 50%)`, // Generate unique color for each fund
      borderColor: `hsl(${index * 50}, 70%, 40%)`,
      borderWidth: 1,
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
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
  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: "Risk Level",
          font: { size: 12, family: "'Inter', sans-serif" },
        },
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
        },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "5-Year Return (%)",
          font: { size: 12, family: "'Inter', sans-serif" },
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: { size: 11, family: "'Inter', sans-serif" },
        },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
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

      {/* Quick Overview Table */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fund Overview
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Quick snapshot of your mutual fund portfolio
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">#</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rank
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Fund Name
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      5Y Return
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mutualFunds.map((f, i) => {
                const returnValue =
                  typeof f?.return_5y === "number"
                    ? f.return_5y
                    : f?.["5-Year Return"] != null
                    ? Number(f["5-Year Return"])
                    : 0;

                const returnColor =
                  returnValue >= 15
                    ? "text-emerald-600 bg-emerald-50"
                    : returnValue >= 10
                    ? "text-blue-600 bg-blue-50"
                    : "text-amber-600 bg-amber-50";

                return (
                  <tr
                    key={i}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">
                            {i + 1}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                        <div>
                          <button
                            className="text-sm font-semibold text-blue-700 hover:underline hover:text-blue-900 transition-colors"
                            onClick={() => handleFundClick(f)}
                          >
                            {f?.name || f?.["Fund Name"] || "-"}
                          </button>
                          <p className="text-xs text-gray-500 mt-1">
                            Equity Fund
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${returnColor} border`}
                        >
                          {returnValue > 0 && (
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {returnValue ? `${returnValue.toFixed(2)}%` : "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3">
          <p className="text-xs text-gray-600 text-center">
            💡 Higher returns indicate better fund performance over the 5-year
            period
          </p>
        </div>
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

        {/* Scatter Chart */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Risk vs Returns Distribution
            </h3>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Scatter data={scatterData} options={scatterOptions} />
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
