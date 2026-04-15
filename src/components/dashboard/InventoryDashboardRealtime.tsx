"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Link from "next/link";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import Button from "@/default_components/ui/button/Button";
import type {
  InboundOutboundMonthlyPoint,
  InboundOutboundOrderCountResponse,
  OverviewSummaryResponse,
} from "@/interfaces/inventoryManagementType";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type DashboardChartRange = {
  fromValue: string;
  toValue: string;
  label: string;
  isCapped: boolean;
};

type InventoryDashboardRealtimeProps = {
  overview: OverviewSummaryResponse | null;
  monthlyPoints: InboundOutboundMonthlyPoint[];
  totalSummary: InboundOutboundOrderCountResponse | null;
  errors: string[];
  quantityRange: DashboardChartRange;
  orderRange: DashboardChartRange;
  maxRangeMonths: number;
};

type ProductQuantityRow = {
  productId: number | null;
  productCode: string;
  productName: string;
  totalQuantity: number;
};

function formatMetric(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function InventoryDashboardRealtime({
  overview,
  monthlyPoints,
  totalSummary,
  errors,
  quantityRange,
  orderRange,
  maxRangeMonths,
}: InventoryDashboardRealtimeProps) {
  const totalCategories = overview?.totalCategories ?? 0;
  const totalProducts = overview?.totalProducts ?? 0;
  const totalWarehouses = overview?.totalWarehouses ?? 0;
  const todayInboundOrders = overview?.todayInboundOrders ?? 0;
  const todayOutboundOrders = overview?.todayOutboundOrders ?? 0;
  const todayTotalOrders = todayInboundOrders + todayOutboundOrders;

  const totalInboundOrders = totalSummary?.totalInboundOrders ?? 0;
  const totalOutboundOrders = totalSummary?.totalOutboundOrders ?? 0;
  const totalOrders = totalSummary?.totalOrders ?? 0;

  const quantityChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: {
        show: false,
      },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#2563EB", "#F97316"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "42%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: monthlyPoints.map((point) => point.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatMetric(Math.round(value)),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatMetric(Math.round(value)),
      },
    },
  };

  const quantityChartSeries = [
    {
      name: "Inbound Quantity",
      data: monthlyPoints.map((point) => point.inboundQuantity),
    },
    {
      name: "Outbound Quantity",
      data: monthlyPoints.map((point) => point.outboundQuantity),
    },
  ];

  const orderPoints = totalSummary?.monthlyOrderCounts ?? [];

  const orderCountChartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      toolbar: {
        show: false,
      },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#16A34A", "#DC2626", "#4F46E5"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        sizeOffset: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: orderPoints.map((point) => point.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatMetric(Math.round(value)),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatMetric(Math.round(value)),
      },
    },
  };

  const orderCountChartSeries = [
    {
      name: "Inbound Orders",
      data: orderPoints.map((point) => point.inboundOrders),
    },
    {
      name: "Outbound Orders",
      data: orderPoints.map((point) => point.outboundOrders),
    },
    {
      name: "Total Orders",
      data: orderPoints.map((point) => point.totalOrders),
    },
  ];

  const faultCounts = overview?.faultCounts ?? [];
  const faultPieOptions: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
    },
    labels: faultCounts.map((item) => formatStatusLabel(item.handlingStatus)),
    colors: ["#DC2626", "#F59E0B", "#16A34A", "#0EA5E9", "#7C3AED"],
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => {
        const numericValue = typeof value === "number" ? value : Number(value);
        return Number.isFinite(numericValue)
          ? `${numericValue.toFixed(1)}%`
          : `${value}%`;
      },
      style: {
        colors: ["#ffffff"],
        fontSize: "18px",
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatMetric(Math.round(value)),
      },
    },
    stroke: {
      colors: ["#ffffff"],
    },
  };

  const faultPieSeries = faultCounts.map((item) => item.total);

  const productQuantities = [...(overview?.productQuantities ?? [])]
    .sort((left, right) => right.totalQuantity - left.totalQuantity)
    .slice(0, 8);

  const productQuantityRows: ProductQuantityRow[] = productQuantities.map(
    (item) => ({
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      totalQuantity: item.totalQuantity,
    }),
  );

  const productQuantityHeaders: Column<ProductQuantityRow>[] = [
    {
      key: "productCode",
      label: "Product Code",
      stopCenterData: true,
      minWidth: 180,
    },
    {
      key: "productName",
      label: "Product Name",
      stopCenterData: true,
      minWidth: 260,
    },
    {
      key: "totalQuantity",
      label: "Total Quantity",
      stopCenterData: true,
      minWidth: 180,
      filter: "agNumberColumnFilter",
      render: (_value, row) => (
        <div className="w-full text-right font-medium text-gray-800 dark:text-white/90">
          {formatMetric(row.totalQuantity)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400 rounded-xl border px-4 py-3 text-sm">
          {errors.join(" | ")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="border-brand-200 dark:border-brand-800/40 dark:from-brand-500/20 rounded-2xl border bg-white bg-gradient-to-br p-5 dark:to-gray-900">
          <p className="text-brand-700 dark:text-brand-300 mb-4 text-lg font-semibold">
            Total
          </p>

          <div className="divide-brand-200 dark:divide-brand-800/50 divide-y">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total Categories
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalCategories)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total Products
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalProducts)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total Warehouses
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalWarehouses)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-brand-700 mb-4 text-lg font-semibold dark:text-gray-200">
            Today
          </p>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today Inbound Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(todayInboundOrders)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today Outbound Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(todayOutboundOrders)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today Total Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(todayTotalOrders)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-brand-700 mb-4 text-lg font-semibold dark:text-gray-200">
            Total Orders (Selected Range)
          </p>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Inbound Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalInboundOrders)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Outbound Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalOutboundOrders)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Orders
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {formatMetric(totalOrders)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 xl:col-span-8 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Inbound/Outbound Quantity by Month
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Current range: {quantityRange.label}
              </p>
            </div>

            <form method="get" className="flex flex-wrap items-end gap-2">
              <div>
                <label
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                  htmlFor="q-from-month"
                >
                  From
                </label>
                <input
                  id="q-from-month"
                  name="qFrom"
                  type="month"
                  defaultValue={quantityRange.fromValue}
                  className="focus:border-brand-500 focus:ring-brand-500/20 h-10 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-800 outline-none focus:ring-2 dark:border-gray-700 dark:text-white/90"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                  htmlFor="q-to-month"
                >
                  To
                </label>
                <input
                  id="q-to-month"
                  name="qTo"
                  type="month"
                  defaultValue={quantityRange.toValue}
                  className="focus:border-brand-500 focus:ring-brand-500/20 h-10 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-800 outline-none focus:ring-2 dark:border-gray-700 dark:text-white/90"
                />
              </div>

              <input type="hidden" name="oFrom" value={orderRange.fromValue} />
              <input type="hidden" name="oTo" value={orderRange.toValue} />

              <Button type="submit" size="sm">
                Apply
              </Button>
              <Link href="/">
                <Button type="button" size="sm" variant="outline">
                  Reset
                </Button>
              </Link>
            </form>
          </div>

          {quantityRange.isCapped && (
            <p className="mb-4 text-xs text-amber-600 dark:text-amber-400">
              Quantity range was limited to the latest {maxRangeMonths} months.
            </p>
          )}

          {monthlyPoints.length > 0 ? (
            <div className="custom-scrollbar max-w-full overflow-x-auto">
              <div className="min-w-[760px] xl:min-w-full">
                <ReactApexChart
                  options={quantityChartOptions}
                  series={quantityChartSeries}
                  type="bar"
                  height={320}
                />
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              No monthly quantity data available for this range.
            </p>
          )}
        </div>

        <div className="col-span-12 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 xl:col-span-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-brand-700 text-lg font-semibold dark:text-white/90">
            Fault Type Distribution
          </h3>

          <div className="mt-4">
            {faultPieSeries.length > 0 ? (
              <ReactApexChart
                options={faultPieOptions}
                series={faultPieSeries}
                type="pie"
                height={300}
              />
            ) : (
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                No fault status data available.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Inbound/Outbound Order Number by Month
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Current range: {orderRange.label}
            </p>
          </div>

          <form method="get" className="flex flex-wrap items-end gap-2">
            <div>
              <label
                className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                htmlFor="o-from-month"
              >
                From
              </label>
              <input
                id="o-from-month"
                name="oFrom"
                type="month"
                defaultValue={orderRange.fromValue}
                className="focus:border-brand-500 focus:ring-brand-500/20 h-10 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-800 outline-none focus:ring-2 dark:border-gray-700 dark:text-white/90"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                htmlFor="o-to-month"
              >
                To
              </label>
              <input
                id="o-to-month"
                name="oTo"
                type="month"
                defaultValue={orderRange.toValue}
                className="focus:border-brand-500 focus:ring-brand-500/20 h-10 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-gray-800 outline-none focus:ring-2 dark:border-gray-700 dark:text-white/90"
              />
            </div>

            <input type="hidden" name="qFrom" value={quantityRange.fromValue} />
            <input type="hidden" name="qTo" value={quantityRange.toValue} />

            <Button type="submit" size="sm">
              Apply
            </Button>
            <Link href="/">
              <Button type="button" size="sm" variant="outline">
                Reset
              </Button>
            </Link>
          </form>
        </div>

        {orderRange.isCapped && (
          <p className="mb-4 text-xs text-amber-600 dark:text-amber-400">
            Order range was limited to the latest {maxRangeMonths} months.
          </p>
        )}

        {orderPoints.length > 0 ? (
          <div className="custom-scrollbar max-w-full overflow-x-auto">
            <div className="min-w-[760px] xl:min-w-full">
              <ReactApexChart
                options={orderCountChartOptions}
                series={orderCountChartSeries}
                type="line"
                height={320}
              />
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            No order count data available for this range.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Product Quantities
        </h3>

        <div className="mt-4">
          {productQuantityRows.length > 0 ? (
            <CustomizableTable<ProductQuantityRow>
              headers={productQuantityHeaders}
              data={productQuantityRows}
              getRowId={(params) =>
                `${params.data.productId ?? "na"}-${params.data.productCode}`
              }
              defaultColDef={{
                filter: false,
                cellClass: "flex items-center justify-center",
                headerClass: "text-center",
              }}
            />
          ) : (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              No product quantity summary available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
