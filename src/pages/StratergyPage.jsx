import React, { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getReportByType } from "../services/middleware";
ChartJS.register(ArcElement, Tooltip, Legend);

function getPieData(allocation = {}) {
  const entries = Object.entries(allocation).filter(
    ([key]) => !key.endsWith("%") && key !== "totalMonthly"
  );
  const labels = entries.map(([key]) => key);
  const data = entries.map(([, value]) => Number(value ?? 0));
  const colors = [
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#F472B6",
  ];
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 3,
        borderColor: "#ffffff",
        hoverOffset: 12,
      },
    ],
  };
}

const cardGradients = [
  "from-purple-50 via-white to-blue-50",
  "from-emerald-50 via-white to-teal-50",
  "from-amber-50 via-white to-orange-50",
  "from-blue-50 via-white to-indigo-50",
  "from-rose-50 via-white to-pink-50",
];

const riskPillClass = (risk) => {
  if (risk === "Low")
    return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300";
  if (risk === "Moderate")
    return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300";
  return "bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border border-rose-300";
};

export default function StratergyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigatingIdx, setNavigatingIdx] = useState(null);

  const strategies = useMemo(() => {
    const s = location.state?.strategy;
    return Array.isArray(s) ? s : [];
  }, [location.state]);

  const handleClick = async (e, strategy, idx) => {
    e.preventDefault();
    if (navigatingIdx !== null) return;
    setNavigatingIdx(idx);

    const baseType = strategies[0]?.type ?? 32;
    const suffix =
      strategy.riskLevel === "Low"
        ? 1
        : strategy.riskLevel === "Moderate"
        ? 2
        : 3;
    const type = baseType * 10 + suffix;

    const computedAllocation =
      strategy.computedAllocation ||
      strategy.templateAllocation ||
      strategy.allocation ||
      {};

    try {
      const resp = await getReportByType(type, computedAllocation);
      const report = resp?.report ?? resp?.data?.report ?? resp;
      navigate("/investment-report", { state: { reportData: report } });
    } catch (error) {
      alert("Failed to fetch report.");
    } finally {
      setNavigatingIdx(null);
    }
  };

  if (!strategies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-purple-100">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <p className="text-gray-700 font-medium">No strategies to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 py-16 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Investment Strategies
          </h1>
          <p className="text-purple-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover personalized investment strategies tailored to your
            financial goals and risk tolerance
          </p>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {strategies.map((strategy, idx) => {
              const alloc =
                strategy.computedAllocation ||
                strategy.templateAllocation ||
                strategy.allocation ||
                {};

              const percentChips = Object.entries(alloc).filter(([k]) =>
                k.endsWith("%")
              );

              return (
                <div
                  key={`${strategy.name}-${idx}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleClick(e, strategy, idx) : null
                  }
                  className={`group relative bg-gradient-to-br ${
                    cardGradients[idx % cardGradients.length]
                  } rounded-3xl shadow-lg hover:shadow-2xl p-6 transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-white/70 backdrop-blur-sm overflow-hidden`}
                  onClick={(e) => handleClick(e, strategy, idx)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  {/* Top badges */}
                  <div className="relative flex justify-between items-start mb-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${riskPillClass(
                        strategy.riskLevel
                      )} shadow-sm`}
                    >
                      {strategy.riskLevel} Risk
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300 shadow-sm">
                      {strategy.expectedReturn}
                    </span>
                  </div>

                  {/* Strategy Info */}
                  <div className="relative text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {strategy.name}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>

                  {/* Pie Chart */}
                  <div className="relative w-full max-w-xs mx-auto mb-6">
                    <div className="h-48 sm:h-52">
                      <Pie
                        data={getPieData(alloc)}
                        options={{
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                font: {
                                  size: 11,
                                  family: "'Inter', sans-serif",
                                },
                                color: "#374151",
                                padding: 8,
                                usePointStyle: true,
                              },
                            },
                          },
                          maintainAspectRatio: false,
                          responsive: true,
                        }}
                      />
                    </div>
                  </div>

                  {/* Total Monthly Investment */}
                  {alloc.totalMonthly && (
                    <div className="relative mb-4 p-4 bg-gradient-to-r from-purple-100 via-purple-50 to-blue-100 rounded-2xl shadow-sm border border-purple-200">
                      <div className="text-center">
                        <span className="block text-xs text-purple-600 font-semibold uppercase tracking-wide">
                          Monthly Investment
                        </span>
                        <span className="block text-xl font-extrabold text-purple-800 mt-1">
                          ₹{Number(alloc.totalMonthly).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Asset Allocation Grid */}
                  <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {Object.entries(alloc)
                      .filter(
                        ([key]) => !key.endsWith("%") && key !== "totalMonthly"
                      )
                      .map(([asset, amount]) => (
                        <div
                          key={asset}
                          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 text-center border border-gray-100 hover:bg-white transition-colors duration-200"
                        >
                          <span className="block text-xs text-gray-500 font-medium mb-1">
                            {asset}
                          </span>
                          <span className="block text-sm font-bold text-gray-900">
                            ₹{Number(amount ?? 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Percentage Chips */}
                  {!!percentChips.length && (
                    <div className="relative flex flex-wrap gap-2 justify-center mb-4">
                      {percentChips.map(([k, v]) => (
                        <span
                          key={k}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-gray-700 border border-gray-200 shadow-sm"
                        >
                          {k.replace("%", "")}: {v}%
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Maturity Amount */}
                  <div className="relative text-center pt-4 border-t border-gray-200">
                    <span className="block text-xs text-gray-500 font-medium mb-1">
                      Projected Maturity Amount
                    </span>
                    <span className="block text-lg font-extrabold text-blue-700">
                      {String(strategy.maturityAmount ?? "N/A")}
                    </span>
                  </div>

                  {/* Loading Overlay */}
                  {navigatingIdx === idx && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="h-10 w-10 mx-auto rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-2" />
                        <p className="text-sm font-medium text-purple-700">
                          Loading Report...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
