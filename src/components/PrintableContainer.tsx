import React from "react";
import { usePrintLayout } from "../hooks/usePrintLayout";
import type { PrintLayoutConfig } from "../hooks/usePrintLayout";
// import { usePrintLayout, PrintLayoutConfig } from "@/hooks/usePrintLayout";
import { Download, Eye, Gauge, Bug, FileText, Maximize2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface PrintableContainerProps {
  children: React.ReactNode;
  config?: Partial<PrintLayoutConfig>;
  showControls?: boolean;
  className?: string;
  onPrint?: () => void;
}

export const PrintableContainer: React.FC<PrintableContainerProps> = ({
  children,
  config = {},
  showControls = true,
  className = "",
  onPrint,
}) => {
  const { isEditMode } = useSelector((state: RootState) => state.editMode);

  const defaultConfig: PrintLayoutConfig = {
    pageFormat: "A4-landscape",
    marginInches: 0.5,
    showPageBreaks: false,
    autoPageBreaks: false,
    matchPrintWidth: false,
    ...config,
  };

  const {
    containerRef,
    showPageBreaks,
    setShowPageBreaks,
    autoPageBreaks,
    setAutoPageBreaks,
    matchPrintWidth,
    setMatchPrintWidth,
    applyAutoLayout,
    simulatePrintLayout,
    debugMeasurements,
    handlePrint,
    getPageDimensions,
  } = usePrintLayout(defaultConfig);

  const { widthMm } = getPageDimensions();

  const onPrintClick = () => {
    onPrint?.();
    handlePrint();
  };

  return (
    <>
      {isEditMode && showPageBreaks && (
        <style>
          {`
            .printable-container {
              position: relative;
              ${
                matchPrintWidth
                  ? `max-width: ${widthMm}mm; margin: 0 auto;`
                  : ""
              }
            }
            
            .dynamic-page {
              position: absolute !important;
              pointer-events: none !important;
              z-index: 1000 !important;
              box-sizing: border-box !important;
            }
            
            .auto-page-break {
              page-break-before: always !important;
              break-before: page !important;
            }
            
            ${
              matchPrintWidth
                ? `
              .a4-width-mode .grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
              
              .a4-width-mode .lg\\:grid-cols-4,
              .a4-width-mode .lg\\:grid-cols-3 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            `
                : ""
            }
          `}
        </style>
      )}

      {isEditMode && showControls && (
        <div className="flex flex-wrap items-center gap-2 mb-6 print-hide px-6 py-2 ">
          <button
            onClick={() => setShowPageBreaks(!showPageBreaks)}
            className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 ${
              showPageBreaks
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPageBreaks ? "Hide" : "Show"} Page Breaks
          </button>

          {showPageBreaks && (
            <>
              <button
                onClick={() => setAutoPageBreaks(!autoPageBreaks)}
                className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  autoPageBreaks
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <Gauge className="w-4 h-4 mr-2" />
                {autoPageBreaks ? "Disable" : "Enable"} Auto Breaks
              </button>

              <button
                onClick={() => setMatchPrintWidth(!matchPrintWidth)}
                className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  matchPrintWidth
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                A4 Width
              </button>
            </>
          )}

          <div className="flex-grow" />

          <button
            onClick={applyAutoLayout}
            className="px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Test Auto Layout
          </button>

          <button
            onClick={simulatePrintLayout}
            className="px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Simulate Print
          </button>

          <button
            onClick={debugMeasurements}
            className="px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
          >
            <Bug className="w-4 h-4 mr-2" />
            Debug
          </button>

          <button
            onClick={onPrintClick}
            className="px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`printable-container ${
          matchPrintWidth ? "a4-width-mode" : ""
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};
