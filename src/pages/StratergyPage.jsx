import React, { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getReportByType } from "../services/middleware";
import StrategyComparisonChart from "../components/StrategyComparisonChart";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title
);
ChartJS.register(ArcElement, Tooltip, Legend);

/* ---------- helpers ---------- */

const PALETTE = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#A78BFA",
  "#14B8A6",
  "#EAB308",
  "#FB7185",
];

const formatINR = (n) => `₹${Number(n ?? 0).toLocaleString()}`;

const sumVals = (obj = {}) =>
  Object.values(obj).reduce((s, v) => s + Number(v || 0), 0);

const buildPieDataFromAmounts = (amounts = {}) => {
  const labels = Object.keys(amounts);
  const data = labels.map((k) => Number(amounts[k] || 0));
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1,
      },
    ],
  };
};

const pieOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: { size: 11, family: "'Inter', sans-serif" },
        color: "#374151",
        padding: 8,
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const label = ctx.label || "";
          const v = ctx.raw ?? 0;
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = total ? ((v / total) * 100).toFixed(1) : "0.0";
          return `${label}: ${formatINR(v)} (${pct}%)`;
        },
      },
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

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
    const suffix = idx + 1; // Use the index of the strategy as the suffix
    const type = baseType * 10 + suffix; // Combine baseType and suffix to form the type

    const computedAllocation =
      strategy.computedAllocation ||
      strategy.templateAllocation ||
      strategy.allocation ||
      {};

    try {
      console.log(type);
      const resp = await getReportByType(type, computedAllocation);
      const report = resp?.report ?? resp?.data?.report ?? resp;
      navigate("/investment-report", { state: { reportData: report } });
    } catch {
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
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 py-16 px-4">
        <div className="absolute inset-0 bg-black/10" />
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

      {/* Comparison hero (uses first strategy to seed chart) */}
      <div className="py-8 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          {(() => {
            const first = strategies[0] || {};
            const alloc =
              first.computedAllocation ||
              first.templateAllocation ||
              first.allocation ||
              {};

            const lumpsumAmounts = alloc.lumpsumAmounts || alloc.lumpsum || {};
            const monthlyAmounts = alloc.monthlyAmounts || alloc.monthly || {};

            const monthly =
              Number(alloc.totalMonthly) || sumVals(monthlyAmounts) || 10000;

            const rate =
              typeof first.expectedReturn === "string"
                ? (parseFloat(
                    (first.expectedReturn.match(/(\d+(\.\d+)?)/) || [])[0]
                  ) || NaN) / 100
                : typeof first.expectedReturn === "number"
                ? first.expectedReturn
                : undefined;

            return (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                <StrategyComparisonChart
                  monthly={monthly}
                  strategyRateAnnual={rate}
                  riskLevel={first.riskLevel || "Moderate"}
                  fdAnnual={0.07}
                  licAnnual={0.055}
                  yearsInitial={10}
                />
              </div>
            );
          })()}
        </div>
      </div>

      {/* Strategies grid */}
      <div className="py-12 px-4">
        <div className="max-w-screen-2xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
            {strategies.map((strategy, idx) => {
              const alloc =
                strategy.computedAllocation ||
                strategy.templateAllocation ||
                strategy.allocation ||
                {};

              const lumpsumAmounts =
                alloc.lumpsumAmounts || alloc.lumpsum || {};
              const monthlyAmounts =
                alloc.monthlyAmounts || alloc.monthly || {};
              const totalLump =
                Number(alloc.totalLumpsum) || sumVals(lumpsumAmounts);
              const totalMon =
                Number(alloc.totalMonthly) || sumVals(monthlyAmounts);

              const tmpl = strategy.templateAllocation || {};
              const lumpPerc =
                tmpl.lumpsum && typeof tmpl.lumpsum === "object"
                  ? Object.entries(tmpl.lumpsum)
                      .filter(([k]) => k.endsWith("%"))
                      .map(([k, v]) => [k.replace("%", ""), v])
                  : [];
              const monPerc =
                tmpl.monthly && typeof tmpl.monthly === "object"
                  ? Object.entries(tmpl.monthly)
                      .filter(([k]) => k.endsWith("%"))
                      .map(([k, v]) => [k.replace("%", ""), v])
                  : [];

              const m = strategy?.maturityAmount || {};
              const lumpsumFV = m.lumpsum_FV ?? m.lumpsumFV;
              const monthlyFV = m.monthly_FV ?? m.monthlyFV;
              const totalFV =
                m.total_FV ?? m.totalFV ?? strategy.maturityAmount;

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
                  {/* subtle blobs */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  {/* badges */}
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

                  {/* info */}
                  <div className="relative text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {strategy.name}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>

                  {/* totals row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-100 via-purple-50 to-blue-100 rounded-2xl shadow-sm border border-purple-200">
                      <div className="text-center">
                        <span className="block text-xs text-purple-700 font-semibold uppercase tracking-wide">
                          Total Lumpsum
                        </span>
                        <span className="block text-lg font-extrabold text-purple-900 mt-1">
                          {formatINR(totalLump)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-100 via-blue-50 to-emerald-100 rounded-2xl shadow-sm border border-blue-200">
                      <div className="text-center">
                        <span className="block text-xs text-blue-700 font-semibold uppercase tracking-wide">
                          Total Monthly
                        </span>
                        <span className="block text-lg font-extrabold text-blue-900 mt-1">
                          {formatINR(totalMon)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* two pies: lumpsum & monthly */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Lumpsum */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">
                          Lumpsum Allocation
                        </h3>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-100 border border-purple-200 rounded-full px-2.5 py-0.5">
                          {formatINR(totalLump)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-48 sm:h-56">
                          <Pie
                            data={buildPieDataFromAmounts(lumpsumAmounts)}
                            options={pieOptions}
                          />
                        </div>

                        <div className="space-y-2">
                          {Object.entries(lumpsumAmounts).map(
                            ([asset, amount]) => (
                              <div
                                key={`lump-${asset}`}
                                className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-2"
                              >
                                <span className="text-xs text-gray-600">
                                  {asset}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatINR(amount)}
                                </span>
                              </div>
                            )
                          )}
                          {!Object.keys(lumpsumAmounts).length && (
                            <div className="text-xs text-gray-500">
                              No lumpsum allocation provided.
                            </div>
                          )}
                        </div>
                      </div>

                      {!!lumpPerc.length && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {lumpPerc.map(([k, v]) => (
                            <span
                              key={`lp-${k}`}
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/80 text-gray-700 border border-gray-200 shadow-sm"
                            >
                              {k}: {v}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Monthly */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">
                          Monthly Allocation
                        </h3>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-2.5 py-0.5">
                          {formatINR(totalMon)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-48 sm:h-56">
                          <Pie
                            data={buildPieDataFromAmounts(monthlyAmounts)}
                            options={pieOptions}
                          />
                        </div>

                        <div className="space-y-2">
                          {Object.entries(monthlyAmounts).map(
                            ([asset, amount]) => (
                              <div
                                key={`mon-${asset}`}
                                className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-2"
                              >
                                <span className="text-xs text-gray-600">
                                  {asset}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatINR(amount)}
                                </span>
                              </div>
                            )
                          )}
                          {!Object.keys(monthlyAmounts).length && (
                            <div className="text-xs text-gray-500">
                              No monthly allocation provided.
                            </div>
                          )}
                        </div>
                      </div>

                      {!!monPerc.length && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {monPerc.map(([k, v]) => (
                            <span
                              key={`mp-${k}`}
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/80 text-gray-700 border border-gray-200 shadow-sm"
                            >
                              {k}: {v}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* maturity tiles */}
                  <div className="relative pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white/80 rounded-xl border border-gray-100 p-3 text-center">
                        <span className="block text-xs text-gray-500 font-medium mb-1">
                          Lumpsum FV
                        </span>
                        <span className="block text-base font-extrabold text-blue-700">
                          {formatINR(lumpsumFV)}
                        </span>
                      </div>
                      <div className="bg-white/80 rounded-xl border border-gray-100 p-3 text-center">
                        <span className="block text-xs text-gray-500 font-medium mb-1">
                          Monthly FV
                        </span>
                        <span className="block text-base font-extrabold text-blue-700">
                          {formatINR(monthlyFV)}
                        </span>
                      </div>
                      <div className="bg-white/80 rounded-xl border border-gray-100 p-3 text-center">
                        <span className="block text-xs text-gray-500 font-medium mb-1">
                          Total FV
                        </span>
                        <span className="block text-base font-extrabold text-blue-700">
                          {formatINR(totalFV)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* loading overlay */}
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
