import React from "react";
import { Bar, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";

// Register required components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadarController
);

function ETFReturns({ etfs }) {
  // Data for Bar Chart (3-Year Returns)
  const barData = {
    labels: etfs.map((etf) => etf.name.split(" ").slice(0, 3).join(" ")), // Truncate long names
    datasets: [
      {
        label: "3-Year Return (%)",
        data: etfs.map((etf) => etf.return_3y),
        backgroundColor: "rgba(16, 185, 129, 0.8)", // Emerald
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Data for Scatter Chart (Return vs Risk)
  const scatterData = {
    datasets: [
      {
        label: "Return vs Risk",
        data: etfs.map((etf) => ({
          x: etf.standard_deviation,
          y: etf.return_3y,
        })),
        backgroundColor: "rgba(245, 158, 11, 0.8)", // Amber
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  };

  // Data for Radar Chart (Risk-Return-Cost)
  const radarData = {
    labels: etfs.map((etf) => etf.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Risk (Standard Deviation %)",
        data: etfs.map((etf) => etf.standard_deviation),
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(239, 68, 68, 1)",
      },
      {
        label: "Expense Ratio (%)",
        data: etfs.map((etf) => etf.expense_ratio * 10), // Scale up for visibility
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(139, 92, 246, 1)",
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

  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: "Risk (Standard Deviation %)",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "3-Year Return (%)",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
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
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function (context) {
            const etfName = etfs[context.dataIndex]?.name || "ETF";
            return `${etfName}: ${context.parsed.y}% return, ${context.parsed.x}% risk`;
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
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          ETF Performance Analysis
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Comprehensive overview of your recommended Exchange Traded Funds
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - 3-Year Returns */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              3-Year Returns
            </h3>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Scatter Chart - Risk vs Return */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Risk vs Return
            </h3>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Scatter data={scatterData} options={scatterOptions} />
          </div>
        </div>
      </div>

      {/* Radar Chart - Full Width */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Risk & Cost Analysis
          </h3>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        <div className="h-64 md:h-96 flex justify-center">
          <div className="w-full max-w-md">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-600 text-center">
          Note: Expense ratios are scaled 10x for better visibility in radar
          chart
        </div>
      </div>

      {/* ETF Details Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">ETF Details</h3>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  ETF Name
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  3Y Return
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Expense Ratio
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Risk (Std Dev)
                </th>
              </tr>
            </thead>
            <tbody>
              {etfs.map((etf, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-medium text-gray-800">
                    {etf.name.split(" ").slice(0, 4).join(" ")}
                  </td>
                  <td className="py-3 px-2 text-right text-emerald-600 font-semibold">
                    {etf.return_3y}%
                  </td>
                  <td className="py-3 px-2 text-right text-blue-600 font-semibold">
                    {etf.expense_ratio}%
                  </td>
                  <td className="py-3 px-2 text-right text-amber-600 font-semibold">
                    {etf.standard_deviation}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ETF Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{etfs.length}</p>
            <p className="text-sm text-gray-600">Total ETFs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {(
                etfs.reduce((sum, etf) => sum + etf.return_3y, 0) / etfs.length
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Return</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {(
                etfs.reduce((sum, etf) => sum + etf.expense_ratio, 0) /
                etfs.length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Expense</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.max(...etfs.map((etf) => etf.return_3y)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Best Return</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ETFReturns;
