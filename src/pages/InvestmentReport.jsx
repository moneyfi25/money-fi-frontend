import React from "react";
import AllocationPie from "../helpers/AllocationPie";
import ETFReturns from "../helpers/ETFReturns";
import MutualFundReturns from "../helpers/MutualFundReturns";
import ExportToPDF from "../helpers/ExportToPDF";
import { useLocation } from "react-router-dom";
import BondsReturns from "../helpers/BondsReturns";

export default function InvestmentReportPage() {
  const location = useLocation();
  const investmentData = location.state?.reportData;

  console.log(investmentData);

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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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

      {/* Report Content - This div will be exported to PDF */}
      <div id="report" className="bg-white">
        {/* Report Header for PDF */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Investment Portfolio Report
          </h1>
          <p className="text-gray-600">
            Generated on:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">
                ₹
                {Object.values(investmentData.allocations)
                  .reduce((sum, val) => sum + val, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Monthly Investment</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">
                {Object.keys(investmentData.allocations).length}
              </p>
              <p className="text-sm text-gray-600">Asset Classes</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">
                {investmentData.mutual_funds.length +
                  investmentData.etfs.length +
                  investmentData.bonds.length}
              </p>
              <p className="text-sm text-gray-600">Total Securities</p>
            </div>
          </div>
        </div>

        {/* Allocation Pie Chart */}
        <div className="mb-8">
          <AllocationPie allocations={investmentData.allocations} />
        </div>

        {/* Mutual Funds Section */}
        {investmentData.mutual_funds &&
          investmentData.mutual_funds.length > 0 && (
            <div className="mb-8">
              <MutualFundReturns mutualFunds={investmentData.mutual_funds} />
            </div>
          )}

        {/* ETFs Section */}
        {investmentData.etfs && investmentData.etfs.length > 0 && (
          <div className="mb-8">
            <ETFReturns etfs={investmentData.etfs} />
          </div>
        )}

        {/* Bonds Section */}
        {investmentData.bonds && investmentData.bonds.length > 0 && (
          <div className="mb-8">
            <BondsReturns bonds={investmentData.bonds} />
          </div>
        )}

        {/* Report Footer */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-600">
            This report is generated based on current market data and
            recommendations. Please consult with a financial advisor before
            making investment decisions.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Report ID: {investmentData.task_id}
          </p>
        </div>
      </div>
    </div>
  );
}
