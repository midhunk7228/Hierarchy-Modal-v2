import { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

const BarGraph = () => {
  const salesChartRef = useRef<HTMLCanvasElement>(null);
  const guestChartRef = useRef<HTMLCanvasElement>(null);
  const salesChartInstance = useRef<Chart | null>(null);
  const guestChartInstance = useRef<Chart | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register all Chart.js components
    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      LineController,
      BarController,
      Title,
      Tooltip,
      Legend,
      Filler
    );

    // Sales Chart with data labels
    if (salesChartRef.current) {
      const ctx = salesChartRef.current.getContext("2d");
      if (!ctx) return;

      // Destroy existing chart if it exists
      if (salesChartInstance.current) {
        salesChartInstance.current.destroy();
        salesChartInstance.current = null;
      }

      salesChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
          ],
          datasets: [
            {
              type: "bar",
              label: "Sales LY",
              data: [
                114457, 119376, 61567, 105565, 128115, 131910, 120780, 107802,
              ],
              backgroundColor: "#a6a6a6",
              barPercentage: 1.0,
              categoryPercentage: 0.75,
              order: 3,
            },
            {
              type: "bar",
              label: "Sales",
              data: [88964, 94289, 40670, 94645, 108264, 105190, 89983, 81978],
              backgroundColor: "#007acb",
              barPercentage: 1.0,
              categoryPercentage: 0.75,
              order: 4,
            },
            {
              type: "line",
              label: "APG LY",
              data: [16.7, 15.8, 16.6, 15.7, 18.1, 15, 14.9, 15.5],
              borderColor: "#e0bfc6",
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [4, 4],
              pointBackgroundColor: "#e0bfc6",
              pointBorderColor: "#e0bfc6",
              pointRadius: 0,
              pointHoverRadius: 6,
              stepped: true,
              tension: 0,
              yAxisID: "y1",
              order: 1,
            },
            {
              type: "line",
              label: "APG",
              data: [16.4, 17.3, 17.3, 16.9, 15.3, 14.2, 14.3, 14.3],
              borderColor: "#7b60c7",
              backgroundColor: "transparent",
              borderWidth: 2.5,
              pointBackgroundColor: "#7b60c7",
              pointBorderColor: "#7b60c7",
              pointRadius: 0,
              pointHoverRadius: 6,
              stepped: true,
              tension: 0,
              yAxisID: "y1",
              order: 2,
            },
          ],
        },
        plugins: [
          {
            id: "customDataLabels",
            afterDatasetsDraw(chart: Chart) {
              const { ctx } = chart;
              chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                if (!meta.hidden) {
                  meta.data.forEach((element, index) => {
                    const value = dataset.data[index];
                    if (value === 0 || value === null) return;

                    ctx.save();
                    ctx.font = "bold 11px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    let label, x, y, bgColor, borderColor, padding;

                    if (i <= 1) {
                      // Bar labels
                      label = "KD " + (value as number).toLocaleString("en-US");
                      x = element.x;
                      y = element.y - 18;
                      bgColor = i === 0 ? "#a6a6a6" : "#007acb";
                      borderColor = "transparent";
                      padding = { top: 6, bottom: 6, left: 10, right: 10 };
                      ctx.fillStyle = "white";
                    } else {
                      // Line labels
                      label = "KD " + (value as number).toFixed(1);
                      x = element.x;
                      y = element.y - 25;
                      bgColor = i === 2 ? "#7b60c7" : "#e0bfc6";
                      borderColor = i === 2 ? "#7b60c7" : "#e0bfc6";
                      padding = { top: 5, bottom: 5, left: 10, right: 10 };
                      ctx.fillStyle = "white";
                    }

                    // Measure text
                    const textWidth = ctx.measureText(label).width;
                    const boxWidth = textWidth + padding.left + padding.right;
                    const boxHeight = 20;

                    // Draw background
                    ctx.fillStyle = bgColor;
                    const radius = 4;
                    const boxX = x - boxWidth / 2;
                    const boxY = y - boxHeight / 2;

                    ctx.beginPath();
                    ctx.moveTo(boxX + radius, boxY);
                    ctx.lineTo(boxX + boxWidth - radius, boxY);
                    ctx.quadraticCurveTo(
                      boxX + boxWidth,
                      boxY,
                      boxX + boxWidth,
                      boxY + radius
                    );
                    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
                    ctx.quadraticCurveTo(
                      boxX + boxWidth,
                      boxY + boxHeight,
                      boxX + boxWidth - radius,
                      boxY + boxHeight
                    );
                    ctx.lineTo(boxX + radius, boxY + boxHeight);
                    ctx.quadraticCurveTo(
                      boxX,
                      boxY + boxHeight,
                      boxX,
                      boxY + boxHeight - radius
                    );
                    ctx.lineTo(boxX, boxY + radius);
                    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
                    ctx.closePath();
                    ctx.fill();

                    // Draw border for line labels
                    if (i > 1 && borderColor !== "transparent") {
                      ctx.strokeStyle = borderColor;
                      ctx.lineWidth = 1;
                      ctx.stroke();
                    }

                    // Draw text
                    ctx.fillStyle = "white";
                    ctx.fillText(label, x, y);

                    ctx.restore();
                  });
                }
              });
            },
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#999",
                font: {
                  size: 11,
                },
                padding: 8,
              },
            },
            y: {
              position: "left",
              grid: {
                color: "#e5e5e5",

                lineWidth: 1,
              },
              border: {
                display: false,
              },
              ticks: {
                color: "#999",
                font: {
                  size: 10,
                },
                callback: function (value: string | number) {
                  return "KD " + Number(value) / 1000 + ",000";
                },
                stepSize: 20000,
                padding: 8,
              },
              min: 0,
              max: 140000,
            },
            y1: {
              position: "right",
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: "#999",
                font: {
                  size: 10,
                },
                callback: function (value: string | number) {
                  return "KD " + value;
                },
                stepSize: 1,
                padding: 8,
              },
              min: 14,
              max: 19,
            },
          },
        },
      });
    }

    // Guest Chart
    if (guestChartRef.current) {
      const ctx = guestChartRef.current.getContext("2d");
      if (!ctx) return;

      if (guestChartInstance.current) {
        guestChartInstance.current.destroy();
      }

      guestChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
          ],
          datasets: [
            {
              label: "Avg Daily Guest LY",
              data: [225, 269, 120, 209, 229, 294, 261, 224],
              backgroundColor: "#a6a6a6",
              barPercentage: 1.0,
              categoryPercentage: 0.75,
            },
            {
              label: "Avg Daily Guest",
              data: [172, 195, 76, 201, 228, 246, 203, 185],
              backgroundColor: "#007acb",
              barPercentage: 1.0,
              categoryPercentage: 0.75,
            },
          ],
        },
        plugins: [
          {
            id: "guestDataLabels",
            afterDatasetsDraw(chart: Chart) {
              const { ctx } = chart;
              chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                if (!meta.hidden) {
                  meta.data.forEach((element, index) => {
                    const value = dataset.data[index];
                    if (value === 0 || value === null) return;

                    ctx.save();
                    ctx.font = "bold 12px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const label = value.toString();
                    const x = element.x;
                    const y = element.y - 18;
                    const bgColor = i === 0 ? "#a6a6a6" : "#007acb";
                    const padding = { top: 5, bottom: 5, left: 10, right: 10 };

                    // Measure text
                    const textWidth = ctx.measureText(label).width;
                    const boxWidth = textWidth + padding.left + padding.right;
                    const boxHeight = 22;

                    // Draw background
                    ctx.fillStyle = bgColor;
                    const radius = 4;
                    const boxX = x - boxWidth / 2;
                    const boxY = y - boxHeight / 2;

                    ctx.beginPath();
                    ctx.moveTo(boxX + radius, boxY);
                    ctx.lineTo(boxX + boxWidth - radius, boxY);
                    ctx.quadraticCurveTo(
                      boxX + boxWidth,
                      boxY,
                      boxX + boxWidth,
                      boxY + radius
                    );
                    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
                    ctx.quadraticCurveTo(
                      boxX + boxWidth,
                      boxY + boxHeight,
                      boxX + boxWidth - radius,
                      boxY + boxHeight
                    );
                    ctx.lineTo(boxX + radius, boxY + boxHeight);
                    ctx.quadraticCurveTo(
                      boxX,
                      boxY + boxHeight,
                      boxX,
                      boxY + boxHeight - radius
                    );
                    ctx.lineTo(boxX, boxY + radius);
                    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
                    ctx.closePath();
                    ctx.fill();

                    // Draw text
                    ctx.fillStyle = "white";
                    ctx.fillText(label, x, y);

                    ctx.restore();
                  });
                }
              });
            },
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              align: "start",
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 15,
                font: {
                  size: 11,
                },
                color: "#666",
                usePointStyle: false,
              },
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#999",
                font: {
                  size: 11,
                },
                padding: 5,
              },
            },
            // y: {
            //   display: false,
            //   min: 0,
            //   max: 350,
            // position: "left",
            // padding: 8,
            // },
            y: {
              display: false,
              //   min: 0,
              //   max: 350,
              position: "left",
              grid: {
                color: "#e5e5e5",

                lineWidth: 1,
              },
              border: {
                display: false,
              },
              ticks: {
                color: "#999",
                font: {
                  size: 10,
                },
                callback: function (value: string | number) {
                  return "KD " + Number(value) / 1000 + ",000";
                },
                stepSize: 20000,
                padding: 8,
              },
              min: 0,
              max: 400,
            },
          },
        },
      });
    }

    return () => {
      if (salesChartInstance.current) {
        salesChartInstance.current.destroy();
      }
      if (guestChartInstance.current) {
        guestChartInstance.current.destroy();
      }
    };
  }, []);

  const exportToImage = () => {
    try {
      const element = dashboardRef.current;
      const salesCanvas = salesChartRef.current;
      const guestCanvas = guestChartRef.current;

      if (!element || !salesCanvas || !guestCanvas) {
        alert("Please wait for charts to load");
        return;
      }

      // Create export canvas
      const exportCanvas = document.createElement("canvas");
      const ctx = exportCanvas.getContext("2d");

      if (!ctx) {
        alert("Failed to create canvas context for export.");
        return;
      }

      // Set high resolution
      const width = 1300;
      const height = 800;
      exportCanvas.width = width * 2;
      exportCanvas.height = height * 2;
      ctx.scale(2, 2);

      // Background
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, width, height);

      // Card background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, 20, width - 40, height - 40);
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Header - Giulia
      ctx.fillStyle = "#333";
      ctx.font = "italic 42px Georgia";
      ctx.textAlign = "left";
      ctx.fillText("Giulia 🍁", 45, 75);

      // Title
      ctx.fillStyle = "#333";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SALES ANALYSIS", width / 2, 60);
      ctx.font = "italic 11px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText(
        "Sales, Avg Per Guest (APG) & Avg Daily Guests",
        width / 2,
        78
      );

      // NEJOUD
      ctx.fillStyle = "#e91e63";
      ctx.font = "300 52px Arial";
      ctx.textAlign = "right";
      ctx.fillText("NEJOUD", width - 45, 75);

      // Legend
      ctx.textAlign = "left";
      ctx.font = "12px Arial";
      const legends = [
        { x: 65, color: "#808080", text: "Sales LY" },
        { x: 165, color: "#2196F3", text: "Sales" },
        { x: 245, color: "#e0bfc6", text: "APG LY" },
        { x: 345, color: "#7b60c7", text: "APG" },
      ];

      legends.forEach((leg) => {
        ctx.fillStyle = leg.color;
        ctx.beginPath();
        ctx.arc(leg.x, 110, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#666";
        ctx.fillText(leg.text, leg.x + 10, 114);
      });

      // Draw sales chart
      ctx.drawImage(salesCanvas, 45, 130, 1210, 380);

      // Guest chart area
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(45, 530, 1210, 180);
      ctx.strokeStyle = "#e0e0e0";
      ctx.strokeRect(45, 530, 1210, 180);

      // Draw guest chart
      ctx.drawImage(guestCanvas, 60, 545, 1180, 150);

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "sales-analysis-nejoud.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Export error:", error);
      if (error instanceof Error) {
        alert("Export failed: " + error.message);
      } else {
        alert("An unknown export error occurred.");
      }
    }
  };

  return (
    <div className=" bg-white">
      <button
        onClick={exportToImage}
        className="fixed top-8 right-8 px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 z-50 cursor-pointer"
      >
        📸 Export as Image
      </button>

      <div ref={dashboardRef} className="max-w-7xl mx-auto bg-white  p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex items-center gap-1">
            <span
              className="text-5xl italic font-light text-gray-800"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              Giulia
            </span>
            <span className="text-3xl text-red-500">🍁</span>
          </div>

          {/* Title Section */}
          <div className="flex-1 text-center">
            <div className="text-base font-bold text-gray-800 tracking-widest mb-1">
              SALES ANALYSIS
            </div>
            <div className="text-xs text-gray-600 italic">
              Sales, Avg Per Guest (APG) & Avg Daily Guests
            </div>
          </div>

          {/* Brand Name */}
          <div className="text-6xl text-pink-600 font-light tracking-wider">
            NEJOUD
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-5 pl-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#a6a6a6]"></div>
            <span className="text-xs text-gray-600">Sales LY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#007acb]"></div>
            <span className="text-xs text-gray-600">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#e0bfc6]"></div>
            <span className="text-xs text-gray-600">APG LY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#7b60c7]"></div>
            <span className="text-xs text-gray-600">APG</span>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="relative h-96 mb-5">
          <canvas ref={salesChartRef}></canvas>
        </div>

        {/* Guest Chart */}
        <div className="relative h-56 border px-10">
          <canvas ref={guestChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
