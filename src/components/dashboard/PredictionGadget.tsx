"use client";

import { useState, useEffect, useMemo } from "react";
import { BrainCircuit } from "lucide-react";
import { getDemandPredictionAction } from "@/actions/system-info";

type ProductOption = {
  productCode: string;
  productName: string;
};

type DemandPredictionWidgetProps = {
  products: ProductOption[];
};

export default function DemandPredictionWidget({
  products,
}: DemandPredictionWidgetProps) {
  const predictionOptions = useMemo(() => {
    return Array.from({ length: products.length }, (_, i) => {
      const modelId = `P${String(i + 1).padStart(4, "0")}`; // e.g., P0001, P0002
      const realProduct = products[i];

      return {
        id: modelId,
        label: `${realProduct.productCode} - ${realProduct.productName}`,
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
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
    </div>
  );
}
