import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function BondsReturns({ bonds }) {
  // Data for Bar Chart (YTM)
  const barData = {
    labels: bonds.map((bond) => bond.name.split(" ").slice(0, 2).join(" ")), // Truncate long names
    datasets: [
      {
        label: "Yield to Maturity (%)",
        data: bonds.map((bond) => bond.ytm),
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Indigo
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Data for Line Chart (Coupon Rates)
  const lineData = {
    labels: bonds.map((bond) => bond.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Coupon Rate (%)",
        data: bonds.map((bond) => bond.coupon_rate),
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Yield to Maturity (%)",
        data: bonds.map((bond) => bond.ytm),
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "rgba(168, 85, 247, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Data for Doughnut Chart (Bond Types)
  const govBonds = bonds.filter((bond) =>
    bond.name.includes("Government Security")
  ).length;
  const corpBonds = bonds.filter((bond) =>
    bond.name.includes("Corporate Bond")
  ).length;

  const doughnutData = {
    labels: ["Government Securities", "Corporate Bonds"],
    datasets: [
      {
        data: [govBonds, corpBonds],
        backgroundColor: [
          "#059669", // Emerald
          "#DC2626", // Red
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
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

  const lineOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
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

  // Calculate years to maturity for each bond
  const getYearsToMaturity = (maturityDate) => {
    const maturity = new Date(maturityDate);
    const today = new Date();
    const years = (maturity - today) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, years).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Bond Portfolio Analysis
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Comprehensive overview of your recommended fixed income securities
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - YTM */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Yield to Maturity
            </h3>
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Bond Types */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Bond Distribution
            </h3>
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="h-64 md:h-80">
            <Doughnut
              data={doughnutData}
              options={{
                ...chartOptions,
                cutout: "60%",
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    ...chartOptions.plugins.tooltip,
                    callbacks: {
                      label: function (context) {
                        const label = context.label;
                        const value = context.parsed;
                        const total = govBonds + corpBonds;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} bonds (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Line Chart - Full Width */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Coupon Rate vs Yield Comparison
          </h3>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="h-64 md:h-96">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Bond Details Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Bond Details</h3>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">
                  Bond Name
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  YTM
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Coupon Rate
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Maturity
                </th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">
                  Years Left
                </th>
              </tr>
            </thead>
            <tbody>
              {bonds.map((bond, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-medium text-gray-800">
                    {bond.name}
                  </td>
                  <td className="py-3 px-2 text-right text-indigo-600 font-semibold">
                    {bond.ytm}%
                  </td>
                  <td className="py-3 px-2 text-right text-green-600 font-semibold">
                    {bond.coupon_rate}%
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 text-xs">
                    {bond.maturity_date}
                  </td>
                  <td className="py-3 px-2 text-right text-amber-600 font-semibold">
                    {getYearsToMaturity(bond.maturity_date)} yrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maturity Timeline */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Maturity Timeline
          </h3>
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        </div>
        <div className="space-y-3">
          {bonds
            .sort(
              (a, b) => new Date(a.maturity_date) - new Date(b.maturity_date)
            )
            .map((bond, index) => {
              const yearsLeft = getYearsToMaturity(bond.maturity_date);
              const isGov = bond.name.includes("Government Security");

              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        isGov ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {bond.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {bond.maturity_date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-600">
                      {yearsLeft} years
                    </p>
                    <p className="text-xs text-gray-500">{bond.ytm}% YTM</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Bond Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{bonds.length}</p>
            <p className="text-sm text-gray-600">Total Bonds</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {(
                bonds.reduce((sum, bond) => sum + bond.ytm, 0) / bonds.length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. YTM</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {(
                bonds.reduce((sum, bond) => sum + bond.coupon_rate, 0) /
                bonds.length
              ).toFixed(2)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg. Coupon</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.max(
                ...bonds.map((bond) =>
                  parseFloat(getYearsToMaturity(bond.maturity_date))
                )
              ).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Max Maturity (yrs)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondsReturns;