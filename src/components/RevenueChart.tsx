// import { useEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import { Flag } from "lucide-react";

// interface ChartData {
//   category: string;
//   actual: number;
//   previous: number;
//   target: number;
//   flagged?: boolean;
// }

// interface RevenueChartProps {
//   data: ChartData[];
// }

// export const RevenueChart = ({ data }: RevenueChartProps) => {
//   const chartRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     const root = am5.Root.new(chartRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);

//     const chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: false,
//         panY: false,
//         wheelX: "none",
//         wheelY: "none",
//         paddingLeft: 10,
//         paddingRight: 20,
//         paddingTop: 0,
//         paddingBottom: 0,
//       })
//     );

//     // Create axes
//     const xAxis = chart.xAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: "category",
//         renderer: am5xy.AxisRendererX.new(root, {
//           minGridDistance: 20,
//           cellStartLocation: 0.15,
//           cellEndLocation: 0.85,
//         }),
//       })
//     );

//     const xRenderer = xAxis.get("renderer");
//     xRenderer.labels.template.setAll({
//       fontSize: 12,
//       fill: am5.color("#6B7280"),
//     });
//     xRenderer.grid.template.setAll({
//       strokeOpacity: 0,
//     });

//     xAxis.data.setAll(data);

//     const yAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         renderer: am5xy.AxisRendererY.new(root, {
//           strokeOpacity: 0,
//         }),
//       })
//     );

//     const yRenderer = yAxis.get("renderer");
//     yRenderer.labels.template.setAll({
//       fontSize: 11,
//       fill: am5.color("#9CA3AF"),
//     });
//     yRenderer.grid.template.setAll({
//       stroke: am5.color("#E5E7EB"),
//       strokeOpacity: 0.5,
//       strokeDasharray: [3, 3],
//     });

//     // Create series - layered not clustered
//     function makeSeries(
//       name: string,
//       fieldName: string,
//       color: string,
//       isOutline = false,
//       width = 80
//     ) {
//       const series = chart.series.push(
//         am5xy.ColumnSeries.new(root, {
//           name: name,
//           xAxis: xAxis,
//           yAxis: yAxis,
//           valueYField: fieldName,
//           categoryXField: "category",
//           clustered: false,
//           fill: am5.color(color),
//           stroke: am5.color(color),
//         })
//       );

//       series.columns.template.setAll({
//         width: am5.percent(width),
//         tooltipY: 0,
//         cornerRadiusTL: 2,
//         cornerRadiusTR: 2,
//         strokeWidth: isOutline ? 1.5 : 0,
//         fillOpacity: isOutline ? 0 : 1,
//       });

//       series.data.setAll(data);
//       series.appear();

//       return series;
//     }

//     // Layer from back to front: Previous Year (widest), Actual (medium), Target (same as actual but outline)
//     makeSeries("Prv. Year", "previous", "#D1D5DB", false, 85);
//     makeSeries("Actual", "actual", "#7B93DB", false, 70);
//     makeSeries("Target", "target", "#4F6FD8", true, 70);

//     // Add custom legend
//     const legendContainer = chart.children.push(
//       am5.Container.new(root, {
//         width: am5.percent(100),
//         layout: root.horizontalLayout,
//         x: am5.percent(50),
//         centerX: am5.percent(50),
//         paddingTop: 20,
//         paddingBottom: 5,
//       })
//     );

//     const createLegendItem = (
//       name: string,
//       color: string,
//       isOutline = false
//     ) => {
//       const container = legendContainer.children.push(
//         am5.Container.new(root, {
//           layout: root.horizontalLayout,
//           marginRight: 20,
//         })
//       );

//       const indicator = container.children.push(
//         am5.Rectangle.new(root, {
//           width: 14,
//           height: 14,
//           fill: isOutline ? am5.color("rgba(0,0,0,0)") : am5.color(color),
//           stroke: am5.color(color),
//           strokeWidth: isOutline ? 1.5 : 0,
//         })
//       );

