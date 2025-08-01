import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Get data from navigation state or localStorage
    const data =
      location.state?.recommendations ||
      JSON.parse(localStorage.getItem("investment_recommendations") || "null");

    const profile =
      location.state?.userProfile ||
      JSON.parse(localStorage.getItem("user_profile") || "null");

    console.log("📊 Recommendations data:", data);
    console.log("👤 User profile:", profile);

    if (data) {
      setRecommendations(data);
      setUserProfile(profile);
    } else {
      console.warn("⚠️ No recommendations data found");
      // Redirect back to calculate page
      navigate("/calculate");
    }
  }, [location.state, navigate]);

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Investment Recommendations", 10, 10);

    // Add user profile
    doc.setFontSize(14);
    doc.text("Your Profile:", 10, 20);
    if (userProfile) {
      doc.setFontSize(12);
      doc.text(
        `Monthly Investment: ₹${userProfile.monthlyInvestment?.toLocaleString()}`,
        10,
        30
      );
      doc.text(`Time Horizon: ${userProfile.yearsToAchieve} years`, 10, 40);
      doc.text(`Age: ${userProfile.age} years`, 10, 50);
      doc.text(
        `Objective: ${
          userProfile.objective?.currentKey ||
          userProfile.objective ||
          "Not specified"
        }`,
        10,
        60
      );
      doc.text(
        `Risk Appetite: ${
          userProfile.risk?.currentKey || userProfile.risk || "Not specified"
        }`,
        10,
        70
      );
    }

    // Add recommendations
    doc.setFontSize(14);
    doc.text("Recommendations:", 10, 90);
    doc.setFontSize(12);
    if (recommendations) {
      doc.text(`Status: ${recommendations.status}`, 10, 100);
      if (recommendations.task_id) {
        doc.text(`Task ID: ${recommendations.task_id}`, 10, 110);
      }
      doc.text("Agent Recommendations:", 10, 120);
      doc.text(
        recommendations.result ||
          recommendations.agent_response ||
          "No recommendations available",
        10,
        130,
        { maxWidth: 190 }
      );
    }

    // Save the PDF
    doc.save("Investment_Recommendations.pdf");
  };

  if (!recommendations) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading recommendations...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-10">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-6">
          Investment Recommendations
        </h1>

        {/* User Profile Section */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Your Profile
          </h2>
          {userProfile && (
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Monthly Investment:</span> ₹
                {userProfile.monthlyInvestment?.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Time Horizon:</span>{" "}
                {userProfile.yearsToAchieve} years
              </p>
              <p>
                <span className="font-semibold">Age:</span> {userProfile.age}{" "}
                years
              </p>
              <p>
                <span className="font-semibold">Objective:</span>{" "}
                {userProfile.objective?.currentKey ||
                  userProfile.objective ||
                  "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Risk Appetite:</span>{" "}
                {userProfile.risk?.currentKey ||
                  userProfile.risk ||
                  "Not specified"}
              </p>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Investment Recommendations
          </h2>

          {/* Status */}
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Status:</span>{" "}
            {recommendations.status}
          </p>

          {/* Task ID (if available) */}
          {recommendations.task_id && (
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Task ID:</span>{" "}
              {recommendations.task_id}
            </p>
          )}

          {/* Agent Response */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Agent Recommendations:
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-200 text-sm text-gray-800 font-mono whitespace-pre-wrap">
              {recommendations.result ||
                recommendations.agent_response ||
                "No recommendations available"}
            </div>
          </div>
        </div>

        {/* Navigation and PDF Download */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate("/calculate")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Back to Calculator
          </button>
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
