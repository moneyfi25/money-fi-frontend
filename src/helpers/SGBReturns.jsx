import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function SGBReturns({ sgbs }) {
  if (!sgbs || sgbs.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 text-center text-gray-500">
        No SGBs found for this allocation.
      </div>
    );
  }

  // Data for Bar Chart (Last Traded Price)
  const barData = {
    labels: sgbs.map((sgb) => sgb.name),
    datasets: [
      {
        label: "Last Traded Price (₹)",
        data: sgbs.map((sgb) => sgb.last_traded_price),
        backgroundColor: "rgba(251, 191, 36, 0.8)", // Amber
        borderColor: "rgba(251, 191, 36, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Data for Doughnut Chart (Interest Rate vs Expected Returns)
  const doughnutData = {
    labels: ["Interest Rate (%)", "Expected Returns (%)"],
    datasets: [
      {
        data: [
          sgbs.reduce((sum, sgb) => sum + (sgb.interest_rate || 0), 0),
          sgbs.reduce((sum, sgb) => sum + (sgb.expected_returns || 0), 0),
        ],
        backgroundColor: [
          "#fbbf24", // Amber
          "#6366f1", // Indigo
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  // Calculate years to maturity for each SGB
  const getYearsToMaturity = (maturityYear) => {
    const year = parseInt(maturityYear, 10);
    const now = new Date().getFullYear();
    return Math.max(0, year - now);
  };

  // Chart options
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
        grid: { display: false },
        ticks: {
          font: { size: 10, family: "'Inter', sans-serif" },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
          callback: function (value) {
            return "₹" + value;
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
          Sovereign Gold Bond Analysis
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Overview of your recommended SGB holdings
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Last Traded Price */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Last Traded Price
            </h3>
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Interest Rate vs Expected Returns */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Interest vs Expected Returns
            </h3>
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* SGB Details Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">SGB Details</h3>
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  SGB Name
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Last Price
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Interest Rate
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Maturity Year
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Years Left
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Expected Returns
                </th>
              </tr>
            </thead>
            <tbody>
              {sgbs.map((sgb, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-medium text-gray-800">
                    {sgb.name}
                  </td>
                  <td className="py-3 px-2 text-right text-amber-600 font-semibold">
                    ₹{sgb.last_traded_price}
                  </td>
                  <td className="py-3 px-2 text-right text-indigo-600 font-semibold">
                    {sgb.interest_rate}%
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 text-xs">
                    {sgb.maturity_date}
                  </td>
                  <td className="py-3 px-2 text-right text-amber-600 font-semibold">
                    {getYearsToMaturity(sgb.maturity_date)} yrs
                  </td>
                  <td className="py-3 px-2 text-right text-green-600 font-semibold">
                    {sgb.expected_returns}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          SGB Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{sgbs.length}</p>
            <p className="text-sm text-gray-600">Total SGBs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {(
                sgbs.reduce((sum, sgb) => sum + (sgb.interest_rate || 0), 0) /
                sgbs.length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Interest Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {(
                sgbs.reduce(
                  (sum, sgb) => sum + (sgb.expected_returns || 0),
                  0
                ) / sgbs.length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Expected Returns</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {Math.max(
                ...sgbs.map((sgb) =>
                  parseFloat(getYearsToMaturity(sgb.maturity_date))
                )
              ).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Max Maturity (yrs)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SGBReturns;
