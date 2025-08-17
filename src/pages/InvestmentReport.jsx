import React from "react";
import AllocationPie from "../helpers/AllocationPie";
import ETFReturns from "../helpers/ETFReturns";
import MutualFundReturns from "../helpers/MutualFundReturns";
import ExportToPDF from "../helpers/ExportToPDF";
import { useLocation } from "react-router-dom";
import BondsReturns from "../helpers/BondsReturns";
import SGBReturns from "../helpers/SGBReturns";

export default function InvestmentReportPage() {
  const { state } = useLocation();
  const investmentData = state?.reportData;

  if (!investmentData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Data Available
          </h1>
          <p className="text-gray-600">
            Please generate an investment report first.
          </p>
        </div>
      </div>
    );
  }

  // helpers
  const sumVals = (obj) =>
    Object.values(obj || {}).reduce((s, v) => s + Number(v || 0), 0);
  const INR = (n) => `₹${Number(n || 0).toLocaleString()}`;

  // normalize (supports new + old payloads)
  const lumpsumAlloc =
    investmentData.lumpsum_allocations || investmentData.allocations || {};
  const monthlyAlloc = investmentData.monthly_allocations || {};

  const lumpsumMF =
    investmentData.lumpsum_mutual_funds || investmentData.mutual_funds || [];
  const monthlyMF = investmentData.monthly_mutual_funds || [];

  const lumpsumETFs = investmentData.lumpsum_etfs || investmentData.etfs || [];
  const monthlyETFs = investmentData.monthly_etfs || [];

  const lumpsumBonds =
    investmentData.lumpsum_bonds || investmentData.bonds || [];
  const monthlyBonds = investmentData.monthly_bonds || [];

  const lumpsumSGBs = investmentData.lumpsum_sgbs || [];
  const monthlySGBs = investmentData.monthly_sgbs || [];

  const totalLumpsum =
    investmentData.total_lumpsum != null
      ? investmentData.total_lumpsum
      : sumVals(lumpsumAlloc);
  const totalMonthly =
    investmentData.total_monthly != null
      ? investmentData.total_monthly
      : sumVals(monthlyAlloc);

  const reportId =
    investmentData.id || investmentData._id || investmentData.task_id;

  return (
    <div className="container mx-auto p-6 max-w-screen-2xl">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Investment Portfolio Report
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of your recommended investments
          </p>
        </div>
        <ExportToPDF targetId="report" filename="investment-portfolio-report" />
      </div>

      {/* Report Content */}
      <div id="report" className="bg-white">
        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <div className="text-xs font-semibold text-purple-700 uppercase">
              Total Lumpsum
            </div>
            <div className="text-xl font-extrabold text-purple-900 mt-1">
              {INR(totalLumpsum)}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <div className="text-xs font-semibold text-blue-700 uppercase">
              Total Monthly
            </div>
            <div className="text-xl font-extrabold text-blue-900 mt-1">
              {INR(totalMonthly)}
            </div>
          </div>
        </div>

        {/* Allocation Pies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-4 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Lumpsum Allocation
            </h2>
            <AllocationPie allocations={lumpsumAlloc} />
          </div>
          <div className="p-4 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Monthly Allocation
            </h2>
            <AllocationPie allocations={monthlyAlloc} />
          </div>
        </div>

        {/* Mutual Funds */}
        {(lumpsumMF.length > 0 || monthlyMF.length > 0) && (
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 px-6 py-3 rounded-2xl shadow bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 tracking-tight text-center">
              Mutual Funds
            </h2>
            {lumpsumMF.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow">
                  Lumpsum Picks
                </h3>{" "}
                <MutualFundReturns mutualFunds={lumpsumMF} />
              </div>
            )}
            {monthlyMF.length > 0 && (
              <div>
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 shadow">
                  Monthly SIP Picks
                </h3>
                <MutualFundReturns mutualFunds={monthlyMF} />
              </div>
            )}
          </div>
        )}

        {/* ETFs */}
        {(lumpsumETFs.length > 0 || monthlyETFs.length > 0) && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">ETFs</h2>
            {lumpsumETFs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow">
                  Lumpsum Picks
                </h3>{" "}
                <ETFReturns etfs={lumpsumETFs} />
              </div>
            )}
            {monthlyETFs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Monthly SIP Picks
                </h3>
                <ETFReturns etfs={monthlyETFs} />
              </div>
            )}
          </div>
        )}

        {/* Bonds */}
        {(lumpsumBonds.length > 0 || monthlyBonds.length > 0) && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Bonds</h2>
            {lumpsumBonds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow">
                  Lumpsum Picks
                </h3>{" "}
                <BondsReturns bonds={lumpsumBonds} />
              </div>
            )}
            {monthlyBonds.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Monthly SIP Picks
                </h3>
                <BondsReturns bonds={monthlyBonds} />
              </div>
            )}
          </div>
        )}

        {/* SGBs */}
        {(lumpsumSGBs.length > 0 || monthlySGBs.length > 0) && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Sovereign Gold Bonds (SGBs)</h2>
            {lumpsumSGBs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 shadow">
                  Lumpsum Picks
                </h3>
                <SGBReturns sgbs={lumpsumSGBs} />
              </div>
            )}
            {monthlySGBs.length > 0 && (
              <div>
                <h3 className="text-lg font-extrabold text-white mb-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 shadow">
                  Monthly SIP Picks
                </h3>
                <SGBReturns sgbs={monthlySGBs} />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-600">
            This report is generated based on current market data and
            recommendations. Please consult a financial advisor before making
            investment decisions.
          </p>
          {reportId && (
            <p className="text-xs text-gray-500 mt-2">Report ID: {reportId}</p>
          )}
        </div>
      </div>
    </div>
  );
}
