import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ExportToPDF = ({ targetId, filename = "investment-report" }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        setIsGenerating(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit full width
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Scale to fit full width of PDF
      const widthRatio = pdfWidth / (imgWidth * 0.264583); // Convert px to mm (96 DPI)
      const scaledWidth = pdfWidth;
      const scaledHeight = imgHeight * 0.264583 * widthRatio;

      if (scaledHeight > pdfHeight) {
        // Multi-page: split content across pages
        const totalPages = Math.ceil(scaledHeight / pdfHeight);

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const yOffset = -(page * pdfHeight);

          pdf.addImage(
            imgData,
            "PNG",
            0, // Start at left edge (x = 0)
            yOffset, // Vertical offset for current page
            scaledWidth, // Full width
            scaledHeight // Scaled height
          );
        }
      } else {
        // Single page: fit to full width
        pdf.addImage(
          imgData,
          "PNG",
          0, // Start at left edge (x = 0)
          0, // Start at top (y = 0)
          scaledWidth, // Full width
          scaledHeight // Scaled height
        );
      }

      const timestamp = new Date().toISOString().split("T")[0];
      pdf.save(`${filename}-${timestamp}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white
          ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }
          transition-colors duration-200 shadow-lg hover:shadow-xl
        `}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download PDF Report</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ExportToPDF;
