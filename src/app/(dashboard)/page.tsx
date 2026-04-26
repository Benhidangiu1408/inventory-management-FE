import InventoryDashboardRealtime from "@/components/dashboard/InventoryDashboardRealtime";
import type {
  InboundOutboundMonthlyPoint,
  InboundOutboundMonthlyRequest,
  InboundOutboundOrderCountResponse,
  OverviewSummaryResponse,
} from "@/interfaces/inventoryManagementType";
import { inventoryDashboardService } from "@/services/InventoryManagementService";
// import { predictionService } from "@/services/PredictionService";

type DashboardQueryParams = Record<string, string | string[] | undefined>;

type DashboardPageProps = {
  searchParams?: Promise<DashboardQueryParams>;
};

type YearMonth = {
  month: number;
  year: number;
};

type DashboardChartRange = {
  request: InboundOutboundMonthlyRequest;
  fromValue: string;
  toValue: string;
  label: string;
  isCapped: boolean;
};

const DEFAULT_MONTH_RANGE = 6;
const MAX_MONTH_RANGE = 24;

function toQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseYearMonth(value?: string): YearMonth | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
  };
}

function compareYearMonth(left: YearMonth, right: YearMonth): number {
  if (left.year === right.year) {
    return left.month - right.month;
  }

  return left.year - right.year;
}

function shiftYearMonth(base: YearMonth, monthOffset: number): YearMonth {
  const shifted = new Date(base.year, base.month - 1 + monthOffset, 1);

  return {
    year: shifted.getFullYear(),
    month: shifted.getMonth() + 1,
  };
}

function toYearMonthValue(value: YearMonth): string {
  return `${value.year}-${String(value.month).padStart(2, "0")}`;
}

function toYearMonthLabel(value: YearMonth): string {
  return `${String(value.month).padStart(2, "0")}/${value.year}`;
}

function monthsBetweenInclusive(from: YearMonth, to: YearMonth): number {
  return (to.year - from.year) * 12 + (to.month - from.month) + 1;
}

function buildMonthlyRangeRequest(
  from: YearMonth,
  to: YearMonth,
): InboundOutboundMonthlyRequest {
  const monthsSpan = monthsBetweenInclusive(from, to);
  const cappedSpan = Math.min(monthsSpan, MAX_MONTH_RANGE);
  const cappedFrom =
    monthsSpan > MAX_MONTH_RANGE
      ? shiftYearMonth(to, -(MAX_MONTH_RANGE - 1))
      : from;

  const months = Array.from({ length: cappedSpan }, (_, index) => {
    const current = shiftYearMonth(cappedFrom, index);

    return {
      month: current.month,
      year: current.year,
    };
  });

  return { months };
}

function resolveRangeFromQuery(
  params: DashboardQueryParams,
  fromKey: string,
  toKey: string,
  defaultTo: YearMonth,
): DashboardChartRange {
  const defaultFrom = shiftYearMonth(defaultTo, -(DEFAULT_MONTH_RANGE - 1));
  const requestedFrom = parseYearMonth(toQueryValue(params[fromKey]));
  const requestedTo = parseYearMonth(toQueryValue(params[toKey]));

  let selectedFrom = requestedFrom ?? defaultFrom;
  let selectedTo = requestedTo ?? defaultTo;

  if (compareYearMonth(selectedFrom, selectedTo) > 0) {
    [selectedFrom, selectedTo] = [selectedTo, selectedFrom];
  }

  const request = buildMonthlyRangeRequest(selectedFrom, selectedTo);
  const appliedFrom = request.months[0];
  const appliedTo = request.months[request.months.length - 1];

  return {
    request,
    fromValue: toYearMonthValue(selectedFrom),
    toValue: toYearMonthValue(selectedTo),
    label: `${toYearMonthLabel(appliedFrom)} - ${toYearMonthLabel(appliedTo)}`,
    isCapped:
      monthsBetweenInclusive(selectedFrom, selectedTo) > MAX_MONTH_RANGE,
  };
}

async function resolveSearchParams(
  searchParams?: Promise<DashboardQueryParams>,
): Promise<DashboardQueryParams> {
  if (!searchParams) {
    return {};
  }

  return await searchParams;
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  // const response = await predictionService.predict({
  //   product_id: "P0001",
  //   horizon: 7,
  //   Price: 25.5,
  //   Discount: 0.05,
  //   "Competitor Pricing": 26.0,
  //   "Units Sold": 120,
  //   Seasonality: "Autumn",
  //   Category: "Groceries",
  //   Region: "North",
  //   "Weather Condition": "Rainy",
  //   "Holiday/Promotion": 0,
  //   // Optional cross-sales data
  //   Sales_Today_P0001: 120,
  //   Sales_Today_P0002: 45,
  // });

  // console.log(`Predicted Units: ${response.predicted_units}`);
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const now = new Date();
  const defaultTo: YearMonth = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };

  const quantityRange = resolveRangeFromQuery(
    resolvedSearchParams,
    "qFrom",
    "qTo",
    defaultTo,
  );

  const orderRange = resolveRangeFromQuery(
    resolvedSearchParams,
    "oFrom",
    "oTo",
    defaultTo,
  );

  let overviewResult: OverviewSummaryResponse | null = null;
  let monthlyResult: InboundOutboundMonthlyPoint[] = [];
  let totalResult: InboundOutboundOrderCountResponse | null = null;
  let error: string | null = null;
  try {
    overviewResult = await inventoryDashboardService.getOverviewSummary();
    monthlyResult =
      await inventoryDashboardService.getInboundOutboundMonthlySummary(
        quantityRange.request,
      );
    totalResult =
      await inventoryDashboardService.getInboundOutboundTotalSummary(
        orderRange.request,
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error = `Could not load data from server. ${e.message}`;
  }

  return (
    <InventoryDashboardRealtime
      overview={overviewResult}
      monthlyPoints={monthlyResult}
      totalSummary={totalResult}
      error={error}
      quantityRange={quantityRange}
      orderRange={orderRange}
      maxRangeMonths={MAX_MONTH_RANGE}
    />
  );
}
