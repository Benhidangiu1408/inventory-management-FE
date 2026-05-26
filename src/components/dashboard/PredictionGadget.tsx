"use client";

import { useState, useEffect, useMemo } from "react";
import { BrainCircuit } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getDemandPredictionAction } from "@/actions/system-info";
import { ProductResponse } from "@/interfaces/warehouseManagementType";

// Dynamically import the ReactApexChart component to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type DemandPredictionWidgetProps = {
  products: ProductResponse[];
};

export default function DemandPredictionWidget({
  products,
}: DemandPredictionWidgetProps) {
  const predictionOptions = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) =>
      a.code.localeCompare(b.code),
    );

    // 2. Map the sorted products to the P000X model IDs
    return sortedProducts.map((realProduct, i) => {
      const modelId = `item_${String(i + 1)}`; // e.g., item_1, item_2

      return {
        id: modelId,
        label: `${realProduct.code} - ${realProduct.name}`,
      };
    });
  }, [products]);

  // Default to P0001
  const [selectedModelId, setSelectedModelId] = useState<string>(
    predictionOptions[0].id,
  );

  const [predictions, setPredictions] = useState<{
    [key: number]: number | null;
  }>({
    1: null,
    7: null,
    30: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedModelId) return;

    let isMounted = true;
    setLoading(true);

    const fetchPredictions = async () => {
      try {
        // We now pass the fake 'P000X' model ID to the server action instead of the real product code
        const [day1, day7, day30] = await Promise.all([
          getDemandPredictionAction(selectedModelId, 1),
          getDemandPredictionAction(selectedModelId, 7),
          getDemandPredictionAction(selectedModelId, 30),
        ]);

        if (isMounted) {
          setPredictions({ 1: day1, 7: day7, 30: day30 });
        }
      } catch (error) {
        console.error("Error fetching predictions", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPredictions();

    return () => {
      isMounted = false;
    };
  }, [selectedModelId]);

  // --- Chart Configuration ---
  const chartOptions: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF"], // Brand color for the line
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area", // Keep as area for the gradient fill
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: true },
      },
      borderColor: "rgba(107, 114, 128, 0.1)", // subtle grid border for dark mode compatibility
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "dark", // ensures tooltips look good in dark mode
    },
    xaxis: {
      type: "category",
      categories: ["Tomorrow", "Next 7 Days", "Next 30 Days"], // Aligned with the 3 points
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: ["#6B7280", "#6B7280", "#6B7280"],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val) => Math.round(val).toString(),
      },
    },
  };

  // Chart data series mapped dynamically from API state
  const chartSeries = [
    {
      name: "Predicted Demand",
      data: [predictions[1] || 0, predictions[7] || 0, predictions[30] || 0],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header & Controls */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit
            className="text-brand-600 dark:text-brand-400"
            size={24}
          />
          <h3 className="text-brand-700 text-lg font-semibold dark:text-gray-200">
            AI Demand Prediction
          </h3>
        </div>

        <select
          className="focus:border-brand-500 focus:ring-brand-500/20 h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 outline-none focus:ring-2 dark:border-gray-700 dark:text-white/90"
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
        >
          {predictionOptions.map((opt) => (
            <option key={opt.id} value={opt.id} className="dark:bg-gray-800">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Tomorrow", days: 1 },
          { label: "Next 7 Days", days: 7 },
          { label: "Next 30 Days", days: 30 },
        ].map((timeframe) => (
          <div
            key={timeframe.days}
            className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/50 dark:bg-gray-900/20"
          >
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {timeframe.label}
            </span>
            <div className="mt-2">
              {loading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {predictions[timeframe.days] !== null
                    ? new Intl.NumberFormat("vi-VN").format(
                        Math.round(predictions[timeframe.days]!),
                      )
                    : "—"}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    units
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="mt-6 w-full border-t border-gray-100 pt-4 dark:border-gray-800/50">
        {loading ? (
          <div className="flex h-[310px] items-center justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800/50"></div>
          </div>
        ) : (
          <div className="-ml-2 max-w-full overflow-hidden">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={310}
            />
          </div>
        )}
      </div>
    </div>
  );
}
