// src/components/StrategyComparisonChart.jsx
import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

function apyToMonthly(rAnnual) {
  return Math.pow(1 + rAnnual, 1 / 12) - 1;
}

// End-of-month SIP/RD future value over N months
function fvSIP(monthly, rAnnual, years) {
  const r = apyToMonthly(rAnnual);
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

// Parse things like "10-12% p.a.", "12% p.a.", "11%"
function parseExpectedReturn(str, fallback) {
  if (!str || typeof str !== "string") return fallback;
  const nums = (str.match(/(\d+(\.\d+)?)/g) || []).map(Number);
  if (!nums.length) return fallback;
  if (nums.length >= 2) return (nums[0] + nums[1]) / 2 / 100;
  return nums[0] / 100;
}

// Sensible defaults by risk if expectedReturn isn’t numeric
function defaultByRisk(risk) {
  if (risk === "Low") return 0.08; // 8% p.a.
  if (risk === "Moderate") return 0.11; // 11% p.a.
  return 0.14; // 14% p.a. (High)
}

export default function StrategyComparisonChart({
  monthly, // number (₹ per month)
  strategyRateAnnual, // number (0.12) OR undefined
  riskLevel = "Moderate", // 'Low' | 'Moderate' | 'High'
  fdAnnual = 0.07, // default 7% p.a. (RD-like)
  licAnnual = 0.055, // default 5.5% p.a. (traditional endowment-like)
  yearsInitial = 10,
}) {
  const [years, setYears] = useState(yearsInitial);

  const { labels, strategySeries, fdSeries, licSeries } = useMemo(() => {
    const rStrat =
      typeof strategyRateAnnual === "number"
        ? strategyRateAnnual
        : defaultByRisk(riskLevel);

    const labels = Array.from({ length: years }, (_, i) => `${i + 1}y`);
    const strategySeries = [];
    const fdSeries = [];
    const licSeries = [];

    for (let y = 1; y <= years; y++) {
      strategySeries.push(Math.round(fvSIP(monthly, rStrat, y)));
      fdSeries.push(Math.round(fvSIP(monthly, fdAnnual, y)));
      licSeries.push(Math.round(fvSIP(monthly, licAnnual, y)));
    }
    return { labels, strategySeries, fdSeries, licSeries };
  }, [monthly, strategyRateAnnual, riskLevel, fdAnnual, licAnnual, years]);

  const data = {
    labels,
    datasets: [
      {
        label: "Your Strategy",
        data: strategySeries,
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "FD (monthly RD)",
        data: fdSeries,
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        borderDash: [6, 4],
        fill: false,
      },
      {
        label: "LIC (traditional)",
        data: licSeries,
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        borderDash: [2, 4],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      title: {
        display: true,
        text: "Projected Wealth from ₹/month (SIP vs FD vs LIC)",
        font: { size: 16, family: "'Inter', sans-serif" },
        color: "#374151",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y || 0;
            return `${ctx.dataset.label}: ₹${v.toLocaleString("en-IN")}`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
          font: { size: 11, family: "'Inter', sans-serif" },
        },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
      x: {
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 border border-gray-200 rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="text-sm text-gray-600">
          Monthly investment:{" "}
          <b>₹{Number(monthly || 0).toLocaleString("en-IN")}</b>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Years:</label>
          <input
            type="range"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value, 10))}
            className="w-full sm:w-40"
          />
          <span className="text-sm font-semibold w-8 text-right">{years}</span>
        </div>
      </div>
      <div className="h-80 sm:h-96">
        <Line data={data} options={options} />
      </div>
      <p className="text-[11px] text-gray-500 mt-3 text-center">
        Assumes end-of-month contributions; FD/LIC lines modeled as RD/recurring
        style for apples-to-apples comparison. Rates are placeholders—configure
        per product.
      </p>
    </div>
  );
}