//       const label = container.children.push(
//         am5.Label.new(root, {
//           text: name,
//           fontSize: 12,
//           fill: am5.color("#6B7280"),
//           marginLeft: 6,
//         })
//       );
//     };

//     createLegendItem("Actual", "#7B93DB", false);
//     createLegendItem("Prv. Year", "#D1D5DB", false);
//     createLegendItem("Target", "#4F6FD8", true);

//     chart.appear(1000, 100);

//     return () => {
//       root.dispose();
//     };
//   }, [data]);

//   return (
//     <div className="relative">
//       <div ref={chartRef} className="w-full h-[380px]" />
//       {/* Flags */}
//       <div className="absolute" style={{ bottom: "52px", left: "50px" }}>
//         <Flag className="w-3 h-3 text-foreground" fill="currentColor" />
//       </div>
//       <div className="absolute" style={{ bottom: "52px", left: "340px" }}>
//         <Flag className="w-3 h-3 text-foreground" fill="currentColor" />
//       </div>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {
  Target,
} from "lucide-react";

interface ChartData {
  category: string;
  actual: number;
  previous: number;
  target: number;
  flagged?: boolean;
}

interface RevenueChartProps {
  data: ChartData[];
  location: string;
  value: string;
  change: string;
}

export const RevenueChart = ({
  data,
  location,
  value,
  change,
}: RevenueChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = useState<{
    location: string;
    value: string;
    change: string;
    x: number;
  } | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 20,
        paddingTop: 80,
        paddingBottom: 40,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 20,
          cellStartLocation: 0.15,
          cellEndLocation: 0.85,
        }),
      })
    );

    const xRenderer = xAxis.get("renderer");
    xRenderer.labels.template.setAll({
      fontSize: 11,
      fill: am5.color("#6B7280"),
      paddingTop: 10,
    });
    xRenderer.grid.template.setAll({
      strokeOpacity: 0,
    });

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0,
        }),
      })
    );

    const yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
      fontSize: 11,
      fill: am5.color("#9CA3AF"),
    });
    yRenderer.grid.template.setAll({
      stroke: am5.color("#E5E7EB"),
      strokeOpacity: 0.5,
      strokeDasharray: [3, 3],
    });

    function makeSeries(
      name: string,
      fieldName: string,
      color: string,
      isOutline = false,
      width = 80,
      opacity = 1,
      offset = 0
    ) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "category",
          clustered: false,
          fill: am5.color(color),
          stroke: am5.color(color),
        })
      );

      series.columns.template.setAll({
        width: am5.percent(width),
        tooltipText: "",
        cornerRadiusTL: 4,
        cornerRadiusTR: 4,
        strokeWidth: 0,
        fillOpacity: isOutline ? 0 : opacity,
        dx: offset,
      });

      
      series.columns.template.events.on("pointerover", function (ev) {
        const dataItem = ev.target.dataItem;
        if (dataItem && chartRef.current) {
          const rect = chartRef.current.getBoundingClientRect();
          const column = ev.target;
          const x = column.x() + column.width() / 2;
          
          const dataContext = dataItem.dataContext as ChartData;
          const actualValue = dataContext.actual;
          const previousValue = dataContext.previous;
          const changePercent = previousValue !== 0 
            ? (((actualValue - previousValue) / previousValue) * 100).toFixed(1)
            : "0.0";
          const changeSign = parseFloat(changePercent) >= 0 ? "+" : "";
      
          setHoveredData({
            location: dataContext.category,
            value: actualValue.toLocaleString(),
            change: `${changeSign}${changePercent}%`,
            x: x,
          });
        }
      });

      series.columns.template.events.on("pointerout", function () {
        setHoveredData(null);
      });

      series.data.setAll(data);
      series.appear();

      return series;
    }

    // makeSeries("Prv. Year", "previous", "#D1D5DB", false, 85, 0.4);
    makeSeries("Prv. Year", "previous", "#D1D5DB", false, 70, 1, -15);
    makeSeries("Actual", "actual", "#7B93DB", false, 70, 1);
    makeSeries("Target", "target", "#4F6FD8", true, 70, 1);

    const legendContainer = chart.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        layout: root.horizontalLayout,
        x: am5.percent(58),
        centerX: am5.percent(50),
        paddingTop: 270,
        paddingBottom: 5,
      })
    );

    // const createLegendItem = (
    //   name: string,
    //   color: string,
    //   isOutline = false
    // ) => {
    //   const container = legendContainer.children.push(
    //     am5.Container.new(root, {
    //       layout: root.horizontalLayout,
    //       marginRight: 20,
    //     })
    //   );

    //   container.children.push(
    //     am5.Rectangle.new(root, {
    //       width: 14,
    //       height: 14,
    //       fill: isOutline
    //         ? am5.color("rgba(255, 255, 255, 0)")
    //         : am5.color(color),
    //       stroke: am5.color(color),
    //       strokeWidth: isOutline ? 1.5 : 0,
    //     })
    //   );

    //   container.children.push(
    //     am5.Label.new(root, {
    //       text: name,
    //       fontSize: 12,
    //       fill: am5.color("#6B7280"),
    //       marginLeft: 6,
    //     })
    //   );
    // };

    const createLegendItem = (
      name: string,
      color: string,
      isOutline = false
    ) => {
      const container = legendContainer.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          marginRight: 20,
        })
      );
    
      container.children.push(
        am5.Rectangle.new(root, {
          width: 14,
          height: 14,
          fill: isOutline
            ? am5.color("rgba(255, 255, 255, 0)")
            : am5.color(color),
          stroke: am5.color(color),
          strokeWidth: isOutline ? 1.5 : 0,
          centerY: am5.p50,  // ADDED: Vertically center the rectangle
          y: am5.p50,        // ADDED: Position at 50% of container height
        })
      );
    
      container.children.push(
        am5.Label.new(root, {
          text: name,
          fontSize: 12,
          fill: am5.color("#6B7280"),
          marginLeft: 6,
          centerY: am5.p50,  // ADDED: Vertically center the label
          y: am5.p50,        // ADDED: Position at 50% of container height
        })
      );
    };

    // createLegendItem("Actual", "#7B93DB", false);
    // createLegendItem("Prv. Year", "#D1D5DB", false);
    // createLegendItem("Target", "#9CA3AF", false);
    createLegendItem("Actual", "#7B93DB", false);
    createLegendItem("Prv. Year", "#D1D5DB", false);
    createLegendItem("Target", "#4F6FD8", true);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, location, value, change]);

  const isNegative = change.startsWith("-");

  return (
    <div className="relative">
      {hoveredData && (
        <div
          className="absolute top-0 flex flex-col pointer-events-none"
          style={{ left: `${hoveredData.x}px`, transform: "translateX(-50%)" }}
        >
          <div className="flex flex-col justify-center items-center gap-1 shadow-lg bg-white py-2 px-4 rounded-md">
            <p className="text-md text-gray-500 ">{hoveredData.location}</p>
            <h2 className="text-2xl font-semibold text-blue-900">
              {hoveredData.value}
            </h2>
            <div
              className={`flex items-center gap-1 text-xs ${
                isNegative ? "text-red-600" : "text-green-600"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border ${
                  isNegative ? "border-red-600" : "border-green-600"
                }`}
              >
                <Target />
              </span>
              <span>{hoveredData.change}</span>
            </div>
          </div>
          <div
            className="w-px bg-gray-300 mt-2"
            style={{
              height: "210px",
              marginLeft: "80%",
              borderLeft: "1px dashed #D1D5DB",
            }}
          />
        </div>
      )}
      <div ref={chartRef} className="w-full h-[380px]" />
      {/* {data.map((item, index) => 
        item.flagged ? (
          <div 
            key={index}
            className="absolute" 
            style={{ 
              bottom: "52px", 
              left: `${50 + (index * (820 / data.length))}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <Flag className="w-3 h-3 text-gray-900" fill="currentColor" />
          </div>
        ) : null
      )} */}
    </div>
  );
};
